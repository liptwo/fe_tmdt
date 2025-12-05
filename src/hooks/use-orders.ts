import { useState, useCallback } from 'react'
import { ordersApi } from '@/lib/api'
import type { Order, CreateOrderPayload } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

export function useOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await ordersApi.list(token)
      setOrders(res)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [token])

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await ordersApi.create(token, payload)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to create order')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const getOrderById = useCallback(async (id: string) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      return await ordersApi.getById(token, id)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      await ordersApi.cancel(token, orderId)
      // Refresh orders list
      await fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token, fetchOrders])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
    cancelOrder
  }
}
