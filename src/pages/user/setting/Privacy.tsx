import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
    const [showNoti, setShowNoti] = useState(false);
    const [confirmChecked, setConfirmChecked] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => {
        setShowNoti(true);
        setConfirmChecked(false);
    };
    const handleClose = () => {
        setShowNoti(false);
        setConfirmChecked(false);
    };

    const handleDelete = () => {
        // TODO: gọi API xóa ở đây
        // Sau khi xóa thành công:
        setShowNoti(false);
        navigate("/"); // hoặc trang khác
    };

    return (
        <div className="bg-white mx-4 h-2/3 text-gray-700 p-6 rounded-lg shadow-sm relative">
            <div className="border-b pb-3 mb-5">
                <h2 className="text-lg font-lg text-gray-700 mb-4">Những Thiết Lập Riêng Tư</h2>
            </div>

            <div className="flex justify-between items-center">
                <p>Yêu cầu xóa tài khoản</p>
                <button
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    onClick={handleOpen}
                >
                    Xóa bỏ
                </button>
            </div>

            {/* Modal overlay */}
            {showNoti && (
                <div
                    className="fixed inset-0 bg-black-1/2 bg-opacity-50 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[420px] relative">
                        {/* Close X */}
                        <button
                            onClick={handleClose}
                            aria-label="Đóng"
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-2 text-gray-800">Xác nhận xóa tài khoản</h2>

                        <p className="text-sm text-gray-600 mb-4">
                            Bạn có chắc chắn muốn xóa tài khoản này? Hành động này <span className="font-semibold">không thể hoàn tác</span>.
                        </p>

                        {/* Important warning */}
                        <div className="mb-4 p-3 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
                            <strong>Cân nhắc trước khi xóa</strong>
                            <ul className="mt-2 ml-4 list-disc text-sm">
                                <li>Tất cả dữ liệu cá nhân (hồ sơ, bài viết, hình ảnh) sẽ bị xóa vĩnh viễn.</li>
                                <li>Bạn sẽ mất quyền truy cập vào mọi dịch vụ/đăng ký liên kết với tài khoản.</li>
                                <li>Hệ thống có thể giữ bản sao log nội bộ — nhưng <em>không thể khôi phục tài khoản cho bạn</em>.</li>
                                <li>Nếu có đăng ký trả phí, hãy hủy mọi gói trước khi xóa để tránh bị tiếp tục tính phí.</li>
                            </ul>
                        </div>

                        {/* Suggestions */}
                        <div className="mb-4 text-sm text-gray-600">
                            <p className="mb-2"><strong>Gợi ý trước khi xóa:</strong></p>
                            <ol className="ml-4 list-decimal">
                                <li>Sao lưu dữ liệu quan trọng (tải ảnh, lịch sử chat, hóa đơn...)</li>
                                <li>Thông báo cho liên hệ quan trọng nếu cần</li>
                                <li>Hủy các dịch vụ trả phí liên quan</li>
                            </ol>
                        </div>

                        {/* Confirm checkbox */}
                        <label className="flex items-start gap-2 mb-4 text-sm">
                            <input
                                type="checkbox"
                                checked={confirmChecked}
                                onChange={(e) => setConfirmChecked(e.target.checked)}
                                className="mt-1"
                            />
                            <span>
                                Tôi đã đọc và hiểu những hậu quả nói trên. Tôi đồng ý xóa tài khoản này.
                            </span>
                        </label>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={!confirmChecked}
                                className={`px-3 py-1 rounded-lg text-white ${confirmChecked ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
                                    }`}
                            >
                                Xóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Privacy;
