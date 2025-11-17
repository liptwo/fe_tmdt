const DEFAULT_API_BASE_URL = 'https://backend-ecommerce-e8b7.onrender.com/api'

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  DEFAULT_API_BASE_URL

class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    },
    ...init
  })

  const text = await response.text()
  let data: any = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (err) {
      console.error('Failed to parse response JSON', err)
    }
  }

  if (!response.ok) {
    // Log full error details for debugging
    console.error('[api] request failed', {
      url,
      status: response.status,
      statusText: response.statusText,
      responseBody: text,
      parsedData: data
    })
    const message =
      (Array.isArray(data?.message) ? data.message[0] : data?.message) ??
      'Đã có lỗi xảy ra. Vui lòng thử lại.'
    throw new ApiError(message, response.status, data)
  }

  return data as T
}

type QueryParamValue = string | number | boolean | undefined | null

const buildQueryString = (params?: Record<string, QueryParamValue>) => {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export interface UserInfo {
  id: string
  email: string
  fullName: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  fullName: string
  role?: string
}

export interface LoginResponse {
  access_token: string
  user: UserInfo
}

export type RegisterResponse = UserInfo

export interface Category {
  id: string
  name: string
  description?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProductsQuery extends Record<string, QueryParamValue> {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  images: string[]
  status: string
  categoryId: string
  sellerId: string
  category?: Category
  seller?: {
    id: string
    email: string
    fullName: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProductListResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AddCartItemPayload {
  productId: string
  quantity: number
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  unitPrice: string
  product?: Product
}

export interface CartResponse {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getProfile: (token: string) =>
    request<UserInfo>('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export const categoriesApi = {
  list: () => request<Category[]>('/categories')
}

export const productsApi = {
  list: (params?: ProductsQuery) =>
    request<ProductListResponse>(`/products${buildQueryString(params)}`),
  getById: (id: string) => request<Product>(`/products/${id}`)
}

export const cartApi = {
  addItem: (token: string, payload: AddCartItemPayload) =>
    request<CartResponse>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export { ApiError }

