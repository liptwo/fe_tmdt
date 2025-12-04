import React from 'react'

interface NotificationItem {
  img: string
  title: string
  description: string
  time: string
}

const notifications: NotificationItem[] = [
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8259n-mgdinaylue4pd3_tn',
    title: 'HÀNG QUỐC TẾ - GIÁ QUỐC NỘI🌟',
    description: `✨Cùng rất nhiều mã giảm 150K, 100K
💰Tất cả đã sẵn ví của bạn
🎉Duy nhất #1.11 - Mua ngay kẻo hết!`,
    time: '21:06 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8258n-mgdhoi8cmsy6c7_tn',
    title: 'VOUCHER 1 TRIỆU NẠP ĐẦY CHUYẾN CUỐI🔥',
    description: `🎉Chốt đơn tại Live giảm đến 50%
💌Thêm mã giảm 200K, 150K, 70K
🏍️Cùng mã FREESHIP muôn nơi
🌟Mở sale đợt cuối - Không mua là tiếc nuối`,
    time: '20:46 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-82595-mgdhzilmjfnz0d_tn',
    title: 'GIẢM ĐẬM TOÀN SÀN ĐẾN 500K🤩',
    description: `🖥️ĐIỆN TỬ giảm đến 1.5 Triệu
👗THỜI TRANG giảm đến 1.111 Triệu
🔥TIÊU DÙNG giảm đến 1 Triệu
📣Deal xịn giảm sâu, mau mau đặt về!`,
    time: '18:47 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8257w-mgdhxt8tlvke7a_tn',
    title: '18H MÃ XTRA ĐẾN 700K THÊM NHIỆT🌟',
    description: `💛Còn nhiều mã giảm 100K, 20K
✨Ngành hàng nào cũng giảm đến 50%
🎉Săn ngay kẻo hết Nhàn ơi!`,
    time: '17:47 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8259v-mgdhwgf9kqh9d5_tn',
    title: '15H MÃ GIẢM TOÀN SÀN ĐẾN 350K🔥',
    description: `💗Áp dụng cho đơn từ 750K
💰Mã ngành hàng đến 1.5 Triệu
🌈Shiseido, Beplain, L'Oreal,...giảm sâu
🚛Freeship 0Đ - Nhàn chuẩn bị lên đơn!`,
    time: '14:47 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8258w-mgdhvbmwd4i2da_tn',
    title: '12H TUNG SIÊU DEAL GIẢM 50%✨',
    description: `🎫Thêm loạt mã giảm 500K, Freeship
🎉Cùng nhiều mã giảm 100K, 40K, 25K
⚡Sale không ngừng nghỉ - Canh giờ mua ngay!`,
    time: '11:46 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/vn-11134401-7ras8-m3khdrg0taqwd0_tn',
    title: '⛔ Chú ý ⛔',
    description: `⏰ Nhàn ơi, vô vàn sản phẩm hot sắp hết hạn ưu đãi!
💥 Nhanh tay chớp deal ngay kẻo lỡ!`,
    time: '11:12 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-825b1-mgdime5qv0219e_tn',
    title: '#1.11 SIÊU DEAL KHAI TIỆC GIẢM ĐẾN 111K',
    description: `🥨Nhập mã 1111SIEUDEAL1111 mở tiệc cuối tuần
🍔McDonalds, Popeyes, KATINAT, Phúc Long,..giảm đến 50%
🥗Món ngon bao ship chỉ 30K
🍟Ăn ngon cùng Online Shop ngay!`,
    time: '10:12 01-11-2025'
  },
  {
    img: 'https://down-vn.img.susercontent.com/file/sg-11134004-8258n-mgdhoi8cmsy6c7_tn',
    title: 'TUNG MÃ 1 TRIỆU KHAI TIỆC SALE #1.11',
    description: `💙Cùng nhiều mã giảm đến 1.111 Triệu
💛Thêm mã giảm ngành hàng đến 1.5 Triệu
💚Deal hời giảm đến 50% đã sẵn sàng
🧡Chỉ còn vài phút - Chốt sạch giỏ hàng!`,
    time: '23:47 31-10-2025'
  }
]

const PromoNotifications: React.FC = () => {
  return (
    <main className='bg-white min-h-screen p-6'>
      {/* Header */}
      <div className='flex justify-between items-center border-b pb-3 mb-4'>
        <h1 className='text-lg font-semibold text-gray-800'>
          Thông báo khuyến mãi
        </h1>
        <button className='text-orange-500 text-sm hover:underline'>
          Đánh dấu Đã đọc tất cả
        </button>
      </div>

      {/* List */}
      <div className='space-y-4'>
        {notifications.map((item, index) => (
          <div
            key={index}
            className='flex justify-between items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition'
          >
            <div className='flex gap-3 w-4/5'>
              <img
                src={item.img}
                alt='promo'
                className='w-16 h-16 rounded object-contain'
              />
              <div>
                <h2 className='font-medium text-base text-gray-800'>
                  {item.title}
                </h2>
                <p className='text-sm text-gray-600 whitespace-pre-line'>
                  {item.description}
                </p>
                <p className='text-xs text-gray-400 mt-1'>{item.time}</p>
              </div>
            </div>
            <button className='bg-orange-500 text-white text-xs px-4 py-2 rounded hover:bg-orange-600'>
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default PromoNotifications
