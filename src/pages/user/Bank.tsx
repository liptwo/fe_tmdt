import { useState, useEffect } from "react";
import { toast } from "sonner";

const Bank = () => {
    const [showCard, setShowCard] = useState(false);
    const [step, setStep] = useState(1);
    const [banks, setBanks] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [branch, setBranch] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [bankAccounts, setBankAccounts] = useState<any[]>([]); // ✅ Lưu danh sách ngân hàng đã thêm


    // Gọi API để lấy danh sách ngân hàng (logo, tên)
    useEffect(() => {
        if (step === 2) {
            fetch("https://api.vietqr.io/v2/banks")
                .then((res) => res.json())
                .then((data) => setBanks(data.data))
                .catch((err) => console.error("Error fetching banks:", err));
        }
    }, [step]);

    const handleSubmitStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmitStep2 = (e: React.FormEvent) => {
        e.preventDefault();

        // Thêm ngân hàng vào danh sách
        const selected = banks.find((b) => b.code === selectedBank);
        setBankAccounts((prev) => [
            ...prev,
            {
                bank: selected ? selected.name : selectedBank,
                logo: selected ? selected.logo : "",
                branch,
                accountNumber,
                fullName,
            },
        ]);

        toast.success("Thêm tài khoản ngân hàng thành công!");
        setShowCard(false);
        setStep(1);
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

                {/* ✅ Hiển thị danh sách ngân hàng đã thêm */}
                {bankAccounts.length > 0 ? (
                    <div className="space-y-4">
                        {bankAccounts.map((acc, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    {acc.logo && (
                                        <img
                                            src={acc.logo}
                                            alt={acc.bank}
                                            className="w-10 h-10 rounded-full object-contain"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{acc.bank}</h3>
                                        <p className="text-gray-600 text-sm">
                                            Chi nhánh: {acc.branch}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Số TK: {acc.accountNumber}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 font-medium">{acc.fullName}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-16">
                        <p className="text-gray-500 italic text-base">
                            Bạn chưa liên kết tài khoản ngân hàng nào.
                        </p>
                    </div>
                )}
            </section>

            {/* Popup thêm ngân hàng */}
            {showCard && (
                <div className="fixed inset-0 flex justify-center items-center bg-black-1/2 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative animate-fadeIn">
                        {/* Bước 1 */}
                        {step === 1 && (
                            <>
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                                    Thêm Tài Khoản Ngân Hàng
                                </h3>
                                <form className="space-y-3" onSubmit={handleSubmitStep1}>
                                    <input
                                        type="text"
                                        placeholder="Tên"
                                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Số CCCD"
                                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                            onClick={() => setShowCard(false)}
                                        >
                                            Trở về
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
                                        >
                                            Tiếp tục
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Bước 2 */}
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

                                <select
                                    required
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Chọn ngân hàng</option>
                                    {banks.map((b) => (
                                        <option key={b.code} value={b.code}>
                                            {b.shortName || b.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Tên chi nhánh"
                                    required
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Số tài khoản"
                                    required
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Tên đầy đủ (IN HOA, KHÔNG DẤU)"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-orange-500"
                                />

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
                                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
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
