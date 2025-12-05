import { useEffect, useMemo, useState } from 'react'
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Facebook,
  Twitter,
  MessageSquare
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError, cartApi, productsApi } from '@/lib/api'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { toast } from 'sonner'
interface Review {
  id: number
  user: string
  rating: number
  comment: string
}

interface DetailedReview extends Review {
  date: string
  usage: string
  moisturizingEffect: string
  absorption: string
  likes: number
  hasMedia: boolean
  averageRating: number
}

interface Recommended {
  id: number
  name: string
  image: string
  price: string
}

// Dữ liệu mẫu, sẽ được thay thế bằng dữ liệu từ API nếu có
const placeholderImage = (size: number, label?: string) =>
  `https://placehold.co/${size}x${size}${
    label ? `?text=${encodeURIComponent(label)}` : ''
  }`

const defaultProduct = {
  name: 'Kem Dưỡng Ẩm Cấp Nước XYZ',
  price: '$499',
  images: [placeholderImage(400, 'Product')],
  description: `Kem dưỡng ẩm cao cấp với công thức tiên tiến:
- Cấp nước tức thì
- Làm dịu da nhạy cảm
- Thẩm thấu nhanh, không gây bết dính
- Dùng được cho mọi loại da`,
  sellerName: 'Shop Giữ Nhiệt Cao Cấp',
  categoryName: 'Chăm sóc sắc đẹp',
  reviews: [
    {
      id: 1,
      user: 'hta282',
      rating: 5,
      comment:
        'Packaging đẹp, nhìn sang, vỏ bằng nhựa. Chất kem nhẹ cơ mà đặc hơn mình nghĩ, lấy 1 lượng nhỏ là đủ dùng cho cả mặt rồi.',
      date: '2022-04-27 10:20',
      usage: 'Dưỡng ẩm, làm dịu da',
      moisturizingEffect: 'Cấp nước cho da tức thì',
      absorption: 'Nhanh',
      likes: 38,
      hasMedia: true
    },
    {
      id: 2,
      user: 'Minh Thu',
      rating: 5,
      comment:
        'Dùng thích lắm, da mềm hẳn sau khi dùng. Kem không có mùi, rất ổn cho da nhạy cảm.',
      date: '2023-11-05 15:00',
      usage: 'Dưỡng ẩm hàng ngày',
      moisturizingEffect: 'Tốt',
      absorption: 'Khá nhanh',
      likes: 12,
      hasMedia: false
    },
    {
      id: 3,
      user: 'Quang A',
      rating: 4,
      comment: 'Kem dùng ổn, nhưng giá hơi cao. Thẩm thấu nhanh.',
      date: '2023-10-01 12:00',
      usage: 'Dưỡng ẩm',
      moisturizingEffect: 'Tốt',
      absorption: 'Nhanh',
      likes: 5,
      hasMedia: false
    },
    {
      id: 4,
      user: 'Thị B',
      rating: 5,
      comment: 'Tuyệt vời! Sẽ mua lại.',
      date: '2023-09-20 09:00',
      usage: 'Dưỡng ẩm',
      moisturizingEffect: 'Rất tốt',
      absorption: 'Rất nhanh',
      likes: 8,
      hasMedia: false
    },
    {
      id: 5,
      user: 'Văn C',
      rating: 3,
      comment: 'Hơi dính một chút, không hợp da mình lắm.',
      date: '2023-08-15 14:30',
      usage: 'Dưỡng ẩm',
      moisturizingEffect: 'Trung bình',
      absorption: 'Chậm',
      likes: 2,
      hasMedia: false
    },
    {
      id: 6,
      user: 'Kim D (Review thứ 6)',
      rating: 5,
      comment: 'Sản phẩm tốt, đáng tiền.',
      date: '2023-07-10 17:00',
      usage: 'Dưỡng ẩm',
      moisturizingEffect: 'Tốt',
      absorption: 'Nhanh',
      likes: 15,
      hasMedia: false
    },
    {
      id: 7,
      user: 'Ngọc E (Review thứ 7)',
      rating: 4,
      comment: 'Đóng gói cẩn thận. Giao hàng nhanh.',
      date: '2023-06-01 11:00',
      usage: 'Dưỡng ẩm',
      moisturizingEffect: 'Khá tốt',
      absorption: 'Nhanh',
      likes: 7,
      hasMedia: false
    }
  ] as DetailedReview[],
  recommended: [
    {
      id: 1,
      name: 'Sữa Rửa Mặt A',
      image: placeholderImage(150, 'SP 1'),
      price: '$399'
    },
    {
      id: 2,
      name: 'Toner B',
      image: placeholderImage(150, 'SP 2'),
      price: '$599'
    },
    {
      id: 3,
      name: 'Serum C',
      image: placeholderImage(150, 'SP 3'),
      price: '$699'
    },
    {
      id: 4,
      name: 'Mặt Nạ D',
      image: placeholderImage(150, 'SP 4'),
      price: '$799'
    },
    {
      id: 5,
      name: 'Kem Chống Nắng E',
      image: placeholderImage(150, 'SP 5'),
      price: '$899'
    },
    {
      id: 6,
      name: 'Toner F',
      image: placeholderImage(150, 'SP 6'),
      price: '$499'
    },
    // Thêm các sản phẩm ảo để đảm bảo có > 18 sản phẩm cho tính năng Xem thêm
    ...Array(15)
      .fill(0)
      .map((_, index) => ({
        id: index + 7,
        name: `Sản phẩm Gợi ý ${index + 7}`,
        image: placeholderImage(150, `SP ${index + 7}`),
        price: `$${(Math.random() * 500 + 100).toFixed(0)}`
      })),
    {
      // Tổng cộng 6 + 15 + 1 = 22 sản phẩm
      id: 22,
      name: 'Sản phẩm Gợi ý Z (ngoài 18)',
      image: placeholderImage(150, 'SP Z'),
      price: '$199'
    }
  ] as Recommended[]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    Number(value)
  )

