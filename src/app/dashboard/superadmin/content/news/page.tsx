'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              Celebrity News
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage celebrity news articles and updates
            </p>
          </div>
          <button className='flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
            <Icon icon='mdi:plus' width='20' height='20' />
            <span className='font-medium'>Add News</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className='flex gap-4'>
          <div className='flex-1 relative'>
            <Icon
              icon='mdi:magnify'
              width='20'
              height='20'
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              placeholder='Search news articles...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>
          <select className='px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'>
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Scheduled</option>
          </select>
        </div>

        {/* Coming Soon Card */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-12 border border-gray-200 dark:border-gray-800 text-center'>
          <Icon
            icon='mdi:newspaper'
            width='64'
            height='64'
            className='mx-auto mb-4 text-primary'
          />
          <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>
            News Management Coming Soon
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Full news article management features will be available here. You'll be able to create, publish, and manage celebrity news and updates.
          </p>
          <div className='flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:check-circle' width='16' height='16' className='text-green-500' />
              <span>Rich Text Editor</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:check-circle' width='16' height='16' className='text-green-500' />
              <span>Media Upload</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:check-circle' width='16' height='16' className='text-green-500' />
              <span>Scheduling</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
