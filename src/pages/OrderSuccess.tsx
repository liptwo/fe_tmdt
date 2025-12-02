import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, CreditCard } from 'lucide-react';
// import { useAuth } from '@/context/auth-context'; // TODO: Uncomment when API ready
// import { ordersApi } from '@/lib/api'; // TODO: Uncomment when API ready
import type { Order } from '@/lib/api';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  // const { token } = useAuth(); // TODO: Uncomment when API ready
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // TODO: Tích hợp API sau khi backend sẵn sàng
    // const fetchOrder = async () => {
    //   try {
    //     const data = await ordersApi.getById(token, orderId);
    //     setOrder(data);
    //   } catch (error) {
    //     console.error('[OrderSuccess] Failed to fetch order:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchOrder();

    // Mock order data for testing UI
    const mockOrder: Order = {
      id: orderId,
      userId: 'user-123',
      orderNumber: orderId,
      status: 'PENDING',
      totalAmount: '500000',
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        address: '123 Đường ABC',
        city: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé'
      },
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      note: '',
      items: [
        {
          id: 'item-1',
          orderId: orderId,
          productId: 'product-1',
          quantity: 2,
          unitPrice: '250000',
          product: {
            id: 'product-1',
            name: 'Sản phẩm demo',
            description: 'Mô tả sản phẩm',
            price: 250000,
            stock: 100,
            images: [],
            status: 'ACTIVE',
            categoryId: 'cat-1',
            sellerId: 'seller-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrder(mockOrder);
    setIsLoading(false);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package size={80} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-500 mb-6">
            Đơn hàng không tồn tại hoặc bạn không có quyền truy cập
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'VNPAY':
        return 'Thanh toán VNPAY';
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'PAID':
        return 'Đã thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      default:
        return status;
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'SHIPPING':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>
          <div className="inline-block bg-orange-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="text-xl font-bold text-orange-500">{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin đơn hàng</h2>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-start gap-3">
              <Package className="text-orange-500 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Trạng thái đơn hàng</p>
                <p className="font-semibold text-gray-900">{getOrderStatusLabel(order.status)}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-start gap-3">
              <CreditCard className="text-orange-500 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                <p className="font-semibold text-gray-900">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </p>
                <p className="text-sm text-gray-500">
                  Trạng thái: {getPaymentStatusLabel(order.paymentStatus)}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start gap-3">
              <MapPin className="text-orange-500 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-gray-700">{order.shippingAddress.phoneNumber}</p>
                <p className="text-gray-700">
                  {order.shippingAddress.address}
                  {order.shippingAddress.ward && `, ${order.shippingAddress.ward}`}
                  {order.shippingAddress.district && `, ${order.shippingAddress.district}`}
                  , {order.shippingAddress.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sản phẩm</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                {item.product?.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.product?.name || 'Sản phẩm'}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">x{item.quantity}</span>
                    <span className="font-semibold text-orange-500">
                      ₫{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900">₫{Number(order.totalAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 flex items-center gap-1">
                <Truck size={16} />
                Phí vận chuyển
              </span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
              <span>Tổng cộng</span>
              <span className="text-orange-500">₫{Number(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/user/orders"
            className="flex-1 bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Xem đơn hàng của tôi
          </Link>
          <Link
            to="/"
            className="flex-1 border border-orange-500 text-orange-500 text-center py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

