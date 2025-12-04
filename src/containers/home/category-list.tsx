import { useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Link } from 'react-router-dom'
import { categoriesApi } from '@/lib/api'

type CategoryDisplay = {
  id: string | number
  name: string
  image: string
  href: string
}

const FALLBACK_CATEGORIES: CategoryDisplay[] = [
  {
    name: 'Thời Trang Nam',
    image: '/src/assets/image/category/thoi-trang-nam.png',
    href: '/thoi-trang-nam',
    id: 1
  },
  {
    name: 'Điện Thoại & Phụ Kiện',
    image: '/src/assets/image/category/dien-thoai-va-phu-kien.png',
    href: '/dien-thoai-phu-kien',
    id: 2
  },
  {
    name: 'Thiết Bị Điện Tử',
    image: '/src/assets/image/category/thiet-bi-dien-tu.png',
    href: '/thiet-bi-dien-tu',
    id: 3
  },
  {
    name: 'Máy Tính & Laptop',
    image: '/src/assets/image/category/may-tinh-va-laptop.png',
    href: '/may-tinh-laptop',
    id: 4
  },
  {
    name: 'Máy Ảnh & Máy Quay Phim',
    image: '/src/assets/image/category/may-anh-va-may-quay-phim.png',
    href: '/may-anh-may-quay-phim',
    id: 5
  },
  {
    name: 'Đồng Hồ',
    image: '/src/assets/image/category/dong-ho.png',
    href: '/dong-ho',
    id: 6
  },
  {
    name: 'Giày Dép Nam',
    image: '/src/assets/image/category/giay-dep-nam.png',
    href: '/giay-dep-nam',
    id: 7
  },
  {
    name: 'Thiết Bị Điện Gia Dụng',
    image: '/src/assets/image/category/thiet-bi-dien-gia-dung.png',
    href: '/thiet-bi-dien-gia-dung',
    id: 8
  },
  {
    name: 'Thể Thao & Du Lịch',
    image: '/src/assets/image/category/the-thao-va-du-lich.png',
    href: '/the-thao-du-lich',
    id: 9
  },
  {
    name: 'Ô Tô & Xe Máy & Xe Đạp',
    image: '/src/assets/image/category/o-to-va-xe-may-va-xe-dap.png',
    href: '/o-to-xe-may-xe-dap',
    id: 10
  },
  {
    name: 'Balo & Túi Ví Nam',
    image: '/src/assets/image/category/balo-va-tui-vi-nam.png',
    href: '/balo-tui-vi-nam',
    id: 11
  },
  {
    name: 'Thời Trang Nữ',
    image: '/src/assets/image/category/thoi-trang-nu.png',
    href: '/thoi-trang-nu',
    id: 12
  },
  {
    name: 'Mẹ & Bé',
    image: '/src/assets/image/category/me-va-be.png',
    href: '/me-va-be',
    id: 13
  },
  {
    name: 'Nhà Cửa & Đời Sống',
    image: '/src/assets/image/category/nha-cua-va-doi-song.png',
    href: '/nha-cua-doi-song',
    id: 14
  },
  {
    name: 'Sắc Đẹp',
    image: '/src/assets/image/category/sac-dep.png',
    href: '/sac-dep',
    id: 15
  },
  {
    name: 'Sức Khỏe',
    image: '/src/assets/image/category/suc-khoe.png',
    href: '/suc-khoe',
    id: 16
  },
  {
    name: 'Giày Dép Nữ',
    image: '/src/assets/image/category/giay-dep-nu.png',
    href: '/giay-dep-nu',
    id: 17
  },
  {
    name: 'Phụ Kiện & Trang Sức Nữ',
    image: '/src/assets/image/category/phu-kien-va-trang-suc-nu.png',
    href: '/phu-kien-va-trang-suc-nu',
    id: 18
  },
  {
    name: 'Bách Hóa Online',
    image: '/src/assets/image/category/bach-hoa-online.png',
    href: '/bach-hoa-online',
    id: 19
  },
  {
    name: 'Nhà Sách Online',
    image: '/src/assets/image/category/nha-sach-online.png',
    href: '/nha-sach-online',
    id: 20
  },
  {
    name: 'Đồ Chơi',
    image: '/src/assets/image/category/do-choi.png',
    href: '/do-choi',
    id: 21
  },
  {
    name: 'Chăm Sóc Thú Cưng',
    image: '/src/assets/image/category/cham-soc-thu-cung.png',
    href: '/cham-soc-thu-cung',
    id: 22
  },
  {
    name: 'Dụng cụ và thiết bị tiện ích',
    image: '/src/assets/image/category/dung-cu-va-thiet-bi-tien-ich.png',
    href: '/dung-cu-thiet-bi-tien-ich',
    id: 23
  },
  {
    name: 'Thời Trang Trẻ Em',
    image: '/src/assets/image/category/thoi-trang-tre-em.png',
    href: '/thoi-trang-tre-em',
    id: 24
  },
  {
    name: 'Giặt Giũ & Chăm Sóc Nhà Cửa',
    image: '/src/assets/image/category/giat-giu-va-cham-soc-nha-cua.png',
    href: '/giat-giu-cham-soc-nha-cua',
    id: 25
  },
  {
    name: 'Voucher & Dịch Vụ',
    image: '/src/assets/image/category/voucher-va-dich-vu.png',
    href: '/voucher-dich-vu',
    id: 26
  },
  {
    name: 'Nhà Sách Online',
    image: '/src/assets/image/category/nha-sach-online.png',
    href: '/nha-sach-online',
    id: 27
  },
  {
    name: 'Đồ Chơi',
    image: '/src/assets/image/category/do-choi.png',
    href: '/do-choi',
    id: 28
  },
  {
    name: 'Chăm Sóc Thú Cưng',
    image: '/src/assets/image/category/cham-soc-thu-cung.png',
    href: '/cham-soc-thu-cung',
    id: 29
  },
  {
    name: 'Dụng cụ và thiết bị tiện ích',
    image: '/src/assets/image/category/dung-cu-va-thiet-bi-tien-ich.png',
    href: '/dung-cu-thiet-bi-tien-ich',
    id: 30
  },
  {
    name: 'Thời Trang Trẻ Em',
    image: '/src/assets/image/category/thoi-trang-tre-em.png',
    href: '/thoi-trang-tre-em',
    id: 31
  },
  {
    name: 'Giặt Giũ & Chăm Sóc Nhà Cửa',
    image: '/src/assets/image/category/giat-giu-va-cham-soc-nha-cua.png',
    href: '/giat-giu-cham-soc-nha-cua',
    id: 32
  },
  {
    name: 'Voucher & Dịch Vụ',
    image: '/src/assets/image/category/voucher-va-dich-vu.png',
    href: '/voucher-dich-vu',
    id: 33
  },
  {
    name: 'Nhà Sách Online',
    image: '/src/assets/image/category/nha-sach-online.png',
    href: '/nha-sach-online',
    id: 34
  },
  {
    name: 'Đồ Chơi',
    image: '/src/assets/image/category/do-choi.png',
    href: '/do-choi',
    id: 35
  }
]

