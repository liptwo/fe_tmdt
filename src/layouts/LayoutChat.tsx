import { Outlet } from "react-router-dom";

export default function LayoutChat() {
  return (
    <div className="w-full h-screen flex">
      {/* Kênh chat bên trái */}
      <div className="w-1/3 border-r border-gray-300">
        {/* Sidebar list chat sẽ nằm trong SellAndChatApp */}
      </div>

      {/* Nội dung chat */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
