import React from "react";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

const WalletPage = () => {
    // 🔹 Dữ liệu đơn hàng (có thể import chung từ Order nếu dùng chung data)
    const orders = [
        {
            id: 1,
            productName: "1 Hộp 10 Miếng Mặt Nạ Giấy COLORKEY LUMINOUS Vitamin B5",
            price: 88400,
            status: "canceled", // hoàn tiền
            statusText: "Đã hoàn tiền",
        },
        {
            id: 2,
            productName: "3 Ghim Cài Balo Túi Xách Pin Cài Nhựa PVC",
            price: 10000,
            status: "complete", // giao dịch thành công
            statusText: "Giao dịch thành công",
        },
    ];

    // 🔹 Tính tổng số dư ví (ví dụ: bắt đầu 200000)
    const initialBalance = 200000;
    const balance = orders.reduce((total, order) => {
        if (order.status === "complete") return total - order.price; // trừ tiền
        if (order.status === "canceled") return total + order.price; // hoàn tiền
        return total;
    }, initialBalance);

    return (
        <div className="mx-4 my-6">
            {/* 💰 Tổng số dư ví */}
            <div className="bg-orange-500 text-white p-5 rounded-2xl shadow-md flex justify-between items-center">
                <div>
                    <p className="text-lg font-medium">Số dư ví của bạn</p>
                    <h1 className="text-3xl font-bold mt-1">{balance.toLocaleString()}đ</h1>
                </div>
                <Wallet size={48} className="opacity-90" />
            </div>

            {/* 📜 Lịch sử giao dịch */}
            <div className="bg-white mt-6 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Lịch sử giao dịch</h2>

                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex justify-between items-center border-b py-3 last:border-none"
                    >
                        <div>
                            <p className="font-medium text-gray-800">{order.productName}</p>
                            <p
                                className={`text-sm ${order.status === "complete" ? "text-red-500" : "text-green-600"
                                    }`}
                            >
                                {order.statusText}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 font-semibold">
                            {order.status === "complete" ? (
                                <>
                                    <ArrowDownCircle size={18} className="text-red-500" />
                                    <span className="text-red-500">- {order.price.toLocaleString()}đ</span>
                                </>
                            ) : (
                                <>
                                    <ArrowUpCircle size={18} className="text-green-600" />
                                    <span className="text-green-600">+ {order.price.toLocaleString()}đ</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletPage;
