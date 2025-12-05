import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Truck, Check, X, QrCode } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { ordersApi } from '@/lib/api';
import type { ShippingAddress } from '@/lib/api';

import { toast } from 'sonner';

// Import QR code image - Bạn có thể thay đổi đường dẫn này
import vnpayQR from '@/assets/payment/pay1.png'; // Thay bằng QR code VNPAY của bạn

type PaymentMethod = 'COD' | 'VNPAY' | 'BANK_TRANSFER';

export function Checkout() {
  const { user, token } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '',
    phoneNumber: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVNPayQR, setShowVNPayQR] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  // 🟢 Load saved profile data from localStorage to auto-populate shipping address
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
    
    setShippingAddress({
      fullName: user?.fullName || savedProfile.name || '',
      phoneNumber: savedProfile.phone || '',
      address: savedProfile.address || '',
      city: savedProfile.city || '',
      district: savedProfile.district || '',
      ward: savedProfile.ward || ''
    });
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!shippingAddress.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(shippingAddress.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng');
      navigate('/cart');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Nếu chọn VNPAY và chưa xác nhận thanh toán, hiển thị QR
    if (paymentMethod === 'VNPAY' && !paymentConfirmed) {
      setShowVNPayQR(true);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('[Checkout] Creating order with payload:', {
        shippingAddress,
        paymentMethod,
        note: note.trim() || undefined
      });

      // Call real API
      const response = await ordersApi.create(token, {
        shippingAddress,
        paymentMethod,
        note: note.trim() || undefined
      });

      console.log('[Checkout] Order created successfully:', response);

      // Clear cart after successful order
      await refreshCart();

      // Show success message
      toast.success('✅ Đặt hàng thành công!');

      // Navigate to success page with real order ID
      const orderId = response.id;
      
      if (response.paymentUrl) {
          // Handle payment URL if needed in future
      }

      navigate(`/order-success?orderId=${orderId}`);
    } catch (error: any) {
      console.error('[Checkout] Failed to create order:', error);
      console.error('[Checkout] Error details:', {
        message: error?.message,
        status: error?.status,
        details: error?.details
      });
      
      // Show detailed error message
      const errorMessage = error?.message || error?.details?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVNPayConfirm = () => {
    setPaymentConfirmed(true);
    setShowVNPayQR(false);
    // Tự động submit form sau khi confirm
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + Number(item.unitPrice) * item.quantity;
    }, 0);
  };

  if (!user || !cart || cart.items.length === 0) {
    return null;
  }

  const total = calculateTotal();
  const shippingFee = 0; // Free shipping
  const finalTotal = total + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-orange-500" size={28} />
            <h1 className="text-2xl font-bold text-orange-500">ShopOnline</h1>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <h2 className="text-xl text-gray-700">Thanh toán</h2>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-orange-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Địa chỉ giao hàng</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phoneNumber}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0912345678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.ward}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, ward: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Phường/Xã"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.district}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, district: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Quận/Huyện"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Hà Nội, TP. Hồ Chí Minh, ..."
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
        </div>
      </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="text-orange-500" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as PaymentMethod);
                        setPaymentConfirmed(false); // Reset khi đổi phương thức
                      }}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900">Thanh toán VNPAY</p>
                      <p className="text-sm text-gray-500">Thanh toán qua VNPAY QR</p>
                      {paymentMethod === 'VNPAY' && paymentConfirmed && (
                        <div className="flex items-center gap-1 mt-2 text-green-600">
                          <Check size={16} />
                          <span className="text-xs font-medium">Đã xác nhận thanh toán</span>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-500">Chuyển khoản qua số tài khoản</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú đơn hàng (không bắt buộc)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Đơn hàng</h3>

                {/* Products */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.product?.name}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-500">x{item.quantity}</span>
                          <span className="text-sm font-semibold text-orange-500">
                            ₫{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>₫{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck size={16} />
                      Phí vận chuyển
                    </span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-orange-500">₫{finalTotal.toLocaleString()}</span>
                  </div>
              </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Đặt hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* VNPAY QR Modal */}
        {showVNPayQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full relative my-8">
              {/* Close button */}
              <button
                onClick={() => setShowVNPayQR(false)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 shadow-md"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
                    <QrCode size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      Thanh toán VNPAY
                    </h3>
                    <p className="text-green-100 text-sm">
                      Quét mã QR để hoàn tất thanh toán
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* 2 Column Layout - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Left Column - QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 w-full flex items-center justify-center">
                      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                        <img
                          src={vnpayQR}
                          alt="VNPAY QR Code"
                          className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Amount - Mobile only (hiển thị dưới QR trên mobile) */}
                    <div className="lg:hidden w-full mt-4">
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Số tiền cần thanh toán</p>
                        <p className="text-3xl font-bold text-orange-500">
                          ₫{finalTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Info & Instructions */}
                  <div className="flex flex-col justify-between">
                    {/* Amount - Desktop only */}
                    <div className="hidden lg:block mb-6">
                      <div className="bg-orange-50 rounded-lg p-5 text-center border-2 border-orange-200">
                        <p className="text-sm text-gray-600 mb-2">Số tiền cần thanh toán</p>
                        <p className="text-4xl font-bold text-orange-500">
                          ₫{finalTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Vietcombank</p>
                          <p className="text-sm text-gray-600">NGUYEN HA PHUC</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>STK:</strong> 1041853461</p>
                        <p><strong>Chi nhánh:</strong> Thủ Thiêm</p>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">
                          i
                        </div>
                        Hướng dẫn thanh toán
                      </h4>
                      <ol className="space-y-2">
                        <li className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            1
                          </span>
                          <span>Mở app ngân hàng hoặc ví điện tử</span>
                        </li>
                        <li className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            2
                          </span>
                          <span>Chọn chức năng quét mã QR</span>
                        </li>
                        <li className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            3
                          </span>
                          <span>Quét mã QR bên trái</span>
                        </li>
                        <li className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            4
                          </span>
                          <span>Kiểm tra thông tin và xác nhận thanh toán</span>
                        </li>
                        <li className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            5
                          </span>
                          <span>Click "Đã thanh toán" để hoàn tất đơn hàng</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowVNPayQR(false)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleVNPayConfirm}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Check size={20} />
                      Đã thanh toán
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    ⚠️ Vui lòng không đóng trang này cho đến khi hoàn tất thanh toán
                  </p>
                </div>
              </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
