import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productsApi, type Product } from '../lib/api'
import { getMockProducts } from '../lib/mockProducts'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const searchQuery = searchParams.get('q')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      // setLoading(true)
      setError(null)
      try {
        // use mock data during development
        const response = await getMockProducts({
          categoryId: categoryId || undefined,
          search: searchQuery || undefined
        })
        setProducts(response.products)
      } catch (err) {
        setError('Failed to fetch products.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, searchQuery])

  const formatPrice = (p?: number) =>
    p != null ? p.toLocaleString('vi-VN') + '₫' : ''

  return (
    <div className='container mx-auto py-8'>
      <div className='grid grid-cols-12 gap-6'>
        {/* Sidebar filters */}
        <aside className='col-span-12 md:col-span-3'>
          <div className='bg-white border rounded p-4 mb-6'>
            <h3 className='font-semibold mb-3'>BỘ LỌC TÌM KIẾM</h3>

            <div className='mb-4'>
              <h4 className='text-sm font-medium mb-2'>Nơi Bán</h4>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> Hà Nội
              </label>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> TP. Hồ Chí Minh
              </label>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> Thái Nguyên
              </label>
            </div>

            <div className='mb-4'>
              <h4 className='text-sm font-medium mb-2'>Theo Danh Mục</h4>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> Ly, Cốc & Kính
              </label>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> Bình nước & Phụ kiện
              </label>
            </div>

            <div>
              <h4 className='text-sm font-medium mb-2'>Thương Hiệu</h4>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> LocknLock
              </label>
              <label className='block text-sm'>
                <input type='checkbox' className='mr-2' /> YETI
              </label>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className='col-span-12 md:col-span-9'>
          {/* Banner */}
          <div className='mb-4'>
            <div className='w-full h-36 md:h-24 bg-gradient-to-r from-red-500 to-yellow-400 rounded overflow-hidden flex items-center justify-center text-white font-bold'>
              BANNER QUẢNG CÁO
            </div>
          </div>

          {/* Search info + sort */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
            <div className='text-sm text-gray-600 mb-2 sm:mb-0'>
              Kết quả tìm kiếm cho từ khóa{' '}
              <span className='text-red-500 font-semibold'>
                '{searchQuery || ''}'
              </span>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='inline-flex bg-white border rounded overflow-hidden'>
                <button className='px-3 py-2 text-sm'>Liên Quan</button>
                <button className='px-3 py-2 text-sm'>Mới Nhất</button>
                <button className='px-3 py-2 text-sm'>Bán Chạy</button>
                <button className='px-3 py-2 text-sm'>Giá</button>
              </div>

              <div className='text-sm text-gray-500'>1/17</div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-500'>{error}</p>
          ) : (
            <>
              <p className='mb-4 text-sm text-gray-700'>
                Found {products.length} results for your search.
              </p>

              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {products.map((product) => (
                  <Link
                    to={`/product?id=${product.id}`}
                    key={product.id}
                    className='bg-white border rounded overflow-hidden shadow hover:shadow-lg transition'
                  >
                    <div className='relative'>
                      <img
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        className='w-full h-40 object-cover'
                      />
                      {/* Badges */}
                      <div className='absolute left-2 top-2 flex flex-col gap-1'>
                        <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded'>
                          Yêu thích
                        </span>
                        <span className='bg-yellow-400 text-xs px-2 py-0.5 rounded'>
                          Shopee Siêu Rẻ
                        </span>
                      </div>
                    </div>

                    <div className='p-3'>
                      <h2 className='text-sm font-semibold truncate mb-1'>
                        {product.name}
                      </h2>
                      <div className='text-xs text-gray-500 mb-2 truncate'>
                        {product.category?.name}
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <div className='text-lg font-bold text-red-600'>
                            {formatPrice(product.price)}
                          </div>
                          {/* Optional original price - render only if exists on product */}
                          {'originalPrice' in product &&
                          (product as any).originalPrice ? (
                            <div className='text-xs text-gray-400 line-through'>
                              {formatPrice((product as any).originalPrice)}
                            </div>
                          ) : null}
                        </div>

                        <div className='text-right text-xs text-gray-500'>
                          <div>⭐ {(product as any).rating ?? 5}</div>
                          <div className='mt-1'>
                            {(product as any).location ?? 'TP. Hồ Chí Minh'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination (simple) */}
              <div className='flex items-center justify-end mt-6 space-x-3'>
                <button className='px-3 py-1 border rounded'>‹</button>
                <button className='px-3 py-1 border rounded bg-white'>1</button>
                <button className='px-3 py-1 border rounded'>2</button>
                <button className='px-3 py-1 border rounded'>›</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
