import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, type UserInfo } from '@/lib/api'

interface AuthContextValue {
  user: UserInfo | null
  token: string | null
  isLoading: boolean
  refreshProfile: (tokenOverride?: string) => Promise<void>
  setSession: (token: string, user?: UserInfo | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistToken = useCallback((value: string | null) => {
    if (value) {
      localStorage.setItem('access_token', value)
    } else {
      localStorage.removeItem('access_token')
    }
    setToken(value)
  }, [])

  const persistUser = useCallback((value: UserInfo | null) => {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value))
    } else {
      localStorage.removeItem('user')
    }
    setUser(value)
  }, [])

  const clearSession = useCallback(() => {
    persistToken(null)
    persistUser(null)
  }, [persistToken, persistUser])

  const refreshProfile = useCallback(
    async (tokenOverride?: string) => {
      const activeToken =
        tokenOverride ?? token ?? localStorage.getItem('access_token')

      if (!activeToken) {
        clearSession()
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const profile = await authApi.getProfile(activeToken)
        persistToken(activeToken)
        persistUser(profile)
      } catch (error) {
        console.error('Failed to fetch profile', error)
        clearSession()
      } finally {
        setIsLoading(false)
      }
    },
    [clearSession, persistToken, persistUser, token]
  )

  const setSession = useCallback(
    (newToken: string, userData?: UserInfo | null) => {
      persistToken(newToken)
      if (userData) {
        persistUser(userData)
        setIsLoading(false)
      } else {
        void refreshProfile(newToken)
      }
    },
    [persistToken, persistUser, refreshProfile]
  )

  const logout = useCallback(() => {
    clearSession()
    setIsLoading(false)
  }, [clearSession])

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      persistToken(storedToken)
      if (storedUser) {
        try {
          persistUser(JSON.parse(storedUser))
        } catch {
          persistUser(null)
        }
      }
      void refreshProfile(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [persistToken, persistUser, refreshProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      refreshProfile,
      setSession,
      logout
    }),
    [user, token, isLoading, refreshProfile, setSession, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

