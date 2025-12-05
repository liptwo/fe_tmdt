import { useState, useCallback, useEffect } from 'react'
import { categoriesApi } from '@/lib/api'
import type { Category } from '@/lib/api'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesApi.list()
      setCategories(res)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto fetch on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
