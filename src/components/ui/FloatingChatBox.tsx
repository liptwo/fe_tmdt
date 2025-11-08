import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

type ChatUser = {
  id: number;
  name: string;
  lastMessage: string;
};

const FloatingChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const users: ChatUser[] = [
    { id: 1, name: "Shop Thời Trang", lastMessage: "Cảm ơn bạn nha 🧡" },
    { id: 2, name: "Shop Mỹ Phẩm", lastMessage: "Sản phẩm còn hàng nè 💄" },
    { id: 3, name: "Shop Giày Dép", lastMessage: "Bạn chọn size bao nhiêu ạ?" },
  ];

  return (
    <>
      {/* Nút mở chat nổi */}
      <div
        className="fixed bottom-5 right-5 z-50 bg-[#ee4d2d] text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-[#d64526] hover:scale-110 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </div>

      {/* Hộp chat chính */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[600px] h-[450px] bg-white border border-gray-200 rounded-xl shadow-xl flex overflow-hidden z-50">
          {/* Sidebar người nhắn */}
          <div className="w-2/5 border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="bg-[#ee4d2d] text-white font-semibold text-center py-2">
              Tin nhắn
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-orange-100 ${
                    selectedUser?.id === user.id ? "bg-orange-200" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <p className="font-semibold text-gray-800 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Khung chat chính */}
          <div className="w-3/5 flex flex-col">
            {/* Header */}
            <div className="bg-[#ee4d2d] text-white flex justify-between items-center px-4 py-2">
              <span className="font-semibold">
                {selectedUser ? selectedUser.name : "Chọn một cuộc trò chuyện"}
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Nội dung chat */}
            <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700">
              {selectedUser ? (
                <p className="text-gray-500 italic text-center mt-20">
                  (Demo hội thoại với {selectedUser.name} 💬)
                </p>
              ) : (
                <p className="text-gray-500 italic text-center mt-20">
                  Hãy chọn 1 người để bắt đầu trò chuyện 💭
                </p>
              )}
            </div>

            {/* Thanh nhập tin nhắn */}
            {selectedUser && (
              <div className="border-t border-gray-200 p-2 flex items-center">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
                />
                <button className="ml-2 bg-[#ee4d2d] text-white px-3 py-2 rounded-lg hover:bg-[#d64526] transition text-sm">
                  Gửi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatBox;
