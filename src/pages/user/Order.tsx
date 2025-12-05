import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, MessagesSquare, CheckCircle2, RotateCcw, XCircle, Eye, Star } from "lucide-react";
import Sp from "./image/sp.jpg";
import { useOrders } from "@/hooks/use-orders";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { cartApi } from "@/lib/api";
import { toast } from "sonner";

const Order = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { refreshCart } = useCart();
  const [receivedVouchers, setReceivedVouchers] = useState<any[]>([]);
  
  // ✅ Lấy orders từ API
  const { orders: apiOrders, loading, error, fetchOrders, cancelOrder } = useOrders();

  // Fetch orders khi component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Helper function to map status to Vietnamese
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "CHỜ XÁC NHẬN",
      processing: "ĐANG XỬ LÝ", 
      shipped: "ĐANG GIAO",
      delivered: "HOÀN THÀNH",
      cancelled: "ĐÃ HỦY"
    };
    return statusMap[status] || status.toUpperCase();
  };

  // Map API orders to display format
  const orders = apiOrders.map(order => ({
    id: order.id,
    shopName: "ShopOnline Store", // TODO: Add shop info to API
    productName: order.items?.[0]?.product?.name || "Sản phẩm",
    variant: "Mặc định",
    quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    price: Number(order.totalAmount),
    oldPrice: Number(order.totalAmount),
    image: order.items?.[0]?.product?.images?.[0] || Sp,
    status: order.status, // pending, processing, shipped, delivered, cancelled
    statusText: getStatusText(order.status),
    items: order.items // Keep items for Buy Again
  }));

  // 🧠 Lấy danh sách voucher đã nhận
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vouchers") || "[]");
    setReceivedVouchers(stored);
  }, []);

  // 🧾 Tặng voucher khi đơn hoàn thành
  const addVoucher = (order: any) => {
    // Kiểm tra đã nhận chưa
    const existing = receivedVouchers.find((v) => v.orderId === order.id);
    if (existing) {
      toast.info("Bạn đã nhận voucher cho đơn này rồi!");
      return;
    }

    // Voucher mới
    const newVoucher = {
      orderId: order.id,
      title: "Giảm 15% tối đa 1tr",
      desc: `Đơn hàng #${order.id} hoàn thành! Nhận ngay voucher đặc biệt.`,
      code: `SALE-${Math.floor(1000 + Math.random() * 9000)}`,
      valid: "Hiệu lực trong 7 ngày",
    };

    const updated = [...receivedVouchers, newVoucher];
    setReceivedVouchers(updated);
    localStorage.setItem("vouchers", JSON.stringify(updated));

    toast.success("🎉 Nhận voucher thành công!");
  };

  // 🚫 Hủy đơn hàng
  const handleCancelOrder = (orderId: string) => {
    toast("Bạn có chắc chắn muốn hủy đơn hàng này không?", {
      action: {
        label: "Hủy đơn",
        onClick: async () => {
          try {
            await cancelOrder(orderId);
            toast.success("Đã hủy đơn hàng thành công");
          } catch (error) {
            toast.error("Hủy đơn hàng thất bại");
          }
        },
      },
      cancel: {
        label: "Đóng",
        onClick: () => console.log("Cancel"),
      },
    });
  };

  // 🛒 Mua lại
  const handleBuyAgain = async (order: any) => {
    if (!token) return;
    try {
      toast.loading("Đang thêm vào giỏ hàng...");
      
      // Add all items from order to cart
      const promises = order.items.map((item: any) => 
        cartApi.addItem(token, {
          productId: item.productId,
          quantity: item.quantity
        })
      );
      
      await Promise.all(promises);
      await refreshCart();
      
      toast.dismiss();
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/cart");
    } catch (error) {
      toast.dismiss();
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  // 💬 Chat với shop
  const handleChat = () => {
    toast.info("Tính năng chat đang phát triển");
  };

  // ⭐ Đánh giá
  const handleReview = () => {
    toast.info("Tính năng đánh giá đang phát triển");
  };

  // 👁️ Xem chi tiết
  const handleViewDetails = (orderId: string) => {
    // navigate(`/user/purchase/order/${orderId}`);
    toast.info(`Xem chi tiết đơn hàng: ${orderId}`);
  };

  // 🔹 Hiển thị danh sách đơn
  const renderOrders = (status: string) => {
    // Map tab status to backend status
    const statusMap: Record<string, string> = {
      all: "all",
      confirm: "pending",
      shipping: "processing",
      delivery: "shipped", 
      complete: "delivered",
      canceled: "cancelled",
      returned: "refunded"
    };

    const backendStatus = statusMap[status] || status;
    
    const filtered =
      backendStatus === "all"
        ? orders
        : orders.filter((order) => order.status === backendStatus);

    if (loading) {
      return (
        <p className="text-center text-gray-400 mt-10">
          Đang tải đơn hàng...
        </p>
      );
    }

    if (error) {
      return (
        <p className="text-center text-red-500 mt-10">
          Lỗi: {error}
        </p>
      );
    }

    if (filtered.length === 0)
      return (
        <p className="text-center text-gray-400 mt-10">
          Không có đơn hàng nào.
        </p>
      );

    return filtered.map((order) => {
      const hasVoucher = receivedVouchers.some((v) => v.orderId === order.id);
      return (
        <div
          key={order.id}
          className="bg-white p-4 mt-5 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between mb-5">
            <div className="flex items-center gap-3">
              <Store size={20} />
              <p className="text-medium">{order.shopName}</p>
              <button 
                className="flex text-xs py-0.5 gap-1 px-1.5 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                onClick={handleChat}
              >
                <MessagesSquare size={14} />
                <p>Chat</p>
              </button>
              <button 
                className="flex gap-1 text-xs py-0.5 px-1.5 rounded border hover:bg-gray-50 transition-colors"
                onClick={() => handleViewDetails(order.id)}
              >
                <Eye size={14} />
                <p>Xem chi tiết</p>
              </button>
            </div>
            <div className="flex flex-col items-end justify-center">
              <p className="text-red-600 text-sm font-semibold uppercase">
                {order.statusText}
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-t py-5 cursor-pointer" onClick={() => handleViewDetails(order.id)}>
            <img src={order.image} alt={order.productName} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="text-base font-medium">{order.productName}</p>
              <p className="text-gray-500 text-xs mt-1">
                Phân loại hàng: {order.variant}
              </p>
              <p className="font-bold mt-1">x{order.quantity}</p>
            </div>
            <div className="flex flex-col items-end justify-center">
              <p className="line-through text-gray-400 text-sm">
                {order.oldPrice.toLocaleString()}đ
              </p>
              <p className="text-orange-500 font-semibold">
                {order.price.toLocaleString()}đ
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-end items-center gap-2 mb-4">
              <div className="text-sm text-gray-600">Thành tiền:</div>
              <div className="text-orange-500 font-bold text-xl">
                {order.price.toLocaleString()}đ
              </div>
            </div>

            <div className="flex justify-end gap-3">
              {/* Nút Hủy đơn - Chỉ hiện khi pending */}
              {order.status === "pending" && (
                <button
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  <XCircle size={16} />
                  Hủy đơn hàng
                </button>
              )}

              {/* Nút Mua lại - Hiện khi completed hoặc cancelled */}
              {(order.status === "delivered" || order.status === "cancelled") && (
                <button
                  className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
                  onClick={() => handleBuyAgain(order)}
                >
                  <RotateCcw size={16} />
                  Mua lại
                </button>
              )}

              {/* Nút Đánh giá - Chỉ hiện khi completed */}
              {order.status === "delivered" && (
                <button
                  className="border border-orange-500 text-orange-500 px-6 py-2 rounded hover:bg-orange-50 transition-colors flex items-center gap-2"
                  onClick={handleReview}
                >
                  <Star size={16} />
                  Đánh giá
                </button>
              )}

              {/* Nút Nhận Voucher - Chỉ hiện khi completed và chưa nhận */}
              {order.status === "delivered" && !hasVoucher && (
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded flex items-center gap-2"
                  onClick={() => addVoucher(order)}
                >
                  <CheckCircle2 size={16} />
                  Nhận Voucher
                </button>
              )}
              
              {/* Nút Đã nhận Voucher - Chỉ hiện khi completed và đã nhận */}
              {order.status === "delivered" && hasVoucher && (
                <button
                  className="bg-gray-100 text-gray-400 px-6 py-2 rounded flex items-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <CheckCircle2 size={16} />
                  Đã nhận voucher
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mx-4 text-gray-700 pb-10">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex justify-between border-b flex-wrap bg-white sticky top-0 z-10">
          {[
            { key: "all", label: "Tất cả" },
            { key: "confirm", label: "Chờ xác nhận" },
            { key: "shipping", label: "Vận chuyển" },
            { key: "delivery", label: "Chờ giao hàng" },
            { key: "complete", label: "Hoàn thành" },
            { key: "canceled", label: "Đã hủy" },
            { key: "returned", label: "Trả hàng/Hoàn tiền" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="flex-1 data-[state=active]:border-b-2 
              data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-3 rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {[
          "all",
          "confirm",
          "shipping",
          "delivery",
          "complete",
          "canceled",
          "returned",
        ].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            {renderOrders(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Order;
