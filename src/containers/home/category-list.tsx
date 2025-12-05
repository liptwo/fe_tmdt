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
        const mapped = activeCategories.map((category) => {
          return {
            id: category.id,
            name: category.name,
            image: category.imageUrl || category.image || '/src/assets/image/category/thoi-trang-nam.png',
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

  const categories = useMemo(() => dynamicCategories, [dynamicCategories])

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
