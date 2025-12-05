import { useState, useCallback, useEffect } from 'react'
import { cartApi } from '@/lib/api'
import type { CartResponse, AddCartItemPayload, UpdateCartItemPayload } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

export function useCart() {
  const { token } = useAuth()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await cartApi.getCart(token)
      setCart(res)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }, [token])

  const addToCart = useCallback(async (payload: AddCartItemPayload) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await cartApi.addItem(token, payload)
      setCart(res)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const updateCartItem = useCallback(async (itemId: string, payload: UpdateCartItemPayload) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await cartApi.updateItem(token, itemId, payload)
      setCart(res)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await cartApi.removeItem(token, itemId)
      setCart(res)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to remove cart item')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const clearCart = useCallback(async () => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await cartApi.clearCart(token)
      setCart(res)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [token, fetchCart])

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  }
}
