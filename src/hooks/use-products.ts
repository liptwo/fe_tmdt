import { useState, useCallback } from 'react'
import { productsApi } from '@/lib/api'
import type { Product, ProductsQuery } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

export function useProducts() {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchProducts = useCallback(async (params?: ProductsQuery) => {
    setLoading(true)
    setError(null)
    try {
      const res = await productsApi.list(params)
      setProducts(res.products)
      setPagination(res.pagination)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [])

  const getProductById = useCallback(async (id: string) => {
    setLoading(true)
    try {
      return await productsApi.getById(id)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (formData: FormData) => {
    if (!token) throw new Error('Authentication required')
    setLoading(true)
    try {
      const res = await productsApi.create(token, formData)
      return res
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct
  }
}
