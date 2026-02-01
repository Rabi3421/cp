'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Loader from '../Common/Loader'

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'admin' | 'superadmin'
}

export default function DashboardLayout({
  children,
  requiredRole = 'user',
}: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }

    if (!loading && user && requiredRole) {
      // Check role hierarchy
      const roleHierarchy = {
        user: 0,
        admin: 1,
        superadmin: 2,
      }

      if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
        // Redirect to appropriate dashboard if role is insufficient
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [user, loading, requiredRole, router])

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return null
  }

  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-950'>
      <Sidebar />
      <main className='flex-1 p-8'>{children}</main>
    </div>
  )
}
