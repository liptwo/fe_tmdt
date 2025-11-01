import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from 'lucide-react';
import { MessagesSquare } from 'lucide-react';
import { Store } from 'lucide-react';
import { Truck } from 'lucide-react';
import { CircleQuestionMark } from 'lucide-react';
import Sp from './image/sp.jpg'
const Order = () => {
  return (
    <div className='mx-4  text-gray-700 '>
      {/* 👇 Sửa defaultValue thành "all" */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex justify-between border-b flex-wrap">
          <TabsTrigger
            value="all"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="confirm"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Chờ xác nhận
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Vận chuyển
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Chờ giao hàng
          </TabsTrigger>
          <TabsTrigger
            value="complete"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Hoàn thành
          </TabsTrigger>
          <TabsTrigger
            value="canceled"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Đã hủy
          </TabsTrigger>
          <TabsTrigger
            value="returned"
            className="flex-1 data-[state=active]:border-b-2 
            data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 py-2"
          >
            Trả hàng/Hoàn tiền
          </TabsTrigger>
        </TabsList>

        <TabsContent className='w-full' value="all">
          <div className='relative w-full mt-4 px-3'>
            <Search className='absolute left-3 ml-3 top-2.5 text-gray-400' size={20} />
            <input
              className='w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-full 
              focus:border-orange-500 focus:outline-none'
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
            />
          </div>
          <main className='flex flex-col gap-3 mx-2 mt-5'>
            <div className='   '>
              <div className='bg-white p-4 rounded-b-lg'>
                <div className='flex justify-between mb-5 '>
                  <div className='flex text-center  items-center gap-3'>
                    <Store size={20} className='' />
                    <p className='text-medium'>Balosky</p>
                    <button className='flex text-xs py-0.5 gap-1 px-1.5 rounded-xs bg-orange-500 text-white '>
                      <MessagesSquare size={16} className='m-0.5' />
                      <p className='mt-1'>Chat</p>


                    </button>
                    <button className='flex gap-1 border-1 text-xs py-0.5 px-1.5 rounded-b-xs items-center'>
                      <Store size={16} className=' ' />
                      <p className='mt-1'>Xem shop</p>

                    </button>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <div className='flex gap-1 text-green-400 '>
                      <Truck size={20} className='' />
                      <p className='text-sm'>Giao hàng thành công</p>
                      <CircleQuestionMark size={18} className='text-gray-500' />
                      <p className='border-r-1 font-bold p-1'></p>

                    </div>
                    <div className='text-red-600 text-sm'>
                      HOÀN THÀNH
                    </div>

                  </div>
                </div>
                {/* <div className="border-b  border-solid  border-gray-400 my-3 mx-3">  </div> */}
                <div>
                  <div className='flex gap-4 border-t py-5'>
                    <img src={Sp} className='w-20 h-20' alt="" />
                    <div className='w-xl flex flex-col gap-y-1.5 my-1 flex-wrap'>
                      <p className='text-base'>3 Ghim Cài Balo Túi Xách Pin Cài Nhựa PVC</p>
                      <p className='text-gray-400 text-xs'>Phân loại hàng: 3 Pin cài ngẫu nhiên</p>
                      <p className='font-bold'>x1</p>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <p className='line-through text-gray-400'>16.000 <sup>đ</sup></p>
                      <p className='text-red-600'>10.000 <sup>đ</sup></p>
                    </div>
                  </div>


                </div>
              </div>
              <div className='bg-white mt-1 rounded-t px-6 py-5'>
                <div className='flex gap-2 justify-end items-center my-4'>
                  <p className=''>Thành tiền:</p>
                  <p className='text-2xl text-red-500'>10.000<sup>đ</sup></p>
                </div>
                <div className='flex justify-between my-1'>
                  <div className='flex flex-col py-1'>
                    <p className='text-xs text-gray-400'>Đánh giá sản phẩm</p>
                    <p className='text-xs underline text-red-600'>Đánh giá ngay để nhận nhiều ưu đãi</p>

                  </div>
                  <div className='flex gap-2 p-2.5'>
                    <button className='text-base py-1 px-3   bg-orange-600 text-white'>Đánh Giá</button>
                    <button className='text-base py-1 px-3 bg-gray-100 '>Liên Hệ Người Bán </button>
                    <button className='text-base py-1 px-3 bg-gray-100 '>Mua lại</button>
                  </div>
                </div>


              </div>


            </div>
          </main>
          <main className='flex flex-col gap-3 mx-2 mt-5'>
            <div className='   '>
              <div className='bg-white p-4 rounded-b-lg'>
                <div className='flex justify-between mb-5 '>
                  <div className='flex text-center  items-center gap-3'>
                    <Store size={20} className='' />
                    <p className='text-medium'>Balosky</p>
                    <button className='flex text-xs py-0.5 gap-1 px-1.5 rounded-xs bg-orange-500 text-white '>
                      <MessagesSquare size={16} className='m-0.5' />
                      <p className='mt-1'>Chat</p>


                    </button>
                    <button className='flex gap-1 border-1 text-xs py-0.5 px-1.5 rounded-b-xs items-center'>
                      <Store size={16} className=' ' />
                      <p className='mt-1'>Xem shop</p>

                    </button>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <div className='flex gap-1 text-green-400 '>
                      <Truck size={20} className='' />
                      <p className='text-sm'>Giao hàng thành công</p>
                      <CircleQuestionMark size={18} className='text-gray-500' />
                      <p className='border-r-1 font-bold p-1'></p>

                    </div>
                    <div className='text-red-600 text-sm'>
                      HOÀN THÀNH
                    </div>

                  </div>
                </div>
                {/* <div className="border-b  border-solid  border-gray-400 my-3 mx-3">  </div> */}
                {/* Sản phẩm  */}
                <div>
                  <div className='flex gap-4 border-t py-5'>
                    <img src={Sp} className='w-20 h-20' alt="" />
                    <div className='w-xl flex flex-col gap-y-1.5 my-1 flex-wrap'>
                      <p className='text-base'>3 Ghim Cài Balo Túi Xách Pin Cài Nhựa PVC</p>
                      <p className='text-gray-400 text-xs'>Phân loại hàng: 3 Pin cài ngẫu nhiên</p>
                      <p className='font-bold'>x1</p>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <p className='line-through text-gray-400'>16.000 <sup>đ</sup></p>
                      <p className='text-red-600'>10.000 <sup>đ</sup></p>
                    </div>
                  </div>


                </div>
                <div>
                  <div className='flex gap-4 border-t py-5'>
                    <img src={Sp} className='w-20 h-20' alt="" />
                    <div className='w-xl flex flex-col gap-y-1.5 my-1 flex-wrap'>
                      <p className='text-base'>3 Ghim Cài Balo Túi Xách Pin Cài Nhựa PVC</p>
                      <p className='text-gray-400 text-xs'>Phân loại hàng: 3 Pin cài ngẫu nhiên</p>
                      <p className='font-bold'>x1</p>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <p className='line-through text-gray-400'>16.000 <sup>đ</sup></p>
                      <p className='text-red-600'>10.000 <sup>đ</sup></p>
                    </div>
                  </div>


                </div>
              </div>
              <div className='bg-white mt-1 rounded-t px-6 py-5'>
                <div className='flex gap-2 justify-end items-center my-4'>
                  <p className=''>Thành tiền:</p>
                  <p className='text-2xl text-red-500'>10.000<sup>đ</sup></p>
                </div>
                <div className='flex justify-between my-1'>
                  <div className='flex flex-col py-1'>
                    <p className='text-xs text-gray-400'>Đánh giá sản phẩm</p>
                    <p className='text-xs underline text-red-600'>Đánh giá ngay để nhận nhiều ưu đãi</p>

                  </div>
                  <div className='flex gap-2 p-2.5'>
                    <button className='text-base py-1 px-3   bg-orange-600 text-white'>Đánh Giá</button>
                    <button className='text-base py-1 px-3 bg-gray-100 '>Liên Hệ Người Bán </button>
                    <button className='text-base py-1 px-3 bg-gray-100 '>Mua lại</button>
                  </div>
                </div>


              </div>


            </div>
          </main>
        </TabsContent>

        <TabsContent value="confirm">Change your password here.</TabsContent>
        <TabsContent value="shipping">Orders content</TabsContent>
        <TabsContent value="delivery">Shipping content</TabsContent>
        <TabsContent value="complete">Payment content</TabsContent>
        <TabsContent value="canceled">History content</TabsContent>
        <TabsContent value="returned">Support content</TabsContent>
      </Tabs>
    </div>
  )
}

export default Order
