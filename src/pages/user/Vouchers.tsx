import React, { useState, useEffect } from "react";

const Vouchers = () => {
  const [inputCode, setInputCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState("");

  const voucherList = {
    LIVE15: {
      name: "Giảm 15% tối đa 1.000.000đ",
      condition: "Đơn tối thiểu 5.000.000đ",
      note: "Chỉ áp dụng trên Shopee Live",
      expire: "Hiệu lực 2 ngày",
      tag: "Mới",
      leftLabel: "SHOPEE LIVE",
    },
    FREESHIP: {
      name: "Miễn phí vận chuyển toàn quốc",
      condition: "Đơn tối thiểu 50.000đ",
      note: "Áp dụng cho tất cả sản phẩm",
      expire: "Hiệu lực 1 ngày",
      tag: "Hot",
      leftLabel: "VẬN CHUYỂN",
    },
    SALE20: {
      name: "Giảm 20% tối đa 200.000đ",
      condition: "Đơn tối thiểu 500.000đ",
      note: "Áp dụng mọi sản phẩm",
      expire: "Hiệu lực 3 ngày",
      tag: "Ưu đãi",
      leftLabel: "FLASH SALE",
    },
  };

  // ✅ Đọc voucher lưu từ Order
  useEffect(() => {
    const savedVouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
    if (savedVouchers.length > 0) {
      const lastVoucher = savedVouchers[savedVouchers.length - 1];
      setVoucher({
        name: lastVoucher.title,
        condition: "Không có điều kiện áp dụng",
        note: lastVoucher.desc,
        expire: lastVoucher.valid,
        tag: "Mới",
        leftLabel: "TỪ ĐƠN HÀNG",
      });
    }
  }, []);

  const handleSave = () => {
    const code = inputCode.trim().toUpperCase();
    if (voucherList[code]) {
      setVoucher(voucherList[code]);
      setError("");
      localStorage.setItem("selectedVoucher", JSON.stringify(voucherList[code]));
    } else {
      setVoucher(null);
      setError("❌ Mã voucher không hợp lệ!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8 mx-5 p-5">
      {/* Header */}
      <div className="flex justify-between text-center items-center">
        <p className="text-xl font-semibold"> Kho Voucher</p>
        <div className="flex gap-2 text-center items-center text-sm">
          <p className="text-red-500 cursor-pointer hover:underline">
            Tìm thêm voucher
          </p>
          <p className="text-gray-300 text-xl">|</p>
          <p className="text-red-500 cursor-pointer hover:underline">
            Xem lịch sử
          </p>
          <p className="text-gray-300 text-xl">|</p>
          <p className="text-gray-500 cursor-pointer hover:underline">
            Tìm hiểu
          </p>
        </div>
      </div>

      {/* Ô nhập mã */}
      <div className="flex py-5 justify-center bg-white gap-3 items-center rounded-lg shadow-sm border">
        <p className="font-medium">Mã Voucher:</p>
        <input
          className="text-gray-700 border border-gray-300 py-2 px-6 rounded focus:ring-2 focus:ring-orange-400 outline-none"
          type="text"
          placeholder="Nhập mã voucher tại đây"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="py-2 px-6 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Lưu
        </button>
      </div>

      {/* Hiển thị voucher đẹp */}
      <div className="flex  mt-8">
        {voucher && (
          <div className="flex bg-white border border-gray-200 rounded-2xl shadow-md w-[500px] overflow-hidden hover:shadow-lg transition relative">
            {/* Bên trái màu cam */}
            <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white w-1/3 flex flex-col items-center justify-center relative p-2">
              <p className="font-bold text-sm text-center">
                {voucher.leftLabel}
              </p>
              <span className="mt-2 text-xs bg-white text-orange-600 px-3 py-1 rounded-md font-medium shadow-sm">
                LIVE
              </span>

              {/* viền răng cưa */}
              <div className="absolute right-0 top-0 h-full w-[12px] bg-white [clip-path:polygon(100%_0,0_5%,100%_10%,0_15%,100%_20%,0_25%,100%_30%,0_35%,100%_40%,0_45%,100%_50%,0_55%,100%_60%,0_65%,100%_70%,0_75%,100%_80%,0_85%,100%_90%,0_95%,100%_100%)]"></div>
            </div>

            {/* Nội dung bên phải */}
            <div className="flex-1 p-4 text-gray-700 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-base">{voucher.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {voucher.condition}
                  </p>
                  <p className="text-sm text-red-500 mt-1">{voucher.note}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <span>⏰</span>
                    <span>{voucher.expire}</span>
                    <a
                      href="#"
                      className="text-blue-500 hover:underline ml-1 text-xs"
                    >
                      Điều kiện
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <button className="text-red-500 border border-red-400 px-3 py-1 rounded text-sm hover:bg-red-50 transition">
                    Dùng sau
                  </button>
                </div>
              </div>

              {/* Nhãn "Mới" */}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-2xl font-semibold shadow">
                {voucher.tag}
              </div>
            </div>
          </div>
        )}

        {/* Lỗi */}
        {error && (
          <div className="text-red-600 bg-red-50 py-3 px-5 rounded-md border border-red-200 font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vouchers;