const CategoryList = () => {
  const [dynamicCategories, setDynamicCategories] = useState<CategoryDisplay[]>(
    []
  )
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.list()
        if (!isMounted) return
        const activeCategories = data.filter(
          (category) => category.status === 'active'
        )
        if (activeCategories.length === 0) return
        const mapped = activeCategories.map((category, index) => {
          const fallback =
            FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length]
          return {
            id: category.id,
            name: category.name,
            image:
              fallback?.image ??
              '/src/assets/image/category/thoi-trang-nam.png',
            href: `/search?category=${category.id}`
          }
        })
        setDynamicCategories(mapped)
      } catch (err) {
        console.error('Failed to fetch categories', err)
        if (isMounted) {
          setError('Không thể tải danh mục. Đang hiển thị mặc định.')
        }
      }
    }

    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(() => {
    if (dynamicCategories.length > 0) {
      return dynamicCategories
    }
    return FALLBACK_CATEGORIES
  }, [dynamicCategories])

  // Chunk categories into pages of 20 (2 rows x 10 items)
  const pageSize = 20
  const pages: (typeof categories)[] = []
  for (let i = 0; i < categories.length; i += pageSize) {
    pages.push(categories.slice(i, i + pageSize))
  }

  return (
    <div className='w-full bg-white mt-5'>
      <header className='font-medium text-[1rem] py-5 px-5 text-[#757575] border-b border-[#efeeef]'>
        DANH MỤC
      </header>
      {error && <p className='text-xs text-red-500 px-5 py-2'>{error}</p>}
      <div className='relative'>
        <Carousel opts={{ align: 'start', loop: false }} className='w-full'>
          <CarouselContent>
            {pages.map((page, pageIndex) => (
              <CarouselItem key={pageIndex} className='basis-full'>
                {/* Mobile & tablet: 2 rows with horizontal scroll */}
                <div className='md:hidden'>
                  <div className='grid grid-rows-2 grid-flow-col auto-cols-max overflow-x-auto snap-x snap-mandatory gap-2 px-2 scrollbar-hide'>
                    {page.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        className='snap-start shrink-0 flex flex-col items-center justify-center border border-[#efeeef] rounded-md p-2 text-center hover:bg-[#fffeff] hover:shadow-md min-w-[100px] sm:min-w-[110px] md:min-w-[130px]'
                      >
                        <div className='mb-2 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32'>
                          <img
                            src={category.image}
                            alt={category.name}
                            className='w-full h-full object-contain'
                          />
                        </div>
                        <h3 className='text-xs sm:text-sm font-normal leading-tight line-clamp-2 text-gray-800'>
                          {category.name}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Row 1: 10 items */}
                <div className='hidden md:grid grid-cols-10 '>
                  {page.slice(0, 10).map((category, index) => (
                    <Link
                      key={index}
                      to={category.href}
                      className='flex flex-col items-center justify-center border-r border-b border-[#efeeef] p-2 text-center hover:bg-[#fffeff] hover:shadow-md'
                    >
                      <div className='w-16 h-16 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2 flex items-center justify-center'>
                        <img
                          src={category.image}
                          alt={category.name}
                          className='w-full h-full object-contain'
                        />
                      </div>
                      <h3 className='text-xs sm:text-sm md:text-[8px] lg:text-[10px] xl:text-sm font-normal leading-tight line-clamp-2 text-gray-800'>
                        {category.name}
                      </h3>
                    </Link>
                  ))}
                </div>
                {/* Row 2: 10 items (remaining of this slide) */}
                <div className='hidden md:grid grid-cols-10'>
                  {page.slice(10, 20).map((category, index) => (
                    <Link
                      key={index + 10}
                      to={category.href}
                      className='flex flex-col items-center justify-center border-r border-b border-[#efeeef] p-2 text-center hover:bg-[#fffeff] hover:shadow-md'
                    >
                      <div className='w-16 h-16 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mb-2 flex items-center justify-center'>
                        <img
                          src={category.image}
                          alt={category.name}
                          className='w-full h-full object-contain'
                        />
                      </div>
                      <h3 className='text-xs sm:text-sm md:text-[8px] lg:text-[10px] xl:text-sm font-normal leading-tight line-clamp-2 text-gray-800'>
                        {category.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden md:flex items-center justify-center left-0 -translate-x-1/2 w-2 h-2 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border border-[#efeeef] bg-white shadow-md z-10' />
          <CarouselNext className='hidden md:flex items-center justify-center right-0 translate-x-1/2 w-2 h-2 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border border-[#efeeef] bg-white shadow-md z-10' />
        </Carousel>
      </div>
    </div>
  )
}

export default CategoryList
