import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Header from '@/layouts/header'
import { useState } from 'react'

export function Checkout() {
  const [isDirect, setIsDirect] = useState(true)
  return (
    <div className='w-screen h-full '>
      {/* Navbar */}
      <div className='' style={{ background: 'var(--header-background)' }}>
        <div className='max-w-[85vw] mx-auto'>
          <Header navbarBelow={false} />
        </div>
      </div>
      {/* Navbar below */}
      <div className='flex items-center justify-start w-screen h-16 my-4 bg-background'>
        <div className='max-w-7xl w-full flex mx-auto  justify-start items-center'>
          {' '}
          <div className='text-2xl text-red-500 font-bold'>ShopOnline</div>
          <Separator orientation='vertical' className='bg-red-500 mx-4 h-9' />
          <div className='text-2xl text-red-500'>Thanh toán</div>
        </div>
      </div>
      {/* Content checkout*/}
      <div className='bg-sky-50'>
        <div className='pt-5 max-w-7xl h-auto w-full flex flex-col gap-2 px-2 mx-auto'>
          <div className=' flex flex-col bg-background h-full'>
            <div className='w-full flex bg-background h-full items-center '>
              <div className='text-red-500 flex-6 text-2xl p-6 text-left justify-start'>
                Sản phẩm
              </div>
              <div className='flex-2 justify-center text-center'>Đơn giá</div>
              <div className='flex-2 justify-center text-center'>Số lượng</div>
              <div className='flex-2 justify-center text-center'>
                Thành tiền
              </div>
            </div>
            <div className='p-6 text-left justify-start'>Đơn hàng 1</div>
            <div className='w-full flex bg-background h-full items-center '>
              <div className='text-black flex-4 p-6 text-left justify-start'>
                [CÓ MÀU MỚI] Nước Tẩy Trang làm sạch sâu dịu nhẹ cho mọi loại da
                - Garnier Micellar Cleansing Water 400ml Không có Đơn vị vận
                chuyển khả dụng đối với sản phẩm này
              </div>
              <div className='flex-2 justify-center text-center'>
                Phân loại: Dành cho da sạm
              </div>
              <div className='flex-2 justify-center text-center'>155.000₫</div>
              <div className='flex-2 justify-center text-center'>1</div>
              <div className='flex-2 justify-center text-center'>155.000₫</div>
            </div>
            <Separator className='my-1 w-full' />
            <div>Phương thức vận chuyển:</div>
          </div>
        </div>
      </div>
    </div>
  )
}
