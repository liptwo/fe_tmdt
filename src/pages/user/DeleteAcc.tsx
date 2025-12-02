import React from "react";
import { useNavigate } from "react-router-dom";

const DeleteAcc = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white mx-4 text-gray-700 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-red-600 mb-4">Important</h2>

      <p className="mb-3">
        Nhấn <b>"Tiếp tục"</b> đồng nghĩa với việc bạn đồng ý với các điều khoản sau đây:
      </p>

      <ul className="list-disc ml-6 mb-6 space-y-2 text-sm leading-relaxed">
        <li>
          Sau khi xác nhận xóa tài khoản, bạn sẽ không thể đăng nhập hoặc khôi phục lại tài khoản.
        </li>
        <li>Toàn bộ Shopee Xu trong tài khoản của bạn sẽ bị mất.</li>
        <li>
          Việc xóa tài khoản chỉ được thực hiện khi bạn không có đơn hàng hoặc tranh chấp đang xử lý.
        </li>
        <li>
          Shopee có thể lưu trữ dữ liệu của bạn theo quy định pháp luật và chính sách bảo mật.
        </li>
        <li>
          Việc xóa tài khoản không có nghĩa là loại bỏ tất cả trách nhiệm của bạn đối với các hoạt động trước đó.
        </li>
      </ul>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => navigate(-1)} // quay lại trang trước
        >
          Hủy
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default DeleteAcc;
