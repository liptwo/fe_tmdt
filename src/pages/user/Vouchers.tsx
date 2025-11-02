import React from 'react'

const Vouchers = () => {
  return (
    <div className='bg-white min-h-screen space-y-8 mx-5 p-5'>
      <div className='flex justify-between text-center items-center'>
        <p className='text-xl'>Kho Voucher</p>
        <div className='flex gap-2 text-center items-center'>
          <p className='text-red-500'>Tìm thêm voucher</p>
          <p className='text-gray-300 text-xl'>|</p>
          <p className='text-red-500'>Xem lịch sử voucher</p>
          <p className='text-gray-300 text-xl'>|</p>
          <p className='text-gray-500'>Tìm hiểu</p>
        </div>
      </div>
      <div className='flex py-4 justify-center bg-gray-50 gap-3 items-center'>
        <p>Mã Voucher</p>
        <input className='text-gray-400 border py-2 px-6' type="text" placeholder='Nhập mã voucher tại đây' />
        <button className='py-2 px-6 bg-gray-200 text-white'>Lưu</button>
      </div>
    </div>
  )
}

export default Vouchers