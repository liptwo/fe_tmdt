import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, UserRound, ShoppingBag, Ticket } from "lucide-react";
import Profile from './Profile';
import Address from './Address';
import Bank from './Bank';
import Update from './Update';

import Privacy from './setting/Privacy';
import PerInfo from './PerInfo';
import DeleteAcc from './DeleteAcc';
import Order from './Order';
import Vouchers from './Vouchers';
import Promotion from './Promotion';
import Wallet from './Wallet';
import ChangePassword from './ChangePassword';
const User = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [openSection, setOpenSection] = useState(null);
    const [profile, setProfile] = useState({ name: "", avatar: "" });

    // ✅ Lấy dữ liệu profile từ localStorage
    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("profileData"));
        if (savedProfile) setProfile(savedProfile);
    }, []);

    // ✅ Nếu người dùng cập nhật ảnh mới, cập nhật lại giao diện (khi quay lại User)
    useEffect(() => {
        const handleStorageChange = () => {
            const updated = JSON.parse(localStorage.getItem("profileData"));
            if (updated) setProfile(updated);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const menu = [
        {
            label: "Thông Báo", icon: <Bell />,
            path: "/notifications",
            children: [
                { name: "Cập Nhật Đơn Hàng", path: "/notifications/update" },
                { name: "Khuyến Mãi", path: "/notifications/promotion" },
                { name: "Cập Nhật Ví", path: "/notifications/wallet" }
            ]
        },
        {
            label: "Tài Khoản Của Tôi", icon: <UserRound />,
            path: "/account/profile",
            children: [
                { name: "Hồ Sơ", path: "/account/profile" },
                { name: "Ngân Hàng", path: "/account/bank" },
                { name: "Địa Chỉ", path: "/account/address" },
                // { path: "/account/delete" },
                { name: "Đổi Mật Khẩu", path: "/account/changepassword" },
                // { name: "Cài Đặt Thông Báo", path: "/account/notification-settings" },
                { name: "Những Thiết Lập Riêng Tư", path: "/setting/privacy" },
                { name: "Thông Tin Cá Nhân", path: "/account/perinfo" },
            ],
        },
        { label: "Đơn Mua", icon: <ShoppingBag />, path: "/orders" },
        { label: "Kho Voucher", icon: <Ticket />, path: "/vouchers" },
    ];

    const toggleSection = (index) => setOpenSection(index);
    const handleNavigate = (path) => navigate(`/user${path}`);
    const handleClick = (index, path) => {
        toggleSection(index);
        handleNavigate(path);
    };

    // 🔤 Hàm lấy chữ viết tắt từ tên người dùng
    const getInitials = (name) => {
        if (!name) return "NN";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className='flex flex-1 bg-gray-100'>
            <div className='flex pt-[1.25rem] pr-0 pb-[3.125rem] container w-[1200px] mx-auto'>
                {/* Bên trái */}
                <div className='w-[180px] mr-8 block shrink-0'>
                    {/* Avatar */}
                    <div className='flex items-center py-[15px] border-b border-solid'>
                        {/* Nếu có ảnh -> hiển thị ảnh, ngược lại hiển thị chữ */}
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt='Avatar'
                                className='w-12 h-12 rounded-full object-cover border'
                            />
                        ) : (
                            <div className='w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold'>
                                {getInitials(profile.name)}
                            </div>
                        )}

                        <div className='flex flex-col pl-3.5'>
                            <div className='text-black font-bold mb-1'>
                                {profile.name || "NgocNhan"}
                            </div>
                            <a
                                className='text-[#888] text-sm cursor-pointer hover:text-orange-500'
                                onClick={() => handleNavigate("/account/profile")}
                            >
                                ✏️ Sửa hồ sơ
                            </a>
                        </div>
                    </div>

                    {/* Menu */}
                    {/* Menu */}
                    <div className="w-64 h-screen p-4">
                        {menu.map((item, index) => {
                            const isActive = location.pathname.includes(item.path); // ✅ Kiểm tra mục cha đang active

                            return (
                                <div key={index} className="mb-2">
                                    {/* Mục chính */}
                                    <div
                                        className={`flex justify-between items-center cursor-pointer p-2 rounded-md transition-all 
                                                  ${isActive ? " text-orange-500 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}
                                        onClick={() => handleClick(index, item.path)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={isActive ? "text-orange-500" : "text-gray-700"}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </div>
                                    </div>

                                    {/* Mục con */}
                                    {item.children && openSection === index && (
                                        <ul className="ml-4 mt-1 border-l border-gray-200 pl-3">
                                            {item.children.map((subItem, i) => {
                                                const isSubActive = location.pathname.includes(subItem.path);
                                                return (
                                                    <li
                                                        key={i}
                                                        className={`py-1 cursor-pointer transition-all 
                                                          ${isSubActive
                                                                ? "text-orange-500 font-medium"
                                                                : "text-gray-700 hover:text-orange-500"}`}
                                                        onClick={() => subItem.path && handleNavigate(subItem.path)}
                                                    >
                                                        {subItem.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Bên phải */}
                <div className='w-[980px] ml-[1.6875rem] border-b border-solid'>
                    {location.pathname.includes('profile') && <Profile />}
                    {location.pathname.includes('address') && <Address />}
                    {location.pathname.includes('perinfo') && <PerInfo />}
                    {location.pathname.includes('privacy') && <Privacy />}
                    {location.pathname.includes('delete') && <DeleteAcc />}
                    {location.pathname.includes('order') && < Order />}
                    {location.pathname.includes('bank') && < Bank />}
                    {location.pathname.includes('vouchers') && < Vouchers />}
                    {location.pathname.includes('update') && < Update />}
                    {location.pathname.includes('wallet') && < Wallet />}
                    {location.pathname.includes('promotion') && < Promotion />}
                    {location.pathname.includes('changepassword') && < ChangePassword />}




                </div>
            </div>
        </div>
    );
};

export default User;
