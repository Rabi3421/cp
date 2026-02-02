'use client'

import { Icon } from '@iconify/react'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className='bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 md:px-8 py-3 md:py-4'>
      <div className='flex items-center justify-between'>
        {/* Page Title/Breadcrumb - can be made dynamic later */}
        <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
          <button 
            onClick={onMenuClick}
            className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors flex-shrink-0'
          >
            <Icon icon='mdi:menu' width='24' height='24' className='text-gray-700 dark:text-gray-300' />
          </button>
          <div className='min-w-0'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-black dark:text-white truncate'>
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className='hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate'>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className='flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0'>
          {/* Notifications */}
          <button className='hidden sm:flex relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors'>
            <Icon icon='mdi:bell' width='20' height='20' className='text-gray-700 dark:text-gray-300' />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
          </button>

          {/* Search */}
          <button className='hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors'>
            <Icon icon='mdi:magnify' width='20' height='20' className='text-gray-700 dark:text-gray-300' />
          </button>

          {/* Divider */}
          <div className='hidden sm:block w-px h-6 md:h-8 bg-gray-200 dark:bg-gray-800' />

          {/* User Profile */}
          <div className='hidden sm:flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 bg-gray-50 dark:bg-gray-900 rounded-lg'>
            <img
              src={user.avatar || '/images/team/user1.svg'}
              alt={user.name}
              className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover'
            />
            <div className='hidden md:block'>
              <p className='text-sm font-semibold text-black dark:text-white'>
                {user.name}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
                {user.role}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className='flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm'
            title='Logout'
          >
            <Icon icon='mdi:logout' width='18' height='18' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
