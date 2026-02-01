'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'superadmin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check localStorage first for immediate render
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }

    // Then verify with server
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Login failed')
    }

    const data = await res.json()
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Redirect based on role
    if (data.user.role === 'superadmin') {
      router.push('/dashboard/superadmin')
    } else if (data.user.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
