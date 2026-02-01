'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface MenuItem {
  icon: string
  label: string
  href: string
  roles: ('user' | 'admin' | 'superadmin')[]
}

const menuItems: MenuItem[] = [
  {
    icon: 'mdi:view-dashboard',
    label: 'Dashboard',
    href: '/dashboard/user',
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    icon: 'mdi:heart',
    label: 'My Favorites',
    href: '/dashboard/user/favorites',
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    icon: 'mdi:tshirt-crew',
    label: 'Saved Outfits',
    href: '/dashboard/user/outfits',
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    icon: 'mdi:account',
    label: 'Profile',
    href: '/dashboard/user/profile',
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    icon: 'mdi:cog',
    label: 'Settings',
    href: '/dashboard/user/settings',
    roles: ['user', 'admin', 'superadmin'],
  },
]

const adminMenuItems: MenuItem[] = [
  {
    icon: 'mdi:view-dashboard',
    label: 'Dashboard',
    href: '/dashboard/admin',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:account-group',
    label: 'Users',
    href: '/dashboard/admin/users',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:star',
    label: 'Celebrities',
    href: '/dashboard/admin/celebrities',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:tshirt-crew',
    label: 'Outfits',
    href: '/dashboard/admin/outfits',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:newspaper',
    label: 'News',
    href: '/dashboard/admin/news',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:post',
    label: 'Blogs',
    href: '/dashboard/admin/blogs',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:movie',
    label: 'Movies',
    href: '/dashboard/admin/movies',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:chart-line',
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    roles: ['admin', 'superadmin'],
  },
  {
    icon: 'mdi:cog',
    label: 'Settings',
    href: '/dashboard/admin/settings',
    roles: ['admin', 'superadmin'],
  },
]

const superadminMenuItems: MenuItem[] = [
  {
    icon: 'mdi:view-dashboard',
    label: 'Dashboard',
    href: '/dashboard/superadmin',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:account-group',
    label: 'All Users',
    href: '/dashboard/superadmin/users',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:shield-account',
    label: 'Admins',
    href: '/dashboard/superadmin/admins',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:server',
    label: 'System',
    href: '/dashboard/superadmin/system',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:folder-multiple',
    label: 'Content',
    href: '/dashboard/superadmin/content',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:chart-bar',
    label: 'Analytics',
    href: '/dashboard/superadmin/analytics',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:file-document',
    label: 'Logs',
    href: '/dashboard/superadmin/logs',
    roles: ['superadmin'],
  },
  {
    icon: 'mdi:cog',
    label: 'Settings',
    href: '/dashboard/superadmin/settings',
    roles: ['superadmin'],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  let items: MenuItem[] = []
  if (user.role === 'superadmin') {
    items = superadminMenuItems
  } else if (user.role === 'admin') {
    items = adminMenuItems
  } else {
    items = menuItems
  }

  return (
    <aside className='w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col'>
      {/* User Info */}
      <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
        <div className='flex items-center gap-3'>
          <img
            src={user.avatar || '/images/team/user1.svg'}
            alt={user.name}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='flex-1'>
            <h3 className='font-semibold text-black dark:text-white truncate'>
              {user.name}
            </h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4'>
        <ul className='space-y-2'>
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}>
                  <Icon icon={item.icon} width='20' height='20' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
        <button
          onClick={logout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'>
          <Icon icon='mdi:logout' width='20' height='20' />
          <span className='font-medium'>Logout</span>
        </button>
      </div>
    </aside>
  )
}
