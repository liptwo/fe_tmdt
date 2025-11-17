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
    const message =
      (Array.isArray(data?.message) ? data.message[0] : data?.message) ??
      'Đã có lỗi xảy ra. Vui lòng thử lại.'
    throw new ApiError(message, response.status, data)
  }

  return data as T
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
    })
}

export { ApiError }

