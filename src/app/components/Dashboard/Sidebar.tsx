'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

interface SubMenuItem {
  label: string
  href: string
}

interface MenuItem {
  icon: string
  label: string
  href?: string
  roles: ('user' | 'admin' | 'superadmin')[]
  submenu?: SubMenuItem[]
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
    roles: ['superadmin'],
    submenu: [
      { label: 'Celebrity Profiles', href: '/dashboard/superadmin/content/celebrities' },
      { label: 'Celebrity Outfits', href: '/dashboard/superadmin/content/outfits' },
      { label: 'Celebrity News', href: '/dashboard/superadmin/content/news' },
      { label: 'Upcoming Movies', href: '/dashboard/superadmin/content/movies' },
      { label: 'Movie Reviews', href: '/dashboard/superadmin/content/reviews' },
    ]
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

interface SidebarProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  console.log('Current user:', user)
  if (!user) return null

  let items: MenuItem[] = []
  if (user.role === 'superadmin') {
    items = superadminMenuItems
  } else if (user.role === 'admin') {
    items = adminMenuItems
  } else {
    items = menuItems
  }

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label)
  }

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 
      h-screen flex flex-col overflow-hidden
      transform transition-transform duration-300 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Close button for mobile */}
      <div className='lg:hidden flex justify-end p-4 border-b border-gray-200 dark:border-gray-800'>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors'
        >
          <Icon icon='mdi:close' width='24' height='24' className='text-gray-700 dark:text-gray-300' />
        </button>
      </div>
      
      {/* User Info */}
      <div className='p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800'>
        <div className='flex items-center gap-3'>
          <img
            src={user.avatar || '/images/team/user1.svg'}
            alt={user.name}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='flex-1'>
            <h3 className='text-lg font-bold text-black dark:text-white truncate'>
              {user.name}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 capitalize'>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 overflow-y-auto'>
        <ul className='space-y-2'>
          {items.map((item) => {
            const isActive = item.href ? pathname === item.href : false
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isSubmenuOpen = openSubmenu === item.label
            const isSubmenuItemActive = hasSubmenu && item.submenu?.some(sub => pathname === sub.href)
            
            return (
              <li key={item.label}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isSubmenuItemActive
                          ? 'bg-primary/10 text-primary dark:text-primary'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                      }`}>
                      <div className='flex items-center gap-3'>
                        <Icon icon={item.icon} width='20' height='20' />
                        <span className='font-medium'>{item.label}</span>
                      </div>
                      <Icon 
                        icon={isSubmenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
                        width='20' 
                        height='20' 
                      />
                    </button>
                    {isSubmenuOpen && (
                      <ul className='mt-2 ml-4 space-y-1'>
                        {item.submenu?.map((subItem) => {
                          const isSubActive = pathname === subItem.href
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                  isSubActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                                }`}>
                                <Icon icon='mdi:circle-small' width='16' height='16' />
                                <span>{subItem.label}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}>
                    <Icon icon={item.icon} width='20' height='20' />
                    <span className='font-medium'>{item.label}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

    </aside>
  )
}
