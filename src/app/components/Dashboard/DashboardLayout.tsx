'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950'>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Main content */}
      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className='flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto'>{children}</main>
      </div>
    </div>
  )
}
