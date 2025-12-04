import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const prefixImagePayment = '/src/assets/payment/'
  const prefixImageShipping = '/src/assets/shipping/'
  const prefixImageApp = '/src/assets/app/'
  const navigate = useNavigate()
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center bg-[#fefafb] mt-auto shadow-inner py-10'>
      <div className='max-w-7xl w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 border-b border-[#e4e1e1] pb-8 px-6'>
        {/* DỊCH VỤ KHÁCH HÀNG */}
        <div className='flex flex-col items-start space-y-6'>
          <div className='font-normal text-sm'>DỊCH VỤ KHÁCH HÀNG</div>
          <ul className='space-y-2 text-xs text-muted-foreground'>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Trung Tâm Trợ Giúp Online Shop
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Online Shop Blog
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Online Shop Mall
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Hướng Dẫn Mua Hàng/Đặt Hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Hướng Dẫn Bán Hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Ví Online Shop
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Online Shop Xu
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Đơn Hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Trả Hàng/Hoàn Tiền
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Liên Hệ Online Shop
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Chính Sách Bảo Hành
              </a>
            </li>
          </ul>
        </div>

        {/* SHOPEE VIỆT NAM */}
        <div className='flex flex-col items-start space-y-6'>
          <div className='font-bold text-xs'>Online Shop | VIỆT NAM</div>
          <ul className='space-y-2 text-xs text-muted-foreground'>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Về Online Shop
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Tuyển Dụng
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Điều Khoản Online Shop
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Chính Sách Bảo Mật
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Online Shop Mall
              </a>
            </li>
            {/* <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Kênh Người Bán
              </a>
            </li> */}
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Flash Sale
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Tiếp Thị Liên Kết
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-[#ee4d2d]'>
                Liên Hệ Truyền Thông
              </a>
            </li>
          </ul>
        </div>

        {/* THANH TOÁN & ĐƠN VỊ VẬN CHUYỂN */}
        <div className='flex flex-col items-start space-y-6'>
          <div className='font-bold text-xs'>THANH TOÁN</div>
          <div className='grid grid-cols-3 gap-2'>
            <img
              src={`${prefixImagePayment}pay1.png`}
              alt='Visa'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay2.png`}
              alt='Mastercard'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay3.png`}
              alt='JCB'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay4.png`}
              alt='Amex'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay5.png`}
              alt='COD'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay6.png`}
              alt='SPayLater'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay7.png`}
              alt='SPay'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImagePayment}pay8.png`}
              alt='SPay'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
          </div>

          <div className='font-bold text-xs mt-4'>ĐƠN VỊ VẬN CHUYỂN</div>
          <div className='grid grid-cols-3 gap-2'>
            <img
              src={`${prefixImageShipping}vanchuyen1.png`}
              alt='SPX'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen2.png`}
              alt='Giao Hàng Tiết Kiệm'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen3.png`}
              alt='Viettel Post'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen4.png`}
              alt='VN Post'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen5.png`}
              alt='J&T Express'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen6.png`}
              alt='Grab Express'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen7.png`}
              alt='Ninja Van'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen8.png`}
              alt='Best Express'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
            <img
              src={`${prefixImageShipping}vanchuyen9.png`}
              alt='Ahamove'
              className='h-8 w-auto border border-gray-200 rounded p-1'
            />
          </div>
        </div>

        {/* THEO DÕI SHOPEE */}
        <div className='flex flex-col items-start space-y-6'>
          <div className='font-bold text-xs'>THEO DÕI Online Shop </div>
          <ul className='space-y-2 text-xs text-muted-foreground'>
            <li className='flex items-center gap-2'>
              <Facebook className='w-4 h-4' />
              <a href='#' className='hover:text-[#ee4d2d]'>
                Facebook
              </a>
            </li>
            <li className='flex items-center gap-2'>
              <Instagram className='w-4 h-4' />
              <a href='#' className='hover:text-[#ee4d2d]'>
                Instagram
              </a>
            </li>
            <li
              className='flex items-center gap-2'
              onClick={() => navigate('/ninga')}
            >
              <Linkedin className='w-4 h-4' />
              <a href='#' className='hover:text-[#ee4d2d]'>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* TẢI ỨNG DỤNG SHOPEE */}
        <div className='flex flex-col items-start space-y-6'>
          <div className='font-bold text-xs'>TẢI ỨNG DỤNG ONLINE SHOP</div>
          <div className='flex gap-2'>
            <img
              src={`${prefixImageApp}qr.png`}
              alt='QR Code'
              className=' p-1 border border-gray-200 rounded'
            />
            <div className='flex flex-col gap-2'>
              <a href='#' target='_blank' rel='noopener noreferrer'>
                <img
                  src={`${prefixImageApp}ios.png`}
                  alt='App Store'
                  className=' p-1 border border-gray-200 rounded hover:opacity-80 transition-opacity'
                />
              </a>
              <a href='#' target='_blank' rel='noopener noreferrer'>
                <img
                  src={`${prefixImageApp}google-play.png`}
                  alt='Google Play'
                  className=' p-1 border border-gray-200 rounded hover:opacity-80 transition-opacity'
                />
              </a>
              <a href='#' target='_blank' rel='noopener noreferrer'>
                <img
                  src={`${prefixImageApp}app-gallery.png`}
                  alt='AppGallery'
                  className=' p-1 border border-gray-200 rounded hover:opacity-80 transition-opacity'
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col py-8 space-y-2 text-[14px]'>
        <p className=' text-muted-foreground '>
          &copy; 2025 Online Shop . Tất cả các quyền được bảo lưu.
        </p>
        <div className='flex gap-1  text-muted-foreground'>
          Quốc gia & Khu vực:
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Argentina
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Singapore
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Indonesia
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Thái Lan
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Malaysia
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Việt Nam
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Philippines
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Brazil
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            México
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Colombia
          </a>
          <a
            href='#'
            className='border-r border-gray-300 pr-1 hover:text-[#ee4d2d]'
          >
            Chile
          </a>
          <a href='#' className='hover:text-[#ee4d2d]'>
            Đài Loan
          </a>
        </div>
      </div>
    </div>
  )
}
export default Footer
