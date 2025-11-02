import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Bank = () => {
    const [showCard, setShowCard] = useState(false);
    const [step, setStep] = useState(1); // 1 = form nhập thông tin cá nhân, 2 = form ngân hàng
    const navigate = useNavigate();

    const handleSubmitStep1 = (e) => {
        e.preventDefault();
        setStep(2); // Chuyển sang bước 2
    };

    const handleSubmitStep2 = (e) => {
        e.preventDefault();
        alert("Thêm tài khoản ngân hàng thành công!");
        setShowCard(false);
    };

    return (
        <div className="bg-white px-6 md:px-10 py-6 text-gray-800 relative">
            {/* Thẻ tín dụng / ghi nợ */}
            <section className="pb-4 mb-8">
                <div className="flex justify-between border-b pb-4 items-center">
                    <h2 className="font-semibold text-lg">Thẻ Tín Dụng / Ghi Nợ</h2>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition-colors">
                        + Thêm Thẻ Mới
                    </button>
                </div>

                <div className="flex justify-center items-center py-16">
                    <p className="text-gray-500 italic text-base">
                        Bạn chưa liên kết thẻ nào.
                    </p>
                </div>
            </section>

            {/* Tài khoản ngân hàng */}
            <section className="pb-4">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="font-semibold text-lg">Tài Khoản Ngân Hàng Của Tôi</h2>
                    <button
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition-colors"
                        onClick={() => {
                            setShowCard(true);
                            setStep(1);
                        }}
                    >
                        + Thêm Ngân Hàng Liên Kết
                    </button>
                </div>

                <div className="flex justify-center items-center py-16">
                    <p className="text-gray-500 italic text-base">
                        Bạn chưa liên kết tài khoản ngân hàng nào.
                    </p>
                </div>
            </section>

            {/* ✅ Popup hiển thị đè lên màn hình */}
            {showCard && (
                <div className="fixed inset-0 flex justify-center items-center bg-black-1/2 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative animate-fadeIn">
                        {/* Bước 1: Thông tin cá nhân */}
                        {step === 1 && (
                            <>
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                                    Thêm Tài Khoản Ngân Hàng
                                </h3>

                                <form className="space-y-3" onSubmit={handleSubmitStep1}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tên"
                                            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Số CCCD"
                                            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                            onClick={() => setShowCard(false)}
                                        >
                                            Trở về
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                                        >
                                            Hoàn thành
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Bước 2: Form ngân hàng chi tiết */}
                        {step === 2 && (
                            <form onSubmit={handleSubmitStep2} className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <p
                                        className="text-2xl font-bold text-gray-400 cursor-pointer"
                                        onClick={() => setStep(1)}
                                    >
                                        ←
                                    </p>
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        Thêm Tài Khoản Ngân Hàng
                                    </h3>
                                </div>

                                {/* Tên ngân hàng */}
                                <select
                                    required
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Tên ngân hàng</option>
                                    <option value="vietcombank">Vietcombank</option>
                                    <option value="techcombank">Techcombank</option>
                                    <option value="acb">ACB</option>
                                </select>

                                {/* Tên chi nhánh */}
                                <select
                                    required
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Tên chi nhánh</option>
                                    <option value="hcm">TP. Hồ Chí Minh</option>
                                    <option value="hanoi">Hà Nội</option>
                                </select>

                                {/* Số tài khoản */}
                                <input
                                    type="text"
                                    placeholder="Số tài khoản"
                                    required
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />

                                {/* Tên đầy đủ */}
                                <input
                                    type="text"
                                    placeholder="Tên đầy đủ (viết in hoa, không dấu)"
                                    required
                                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />

                                {/* Checkbox */}
                                <div className="flex items-center gap-2 mt-2">
                                    <input type="checkbox" id="default" />
                                    <label htmlFor="default" className="text-gray-700">
                                        Đặt làm mặc định
                                    </label>
                                </div>

                                {/* Nút */}
                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        className="text-gray-600 hover:underline"
                                        onClick={() => setStep(1)}
                                    >
                                        TRỞ LẠI
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                                    >
                                        Hoàn Thành
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bank;
