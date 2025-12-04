import React, { useState } from 'react'

const Notifications: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1) // dropdown mở sẵn

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const items = [
    {
      id: 1,
      img: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mefjy0hiy49253_tn',
      title: 'Đơn hàng đã hoàn tất',
      code: '251010PRVKNQE8',
      content:
        'Đơn hàng 251010PRVKNQE8 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 13-11-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!',
      time: '13:22 14-10-2025',
      details: [
        {
          title: 'Nhắc nhở: Bạn đã nhận được hàng chưa?',
          desc: 'Nếu bạn chưa nhận được hàng hoặc gặp vấn đề với đơn hàng 251010PRVKNQE8, hãy nhấn Trả hàng/Hoàn tiền trước ngày 14-10-2025. Sau thời gian này, Online Shop sẽ thanh toán cho Người bán.',
          time: '00:21 14-10-2025'
        },
        {
          title: 'Giao kiện hàng thành công',
          desc: 'Kiện hàng SPXVN05223374895A của đơn hàng 251010PRVKNQE8 đã giao thành công đến bạn.',
          time: '12:05 11-10-2025'
        },
        {
          title: 'Xác nhận đã nhận hàng',
          desc: 'Vui lòng chỉ nhấn ‘Đã nhận được hàng’ khi đơn hàng đã được giao đến bạn và sản phẩm không có vấn đề nào.',
          time: '12:05 11-10-2025'
        }
      ]
    },
    {
      id: 2,
      img: 'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lyyrvc5az541d2_tn',
      title: 'Đơn hàng đã hoàn tất',
      code: '251010PKYC5J7S',
      content:
        'Đơn hàng 251010PKYC5J7S đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 13-11-2025 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!',
      time: '12:46 14-10-2025'
    }
  ]

  return (
    <main className='p-4 bg-white min-h-screen'>
      <div className='flex justify-end border-b pb-3'>
        <p className='text-gray-400 text-sm'>Đánh dấu Đã đọc tất cả</p>
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          className='border-none my-3 shadow-sm overflow-hidden'
        >
          <div
            className='flex justify-between p-3 cursor-pointer hover:bg-gray-50'
            onClick={() => toggle(index)}
          >
            <div className='flex gap-3 w-4/5'>
              <img
                src={item.img}
                alt=''
                className='w-16 h-16 object-contain '
              />
              <div>
                <h2 className='font-medium text-base'>{item.title}</h2>
                <p className='text-sm text-gray-600'>{item.content}</p>
                <p className='text-xs text-gray-400 mt-1'>{item.time}</p>
              </div>
            </div>
            <button className='bg-orange-500 h-10 my-4 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm'>
              Đánh giá Sản phẩm
            </button>
          </div>

          {openIndex === index && item.details && (
            <div className='bg-gray-50 px-4 py-3 border-t'>
              {item.details.map((d, i) => (
                <div key={i} className='mb-3 '>
                  <h3 className='font-medium text-sm'>{d.title}</h3>
                  <p className='text-sm text-gray-600'>{d.desc}</p>
                  <p className='text-xs text-gray-400'>{d.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </main>
  )
}

export default Notifications
