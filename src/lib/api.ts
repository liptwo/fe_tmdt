const DEFAULT_API_BASE_URL = '/api'

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
  const isFormData = init.body instanceof FormData
  const headers = {
    ...(init.headers ?? {})
  } as Record<string, string>

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...init,
    headers
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
  address?: string
  phone?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountHolder?: string
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
  image?: string
  imageUrl?: string
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
  originalPrice?: number
  stock: number
  sold?: number
  rating?: number
  location?: string
  discount?: number
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
    }),
  updateProfile: (token: string, data: any) =>
    request<UserInfo>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
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
  getById: (id: string) => request<Product>(`/products/${id}`),
  create: (token: string, formData: FormData) =>
    request<Product>('/products', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  update: (token: string, id: string, formData: FormData) =>
    request<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  delete: (token: string, id: string) =>
    request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  listMyProducts: (token: string) =>
    request<Product[]>('/products/seller/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export interface UpdateCartItemPayload {
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  phoneNumber: string
  address: string
  city: string
  district?: string
  ward?: string
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress
  paymentMethod: 'COD' | 'VNPAY' | 'BANK_TRANSFER'
  note?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: string
  product?: Product
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: string
  totalAmount: string
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: string
  note?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export type CreateOrderResponse = Order & {
  paymentUrl?: string
}

export const cartApi = {
  getCart: (token: string) =>
    request<CartResponse>('/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  addItem: (token: string, payload: AddCartItemPayload) => {
    console.log('[cartApi.addItem] sending payload', {
      payload,
      stringified: JSON.stringify(payload),
      productIdType: typeof payload.productId,
      quantityType: typeof payload.quantity
    })
    return request<CartResponse>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },
  updateItem: (token: string, itemId: string, payload: UpdateCartItemPayload) =>
    request<CartResponse>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  removeItem: (token: string, itemId: string) =>
    request<CartResponse>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  clearCart: (token: string) =>
    request<CartResponse>('/cart/clear', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export const ordersApi = {
  create: (token: string, payload: CreateOrderPayload) =>
    request<CreateOrderResponse>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  list: (token: string) =>
    request<Order[]>('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  getById: (token: string, orderId: string) =>
    request<Order>(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  cancel: (token: string, orderId: string) =>
    request<Order>(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}

export const adminApi = {
  getStats: (token: string) => request<any>('/admin/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getUsers: (token: string, params?: { role?: string; status?: string }) =>
    request<UserInfo[]>(`/admin/users${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateUserStatus: (token: string, id: string, status: string) =>
    request<UserInfo>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}` }
    })
}

export { ApiError }