const computeReviewSummary = (reviews: DetailedReview[]) => {
  const ratingsCount: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let totalComments = 0
  let totalMedia = 0

  reviews.forEach((review) => {
    ratingsCount[review.rating] = (ratingsCount[review.rating] || 0) + 1
    if (review.comment && review.comment.trim() !== '') totalComments += 1
    if (review.hasMedia) totalMedia += 1
  })

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)

  return { ratingsCount, totalComments, totalMedia, averageRating }
}





// ---------------------- MAIN ------------------------
const ProductPage = () => {
  const [searchParams] = useSearchParams()
  // const navigate = useNavigate() // navigate is used in handleAddToCart
  const navigate = useNavigate()
  const { token } = useAuth()
  const { refreshCart } = useCart()
  const rawProductId = searchParams.get('id')
  const productId = rawProductId?.trim() || null
  const isBackendProductId =
    !!productId &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      productId
    )
  const [productOverride, setProductOverride] = useState<
    Partial<typeof defaultProduct> & { 
      images?: string[]; 
      sellerName?: string;
      stock?: number;
      sold?: number;
      location?: string;
      discount?: number;
      rating?: number;
      originalPrice?: string;
      categoryName?: string;
    }
  >({})
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const product = useMemo(
    () => ({ ...defaultProduct, ...productOverride }),
    [productOverride]
  )
  const [selectedImage, setSelectedImage] = useState(0)

  const [selectedProduct, setSelectedProduct] = useState<Recommended | null>(
    null
  )
  const [quantity, setQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const [cartStatus, setCartStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  useEffect(() => {
    let isMounted = true
    if (!isBackendProductId) {
      setProductError(
        productId ? 'Sản phẩm demo đang được hiển thị tạm thời.' : null
      )
      setIsLoadingProduct(false)
      return () => {
        isMounted = false
      }
    }

    const fetchProduct = async () => {
      setIsLoadingProduct(true)
      setProductError(null)
      try {
        const data = await productsApi.getById(productId!)
        if (!isMounted) return
        setProductOverride({
          name: data.name,
          price: formatCurrency(Number(data.price)),
          images: data.images?.length ? data.images : defaultProduct.images,
          description: data.description ?? defaultProduct.description,
          sellerName: data.seller?.fullName || data.seller?.email || 'Shop',
          stock: data.stock,
          sold: data.sold,
          location: data.location,
          discount: data.discount,
          rating: data.rating,
          originalPrice: data.originalPrice ? formatCurrency(Number(data.originalPrice)) : undefined,
          categoryName: data.category?.name
        })
      } catch (err) {
        if (!isMounted) return
        const message =
          err instanceof ApiError
            ? err.message
            : 'Không thể tải thông tin sản phẩm.'
        setProductError(message)
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false)
        }
      }
    }

    fetchProduct()
    return () => {
      isMounted = false
    }
  }, [productId, isBackendProductId])

  // LOGIC CHO PHẦN GỢI Ý SẢN PHẨM (GIỮ NGUYÊN)
  const [showAllRecommended, setShowAllRecommended] = useState(false)
  const maxProductsToShow = 18
  const recommendedProductsToShow = showAllRecommended
    ? product.recommended
    : product.recommended.slice(0, maxProductsToShow)

  const handleToggleShowRecommended = () => {
    setShowAllRecommended(!showAllRecommended)
  }
  const shouldShowToggleButton = product.recommended.length > maxProductsToShow
  // KẾT THÚC LOGIC CHO PHẦN GỢI Ý SẢN PHẨM

  const increase = () => setQuantity(quantity + 1)
  const decrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1)

  const handleAddToCart = async () => {
    if (!isBackendProductId || !productId) {
      setCartMessage('Sản phẩm demo này chưa hỗ trợ thêm vào giỏ.')
      setCartStatus('error')
      return
    }

    if (!token) {
      setCartMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ.')
      setCartStatus('error')
      navigate('/login')
      return
    }

    // Decode JWT to check expiration and get user info
    let tokenInfo: {
      exp?: number
      email?: string
      role?: string
      sub?: string
    } = {}
    try {
      const payload = token.split('.')[1]
      if (payload) {
        tokenInfo = JSON.parse(atob(payload))
        const now = Math.floor(Date.now() / 1000)
        if (tokenInfo.exp && tokenInfo.exp < now) {
          console.warn('[cart] token expired', { exp: tokenInfo.exp, now })
          setCartMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
          setCartStatus('error')
          navigate('/login')
          return
        }
      }
    } catch (e) {
      console.warn('[cart] failed to decode token', e)
    }

    setCartStatus('loading')
    setCartMessage(null)
    try {
      console.log('[cart] adding item', {
        productId,
        productIdLength: productId.length,
        productIdCharCodes: Array.from(productId)
          .map((c, i) => `${i}:${c.charCodeAt(0)}`)
          .join(','),
        quantity,
        quantityType: typeof quantity,
        tokenPreview: `${token.slice(0, 20)}…`,
        tokenExp: tokenInfo.exp
          ? new Date(tokenInfo.exp * 1000).toISOString()
          : 'unknown',
        tokenEmail: tokenInfo.email,
        userId: tokenInfo.sub,
        tokenRole: tokenInfo.role
      })

      // Test cart access first to verify token works
      try {
        const existingCart = await cartApi.getCart(token)
        console.log('[cart] getCart success', {
          cartId: existingCart.id,
          itemCount: existingCart.items?.length || 0
        })
      } catch (cartError) {
        console.error('[cart] getCart failed - token may be invalid', cartError)
        if (cartError instanceof ApiError && cartError.status === 401) {
          setCartMessage(
            'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
          )
          setCartStatus('error')
          setTimeout(() => navigate('/login'), 2000)
          return
        }
      }

      await cartApi.addItem(token, {
        productId,
        quantity
      })
      console.log('[cart] add success')

      // Refresh cart to update header
      await refreshCart()

      setCartStatus('success')
      setCartMessage('Đã thêm vào giỏ hàng!')
    } catch (error) {
      console.error('[cart] add failed', {
        productId,
        quantity,
        error
      })
      setCartStatus('error')
      if (error instanceof ApiError) {
        // If 401, token might be invalid - suggest re-login
        if (error.status === 401) {
          setCartMessage(
            'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
          )
          setTimeout(() => navigate('/login'), 2000)
        } else {
          setCartMessage(error.message)
        }
      } else {
        setCartMessage('Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
      }
    }
  }

  const handleBuyNow = async () => {
    if (!productId || !isBackendProductId) {
      setCartMessage('Không thể mua sản phẩm demo.')
      setCartStatus('error')
      return
    }

    // Use token from useAuth context, same as handleAddToCart
    if (!token) {
      setCartMessage('Vui lòng đăng nhập để mua hàng.')
      setCartStatus('error')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    setCartStatus('loading')
    setCartMessage(null)
    try {
      console.log('[cart] Buy now - adding to cart first')

      // Add to cart first
      await cartApi.addItem(token, {
        productId,
        quantity
      })

      // Refresh cart
      await refreshCart()

      console.log('[cart] Buy now - redirecting to cart')

      // Navigate to cart to review before checkout
      navigate('/cart')
    } catch (error) {
      console.error('[cart] buy now failed', error)
      setCartStatus('error')
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setCartMessage(
            'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
          )
          setTimeout(() => navigate('/login'), 2000)
        } else {
          setCartMessage(error.message)
        }
      } else {
        setCartMessage('Không thể mua hàng. Vui lòng thử lại.')
      }
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 text-black'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <span>Trang chủ</span>
            <ChevronRight className='h-4 w-4' />
            {product.categoryName && (
              <>
                <span>{product.categoryName}</span>
                <ChevronRight className='h-4 w-4' />
              </>
            )}
            <span className='text-gray-800'>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-6 text-gray-800'>
        {productError && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600'>
            {productError}
          </div>
        )}
        {isLoadingProduct && (
          <div className='mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-600'>
            Đang tải thông tin sản phẩm...
          </div>
        )}
        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Left Column - Product Images */}
          <div className='lg:col-span-5'>
            <Card className='p-4'>
              <div className='relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden'>
                <img
                  src={product.images[selectedImage] || placeholderImage(400)}
                  alt={product.name}
                  className='object-cover w-full h-full'
                />
                {!!product.discount && product.discount > 0 && (
                  <Badge className='absolute top-4 left-4 bg-red-500 text-white'>
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              <div className='grid grid-cols-5 gap-2'>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded border-2 overflow-hidden ${
                      selectedImage === idx
                        ? 'border-orange-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img || placeholderImage(64)}
                      alt={`Thumbnail ${idx + 1}`}
                      className='object-cover w-full h-full'
                    />
                  </button>
                ))}
              </div>

              {/* Social Actions */}
              <div className='flex items-center gap-4 mt-6'>
                <span className='text-sm'>Chia sẻ:</span>
                <div className='flex gap-2'>
                  <Button variant='ghost' size='icon'>
                    <Facebook className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Twitter className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Share2 className='h-4 w-4' />
                  </Button>
                </div>
                <Button variant='ghost' className='ml-auto'>
                  <Heart className='h-4 w-4 mr-2' />
                  Đã thích (2.5k)
                </Button>
              </div>
            </Card>

            {/* Shop Info */}
            <Card className='p-4 mt-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>
                  {product.sellerName ? product.sellerName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{product.sellerName || 'Shop Giữ Nhiệt Cao Cấp'}</h3>
                  <p className='text-sm text-gray-500'>Online 2 giờ trước</p>
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' size='sm'>
                    <MessageSquare className='h-4 w-4 mr-2' />
                    Chat
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => toast.info('Tính năng đang phát triển')}
                  >
                    Xem Shop
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Product Details */}
          <div className='lg:col-span-7'>
            <Card className='p-6'>
              <div className='bg-orange-50 px-4 py-2 mb-4'>
                <span className='text-orange-600 font-medium'>Yêu thích+</span>
              </div>

              <h1 className='text-2xl font-bold mb-4 text-balance'>
                {product.name}
              </h1>

              <div className='flex items-center gap-6 mb-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-orange-500 font-bold underline'>
                    {product.rating}
                  </span>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

              <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                <div className='flex items-baseline gap-4'>
                  <span className='text-3xl font-bold text-orange-500'>
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className='text-lg line-through text-gray-400'>
                      {product.originalPrice}
                    </span>
                  )}
                  {!!product.discount && product.discount > 0 && (
                    <Badge variant='destructive' className='bg-orange-500'>
                      -{product.discount}% GIẢM
                    </Badge>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className='space-y-3 mb-6'>
                <div className='flex items-start gap-3'>
                  <span className='text-muted-foreground min-w-[120px]'>
                    Vận Chuyển
                  </span>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <ShoppingCart className='h-4 w-4' />
                      <span className='font-medium'>Miễn phí vận chuyển</span>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Vận Chuyển Tới: Hà Nội, Quận Ba Đình, Phường Phúc Xá
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className='flex items-center gap-3 mb-6'>
                <span className='text-gray-500 min-w-[120px]'>Số Lượng</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={decrease}
                    disabled={quantity <= 1}
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className='w-12 text-center border-y-0 border-x focus:outline-none'
                  />
                  <Button variant='outline' size='icon' onClick={increase}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <span className='text-sm text-gray-500'>
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-2'>
                <div className='flex gap-4'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='flex-1 bg-orange-100 border-orange-500 text-orange-600 hover:bg-orange-200'
                    onClick={handleAddToCart}
                    disabled={cartStatus === 'loading'}
                  >
                    <ShoppingCart className='h-5 w-5 mr-2' />
                    {cartStatus === 'loading' && !cartMessage?.includes('Mua')
                      ? 'Đang thêm...'
                      : 'Thêm Vào Giỏ Hàng'}
                  </Button>
                  <Button
                    size='lg'
                    className='flex-1 bg-orange-500 hover:bg-orange-600'
                    onClick={handleBuyNow}
                    disabled={cartStatus === 'loading'}
                  >
                    {cartStatus === 'loading' && cartMessage?.includes('Mua')
                      ? 'Đang xử lý...'
                      : 'Mua Ngay'}
                  </Button>
                </div>
                {cartMessage && (
                  <p
                    className={`text-sm mt-2 ${
                      cartStatus === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {cartMessage}
                  </p>
                )}
              </div>
            </Card>

            {/* Product Details */}
            <Card className='p-6 mt-4 text-sm'>
              <h2 className='text-xl font-bold mb-4'>CHI TIẾT SẢN PHẨM</h2>
              <div className='space-y-3'>
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Danh Mục
                  </span>
                  <span>
                    Online Shop &gt; Nhà Cửa & Đời Sống &gt; Cốc, Ly & Bình giữ
                    nhiệt
                  </span>
                </div>
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Thương hiệu
                  </span>
                  <span>No Brand</span>
                </div>
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Xuất xứ
                  </span>
                  <span>Việt Nam</span>
                </div>
                {/* Hidden unsupported fields
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Dung tích
                  </span>
                  <span>510ml</span>
                </div>
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Chất liệu
                  </span>
                  <span>Inox 304</span>
                </div>
                */}
                <div className='flex'>
                  <span className='text-muted-foreground w-[180px]'>
                    Gửi từ
                  </span>
                  <span>{product.location}</span>
                </div>
              </div>

              <Separator className='my-6' />

              <h2 className='text-xl font-bold mb-4'>MÔ TẢ SẢN PHẨM</h2>
              <div className='prose prose-sm max-w-none text-muted-foreground whitespace-pre-line'>
                {product.description}
              </div>
            </Card>
          </div>
        </div>

        <Card className='p-6 mt-6'>
          <h2 className='text-xl font-bold mb-6'>ĐÁNH GIÁ SẢN PHẨM</h2>

          <div className='flex items-center gap-8 mb-6 p-6 bg-orange-50 rounded-lg'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-orange-500 mb-2'>
                {computeReviewSummary(product.reviews).averageRating.toFixed(1)}/5
              </div>
              <div className='flex justify-center mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='h-5 w-5 fill-orange-400 text-orange-400'
                  />
                ))}
              </div>
              <div className='text-sm text-muted-foreground'>
                {product.reviews.length} đánh giá
              </div>
            </div>
            <div className='flex-1'>
              <Tabs defaultValue='all'>
                <TabsList>
                  <TabsTrigger value='all'>Tất Cả</TabsTrigger>
                  <TabsTrigger value='5'>5 Sao (2k)</TabsTrigger>
                  <TabsTrigger value='4'>4 Sao (400)</TabsTrigger>
                  <TabsTrigger value='3'>3 Sao (80)</TabsTrigger>
                  <TabsTrigger value='image'>Có Hình Ảnh (1.5k)</TabsTrigger>
                  <TabsTrigger value='text'>Có Bình Luận (2k)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className='space-y-6'>
            {product.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className='border-b pb-6 last:border-b-0'>
                <div className='flex items-start gap-3 mb-3'>
                  <Avatar>
                    <div className='w-full h-full bg-gray-300 flex items-center justify-center text-white'>
                      {review.user.charAt(0)}
                    </div>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='font-medium mb-1'>{review.user}</div>
                    <div className='flex gap-1 mb-2'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className='text-sm text-muted-foreground mb-2'>
                      {review.date}
                    </div>
                    <p className='text-sm mb-3'>{review.comment}</p>
                    {review.hasMedia && (
                      <div className='flex gap-2'>
                        <div className='relative w-20 h-20 rounded overflow-hidden border'>
                          <img
                            src={placeholderImage(80, 'Review')}
                            alt='Review'
                            className='object-cover w-full h-full'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center mt-6'>
            <Button variant='outline'>Xem Thêm Đánh Giá</Button>
          </div>
        </Card>

        {/* Related Products */}
        <div className='mt-12'>
          <h2 className='text-xl font-bold mb-6 bg-white p-4 rounded-lg'>
            Sản phẩm Gợi ý
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {recommendedProductsToShow.map((item) => (
              <Card
                key={item.id}
                className='overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer'
                onClick={() => setSelectedProduct(item)}
              >
                <div className='relative aspect-square'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='object-cover w-full h-full'
                  />
                  <Badge className='absolute top-2 right-2 bg-orange-500 text-white text-xs'>
                    -12%
                  </Badge>
                </div>
                <div className='p-3'>
                  <h3 className='text-sm font-medium mb-2 line-clamp-2 text-balance min-h-[40px]'>
                    {item.name}
                  </h3>
                  <div className='flex items-baseline gap-2 mb-2 text-sm'>
                    <span className='text-orange-500 font-bold'>
                      {item.price}
                    </span>
                    <span className='text-xs line-through text-gray-400'>
                      ₫
                      {Math.floor(
                        Math.random() * 300000 + 100000
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Đã bán {Math.floor(Math.random() * 1000)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {shouldShowToggleButton && (
            <div className='text-center mt-6'>
              <Button variant='outline' onClick={handleToggleShowRecommended}>
                {showAllRecommended
                  ? 'Ẩn bớt ▲'
                  : `Xem thêm ${
                      product.recommended.length - maxProductsToShow
                    } sản phẩm khác ▼`}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for selected product */}
      {selectedProduct && (
        <div className='fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <Card className='p-6 max-w-sm w-full'>
            <h3 className='text-xl font-bold mb-4'>Chi tiết sản phẩm</h3>
            <p>{selectedProduct.name}</p>
            <p className='text-orange-500 font-bold'>{selectedProduct.price}</p>
            <Button onClick={() => setSelectedProduct(null)} className='mt-4'>
              Đóng
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ProductPage
