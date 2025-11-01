// import { Avatar } from "@radix-ui/react-avatar";
import React, { useState, useEffect } from "react";

const Profile = () => {
    const [isEditEmail, setIsEditEmail] = useState(false)
    const [isEditNPhone, setIsEditNPhone] = useState(false)

    const [profile, setProfile] = useState({
        username: "",
        name: "",
        email: "ng************@gmail.com",
        phone: "*********59",
        gender: "",
        day: "",
        month: "",
        year: "",
        avatar: ""
    });

    // 🟢 Lấy dữ liệu đã lưu trong localStorage khi mở trang
    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("profileData"));
        if (savedProfile) {
            setProfile(savedProfile);
        }
    }, []);

    // 🟢 Xử lý thay đổi trong input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfile((prev) => ({
                    ...prev,
                    avatar: imageData
                }));
                localStorage.setItem('profileData', JSON.stringify({
                    ...profile,
                    avatar: imageData
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // 🟢 Xử lý lưu vào localStorage
    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem("profileData", JSON.stringify(profile));
        alert("Lưu thông tin thành công!");
    };

    return (
        <div className="bg-white mx-4 text-gray-700 p-6 rounded-lg shadow-sm">
            <div className="border-b pb-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Hồ Sơ Của Tôi</h2>
                <p className="text-sm text-gray-500">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Form bên trái */}
                <div className="col-span-8">
                    <form onSubmit={handleSave}>
                        <table className="table-auto w-full">
                            <tbody>
                                <tr className="h-18 ">
                                    <td className="w-1/4 pr-4 font-medium">
                                        <label>Tên đăng nhập</label>
                                    </td>
                                    <td>
                                        <input
                                            name="username"
                                            value={profile.username}
                                            onChange={handleChange}
                                            type="text"
                                            className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-amber-400 outline-none"
                                            placeholder="Nhập tên đăng nhập"
                                        />
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td className="pr-4 font-medium">
                                        <label>Tên</label>
                                    </td>
                                    <td>
                                        <input
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            type="text"
                                            className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-amber-400 outline-none"
                                            placeholder="Nhập tên hiển thị"
                                        />
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td className="pr-4 font-medium">Email</td>
                                    <td>
                                        <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                                            {isEditEmail ? (<input

                                                name="email"
                                                // value={profile.email}
                                                onChange={handleChange}
                                                type="text"
                                                className="border-none border-gray-300 w-full p-2 rounded-md  outline-none"
                                                placeholder="Nhập email ..."
                                            />) : <span>{profile.email}</span>}

                                            <button
                                                type="button"
                                                className={`text-amber-500 hover:underline text-sm ${isEditEmail && 'hidden'}`}
                                                onClick={() => setIsEditEmail(!isEditEmail)}
                                            >
                                                Thay đổi
                                            </button>

                                        </div>
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td className="pr-4 font-medium">Số điện thoại</td>
                                    <td>
                                        <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                                            {isEditNPhone ? (
                                                <input
                                                    name="phone"
                                                    // value={profile.username}
                                                    onChange={handleChange}
                                                    type="text"
                                                    className="border-none border-gray-300 w-full p rounded-md focus:ring-2 focus:ring-amber-400 outline-none"
                                                    placeholder="Nhập số điện thoại.."
                                                />
                                            ) : (<span>{profile.phone}</span>)}
                                            <button
                                                type="button"
                                                className={`text-amber-500  hover:underline text-sm ${isEditEmail && 'hidden'}`}
                                                onClick={() => setIsEditNPhone(!isEditNPhone)}
                                            >
                                                Thay đổi
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td className="pr-4 font-medium">Giới tính</td>
                                    <td>
                                        <div className="flex gap-4">
                                            {["Nam", "Nữ", "Khác"].map((g) => (
                                                <label key={g} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={g}
                                                        checked={profile.gender === g}
                                                        onChange={handleChange}
                                                    />
                                                    {g}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td className="pr-4 font-medium">Ngày sinh</td>
                                    <td>
                                        <div className="flex gap-3">
                                            <select
                                                name="day"
                                                value={profile.day}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="">Ngày</option>
                                                {Array.from({ length: 31 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                name="month"
                                                value={profile.month}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="">Tháng</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                name="year"
                                                value={profile.year}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-md p-2"
                                            >
                                                <option value="">Năm</option>
                                                {Array.from({ length: 50 }, (_, i) => {
                                                    const y = 2025 - i;
                                                    return (
                                                        <option key={y} value={y}>
                                                            {y}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="h-18">
                                    <td></td>
                                    <td>
                                        <button
                                            type="submit"
                                            className="bg-amber-500 text-white py-2 px-6 rounded-md hover:bg-amber-600 transition-all"
                                        >
                                            Lưu
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>

                {/* Bên phải - ảnh đại diện */}
                {/* Ảnh đại diện */}
                <div className='col-span-4 border-l pl-8 flex flex-col items-center justify-start'>
                    <div className='relative w-32 h-32'>
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt='Avatar'
                                className='w-32 h-32 rounded-full object-cover border'
                            />
                        ) : (
                            <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400'>
                                Chưa có ảnh
                            </div>
                        )}
                    </div>
                    <label className='mt-4 cursor-pointer bg-amber-400 text-white px-3 py-1 rounded-md hover:bg-amber-500'>
                        Chọn ảnh
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='hidden'
                        />
                    </label>
                </div>
            </div>
        </div>

    );
};

export default Profile;
