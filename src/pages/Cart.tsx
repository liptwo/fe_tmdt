import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import { cartApi } from '@/lib/api'
import type { CartItem } from '@/lib/api'

export default function Cart() {
  const { user, token } = useAuth()
  const { cart, refreshCart, isLoading } = useCart()
  const navigate = useNavigate()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    if (!token || newQuantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(item.id))
    try {
      await cartApi.updateItem(token, item.id, { quantity: newQuantity })
      await refreshCart()
    } catch (error) {
      console.error('[Cart] Failed to update quantity:', error)
      alert('Không thể cập nhật số lượng. Vui lòng thử lại.')
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!token) return

    setRemovingItems((prev) => new Set(prev).add(itemId))
    try {
      await cartApi.removeItem(token, itemId)
      await refreshCart()
    } catch (error) {
      console.error('[Cart] Failed to remove item:', error)
      alert('Không thể xóa sản phẩm. Vui lòng thử lại.')
    } finally {
      setRemovingItems((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      return total + Number(item.unitPrice) * item.quantity
    }, 0)
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <ShoppingBag size={80} className='mx-auto text-gray-300 mb-4' />
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            Giỏ hàng trống
          </h2>
          <p className='text-gray-500 mb-6'>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link
            to='/'
            className='inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors'
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  const total = calculateTotal()
  const itemCount = cart.items.length

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Giỏ hàng của bạn
          </h1>
          <p className='text-gray-600'>{itemCount} sản phẩm</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.id)
              const isRemoving = removingItems.has(item.id)
              const isDisabled = isUpdating || isRemoving

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-md p-4 transition-all ${
                    isRemoving ? 'opacity-50' : ''
                  }`}
                >
                  <div className='flex gap-4'>
                    {/* Product Image */}
                    <Link
                      to={`/product?id=${item.productId}`}
                      className='flex-shrink-0'
                    >
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className='w-24 h-24 object-cover rounded-lg border border-gray-200'
                        />
                      ) : (
                        <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center'>
                          <ShoppingBag size={32} className='text-gray-400' />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className='flex-1 min-w-0'>
                      <Link
                        to={`/product?id=${item.productId}`}
                        className='block'
                      >
                        <h3 className='text-lg font-semibold text-gray-900 hover:text-orange-500 line-clamp-2 mb-2'>
                          {item.product?.name || 'Sản phẩm'}
                        </h3>
                      </Link>

                      <p className='text-xl font-bold text-orange-500 mb-3'>
                        ₫{Number(item.unitPrice).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className='flex items-center gap-4'>
                        <div className='flex items-center border border-gray-300 rounded-lg'>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity - 1)
                            }
                            disabled={isDisabled || item.quantity <= 1}
                            className='px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          >
                            <Minus size={16} />
                          </button>
                          <span className='px-4 py-2 min-w-[3rem] text-center font-semibold'>
                            {isUpdating ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity + 1)
                            }
                            disabled={isDisabled}
                            className='px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isDisabled}
                          className='flex items-center gap-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                          <Trash2 size={18} />
                          <span className='text-sm'>Xóa</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className='text-right'>
                      <p className='text-sm text-gray-500 mb-1'>Tạm tính</p>
                      <p className='text-xl font-bold text-gray-900'>
                        ₫
                        {(
                          Number(item.unitPrice) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>
                Tóm tắt đơn hàng
              </h2>

              <div className='space-y-3 mb-4'>
                <div className='flex justify-between text-gray-600'>
                  <span>Tạm tính ({itemCount} sản phẩm)</span>
                  <span>₫{total.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Phí vận chuyển</span>
                  <span className='text-green-600'>Miễn phí</span>
                </div>
              </div>

              <div className='border-t border-gray-200 pt-4 mb-4'>
                <div className='flex justify-between text-lg font-bold text-gray-900'>
                  <span>Tổng cộng</span>
                  <span className='text-orange-500'>
                    ₫{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to='/checkout'
                className='block w-full bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold mb-3'
              >
                Thanh toán
              </Link>

              <Link
                to='/'
                className='block w-full border border-orange-500 text-orange-500 text-center py-3 rounded-lg hover:bg-orange-50 transition-colors'
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
