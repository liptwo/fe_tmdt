import React, { useState } from "react";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Kiểm tra trống
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        // Kiểm tra xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        // Giả lập gửi dữ liệu
        setTimeout(() => {
            setSuccess("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Đổi Mật Khẩu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu hiện tại
                    </label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-200"
                >
                    Xác nhận
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
