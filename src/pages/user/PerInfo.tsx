import React from 'react'

const PerInfo = () => {
  return (
    <div className="bg-white mx-4 h-2/3 text-gray-700 p-6 rounded-lg shadow-sm">
      <div className="border-b pb-3 mb-5">
        <h2 className="text-lg  text-gray-800">Thông tin cá nhân</h2>
        <p className="text-sm text-gray-500">
          Vui lòng đảm bảo nội dung bạn cung cấp trùng khớp với thông tin trên CCCD của bạn
        </p>
      </div>
      {/* Form */}
      <div className="flex flex-col gap-5 items-center">
        {/* Họ và tên */}
        <div className="flex items-center w-full max-w-md">
          <label className="w-32 text-right pr-3" htmlFor="">
            Họ và tên
          </label>
          <input
            className="flex-1 border border-gray-300 rounded p-1 px-2"
            type="text"
            placeholder="Họ và tên đầy đủ trên CCCD"
          />
        </div>

        {/* Số CCCD */}
        <div className="flex items-center w-full max-w-md">
          <label className="w-32 text-right pr-3" htmlFor="">
            Số CCCD
          </label>
          <input
            className="flex-1 border border-gray-300 rounded p-1 px-2"
            type="text"
            placeholder="Số định danh cá nhân trên CCCD"
          />
        </div>

        {/* Địa chỉ */}
        <div className="flex items-center w-full max-w-md">
          <label className="w-32 text-right pr-3" htmlFor="">
            Địa chỉ
          </label>
          <input
            className="flex-1 border border-gray-300 rounded p-1 px-2"
            type="text"
            placeholder="Địa chỉ nơi thường trú trên CCCD"
          />
        </div>

        {/* Nút xác nhận */}
        <div className="w-full max-w-md flex justify-end">
          <button className="bg-orange-500 py-1 px-3 text-white rounded hover:bg-orange-600">
            Xác nhận
          </button>
        </div>
      </div>


    </div >
  )
}

export default PerInfo