import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, MessagesSquare, CheckCircle2 } from "lucide-react";
import Sp from "./image/sp.jpg";

const Order = () => {
  const [receivedVouchers, setReceivedVouchers] = useState([]);

  // 🔸 Danh sách đơn hàng mẫu
  const orders = [
    {
      id: 1,
      shopName: "COLORKEY VIETNAM",
      productName: "1 Hộp 10 Miếng Mặt Nạ Giấy COLORKEY LUMINOUS Vitamin B5",
      variant: "Niacinamide B5",
      quantity: 1,
      price: 88400,
      oldPrice: 208000,
      status: "canceled",
      statusText: "ĐÃ HỦY",
    },
    {
      id: 2,
      shopName: "Balosky",
      productName: "3 Ghim Cài Balo Túi Xách Pin Cài Nhựa PVC",
      variant: "3 Pin cài ngẫu nhiên",
      quantity: 1,
      price: 10000,
      oldPrice: 16000,
      status: "complete",
      statusText: "HOÀN THÀNH",
    },
    {
      id: 3,
      shopName: "ABC Store",
      productName: "Sữa rửa mặt dịu nhẹ ABC",
      variant: "100ml",
      quantity: 1,
      price: 56000,
      oldPrice: 79000,
      status: "confirm",
      statusText: "CHỜ XÁC NHẬN",
    },
  ];

  // 🧠 Lấy danh sách voucher đã nhận
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vouchers") || "[]");
    setReceivedVouchers(stored);
  }, []);

  // 🧾 Tặng voucher khi đơn hoàn thành
  const addVoucher = (order) => {
    // Kiểm tra đã nhận chưa
    const existing = receivedVouchers.find((v) => v.orderId === order.id);
    if (existing) {
      alert("✅ Bạn đã nhận voucher cho đơn này rồi!");
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

    // 🔔 Thông báo nhẹ nhàng
    const msg = document.createElement("div");
    msg.innerText = "🎉 Nhận voucher thành công!";
    msg.className =
      "fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in";
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
  };

  // 🔹 Hiển thị danh sách đơn
  const renderOrders = (status) => {
    const filtered =
      status === "all"
        ? orders
        : orders.filter((order) => order.status === status);

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
              <button className="flex text-xs py-0.5 gap-1 px-1.5 rounded bg-orange-500 text-white">
                <MessagesSquare size={14} />
                <p>Chat</p>
              </button>
              <button className="flex gap-1 text-xs py-0.5 px-1.5 rounded border">
                <Store size={14} />
                <p>Xem shop</p>
              </button>
            </div>

            <div className="text-red-600 text-sm font-semibold">
              {order.statusText}
            </div>
          </div>

          <div className="flex gap-4 border-t py-5">
            <img src={Sp} alt="" className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="text-base">{order.productName}</p>
              <p className="text-gray-400 text-xs">
                Phân loại hàng: {order.variant}
              </p>
              <p className="font-bold">x{order.quantity}</p>
            </div>
            <div className="flex flex-col items-end justify-center">
              <p className="line-through text-gray-400">
                {order.oldPrice.toLocaleString()}đ
              </p>
              <p className="text-red-600 font-semibold">
                {order.price.toLocaleString()}đ
              </p>
            </div>
          </div>

          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">Thành tiền:</div>
            <div className="text-red-500 font-semibold text-lg">
              {order.price.toLocaleString()}đ
            </div>
          </div>

          {order.status === "complete" && (
            <div className="mt-4 text-right">
              {hasVoucher ? (
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded text-sm flex items-center gap-1 justify-center cursor-not-allowed"
                  disabled
                >
                  <CheckCircle2 size={16} />
                  Đã nhận voucher
                </button>
              ) : (
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
                  onClick={() => addVoucher(order)}
                >
                  Nhận Voucher
                </button>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mx-4 text-gray-700">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex justify-between border-b flex-wrap">
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
              data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
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
          <TabsContent key={tab} value={tab}>
            {renderOrders(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Order;
