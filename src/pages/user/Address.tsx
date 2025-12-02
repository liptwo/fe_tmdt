import React, { useState, useEffect } from "react";

const Address = () => {
    const [showCard, setShowCard] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const [selected, setSelected] = useState({
        province: "",
        district: "",
        ward: "",
    });

    const [form, setForm] = useState({
        name: "",
        phone: "",
        street: "",
    });

    // 🏙️ Lấy danh sách tỉnh/thành
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then((res) => res.json())
            .then((data) => setProvinces(data))
            .catch((err) => console.error("Error loading provinces:", err));
    }, []);

    // 🏘️ Khi chọn tỉnh → lấy quận/huyện
    useEffect(() => {
        if (selected.province) {
            fetch(`https://provinces.open-api.vn/api/p/${selected.province}?depth=2`)
                .then((res) => res.json())
                .then((data) => setDistricts(data.districts))
                .catch((err) => console.error("Error loading districts:", err));
        } else {
            setDistricts([]);
            setSelected((prev) => ({ ...prev, district: "", ward: "" }));
        }
    }, [selected.province]);

    // 🏠 Khi chọn quận → lấy phường/xã
    useEffect(() => {
        if (selected.district) {
            fetch(`https://provinces.open-api.vn/api/d/${selected.district}?depth=2`)
                .then((res) => res.json())
                .then((data) => setWards(data.wards))
                .catch((err) => console.error("Error loading wards:", err));
        } else {
            setWards([]);
            setSelected((prev) => ({ ...prev, ward: "" }));
        }
    }, [selected.district]);

    // ✅ Xử lý thay đổi input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Lưu địa chỉ mới hoặc cập nhật
    const handleSave = () => {
        if (!form.name || !form.phone || !form.street || !selected.province || !selected.district || !selected.ward) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const provinceName = provinces.find(p => p.code === Number(selected.province))?.name || "";
        const districtName = districts.find(d => d.code === Number(selected.district))?.name || "";
        const wardName = wards.find(w => w.code === Number(selected.ward))?.name || "";

        const newAddress = {
            name: form.name,
            phone: form.phone,
            street: form.street,
            province: provinceName,
            district: districtName,
            ward: wardName,
            isDefault: false,
        };

        if (editIndex !== null) {
            const updated = [...addresses];
            updated[editIndex] = newAddress;
            setAddresses(updated);
            setEditIndex(null);
        } else {
            setAddresses([...addresses, newAddress]);
        }

        setShowCard(false);
        setForm({ name: "", phone: "", street: "" });
        setSelected({ province: "", district: "", ward: "" });
    };

    // 🗑️ Xóa địa chỉ
    const handleDelete = (index) => {
        if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    // ✏️ Cập nhật địa chỉ
    const handleEdit = (index) => {
        const addr = addresses[index];
        setForm({
            name: addr.name,
            phone: addr.phone,
            street: addr.street,
        });
        setSelected({
            province: provinces.find(p => p.name === addr.province)?.code || "",
            district: "",
            ward: "",
        });
        setEditIndex(index);
        setShowCard(true);
    };

    // 🌟 Thiết lập mặc định
    const handleSetDefault = (index) => {
        const updated = addresses.map((a, i) => ({
            ...a,
            isDefault: i === index,
        }));
        setAddresses(updated);
    };

    return (
        <div className="bg-white mx-4 h-2/3 text-gray-700 p-6 rounded-lg shadow-sm relative">
            {/* Header */}
            <div className="border-b flex pb-3 mb-5 justify-between mx-3">
                <h2 className="text-lg font-light text-gray-800">Địa Chỉ Của Tôi</h2>
                <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => {
                        setShowCard(true);
                        setEditIndex(null);
                    }}
                >
                    + Thêm địa chỉ mới
                </button>
            </div>

            {/* Danh sách địa chỉ */}
            <div className="px-4 space-y-4">
                {addresses.length === 0 ? (
                    <p className="text-gray-500 italic text-center">Chưa có địa chỉ nào</p>
                ) : (
                    addresses.map((addr, index) => (
                        <div key={index} className="border-b pb-3 flex justify-between items-start">
                            <div>
                                <p className="font-semibold">
                                    {addr.name} <span className="text-gray-500">({addr.phone})</span>
                                </p>
                                <p>{addr.street}</p>
                                <p>{addr.ward}, {addr.district}, {addr.province}</p>
                                {addr.isDefault && (
                                    <span className="text-orange-500 border border-orange-500 text-xs px-2 py-0.5 rounded">
                                        Mặc định
                                    </span>
                                )}
                            </div>

                            <div className="text-sm space-x-3">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Cập nhật
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-red-600 hover:underline"
                                >
                                    Xóa
                                </button>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(index)}
                                        className="text-gray-600 hover:underline"
                                    >
                                        Thiết lập mặc định
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal nhập địa chỉ */}
            {showCard && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-[420px]">
                        <h3 className="text-lg font-extralight mb-3 text-center">
                            {editIndex !== null ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                        </h3>

                        {/* 🧍‍♀️ Thông tin cơ bản */}
                        <div className="flex gap-2 mb-3">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Họ và tên"
                                className="border p-2 w-1/2 rounded"
                            />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                type="text"
                                placeholder="Số điện thoại"
                                className="border p-2 w-1/2 rounded"
                            />
                        </div>

                        {/* 📍 Chọn địa chỉ */}
                        <div className="space-y-2 mb-4">
                            <select
                                className="border p-2 w-full rounded"
                                value={selected.province}
                                onChange={(e) =>
                                    setSelected({
                                        province: e.target.value,
                                        district: "",
                                        ward: "",
                                    })
                                }
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.map((p) => (
                                    <option key={p.code} value={p.code}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border p-2 w-full rounded"
                                value={selected.district}
                                onChange={(e) =>
                                    setSelected((prev) => ({
                                        ...prev,
                                        district: e.target.value,
                                        ward: "",
                                    }))
                                }
                                disabled={!selected.province}
                            >
                                <option value="">-- Chọn Quận/Huyện --</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.code}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border p-2 w-full rounded"
                                value={selected.ward}
                                onChange={(e) =>
                                    setSelected((prev) => ({
                                        ...prev,
                                        ward: e.target.value,
                                    }))
                                }
                                disabled={!selected.district}
                            >
                                <option value="">-- Chọn Phường/Xã --</option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.code}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 🧭 Nhập địa chỉ cụ thể */}
                        <input
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            type="text"
                            placeholder="Số nhà, tên đường..."
                            className="border p-2 w-full rounded mb-4"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowCard(false);
                                    setEditIndex(null);
                                }}
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Address;
