'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

const savedOutfits = [
  {
    id: 1,
    name: 'Summer Casual 2024',
    celebrity: 'Emma Watson',
    items: 5,
    image: '/images/featured/featured1.svg',
    category: 'Casual',
    savedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Red Carpet Elegance',
    celebrity: 'Zendaya',
    items: 4,
    image: '/images/featured/featured2.svg',
    category: 'Formal',
    savedDate: '2024-01-14',
  },
  {
    id: 3,
    name: 'Street Style Inspiration',
    celebrity: 'Gigi Hadid',
    items: 6,
    image: '/images/featured/featured3.svg',
    category: 'Street',
    savedDate: '2024-01-13',
  },
]

export default function SavedOutfitsPage() {
  return (
    <DashboardLayout requiredRole='user'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              Saved Outfits
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Your collection of style inspirations.
            </p>
          </div>
          <button className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Create New</span>
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:tshirt-crew'
                  width='24'
                  height='24'
                  className='text-blue-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Total Outfits
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {savedOutfits.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:hanger'
                  width='24'
                  height='24'
                  className='text-green-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Total Items
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {savedOutfits.reduce((sum, outfit) => sum + outfit.items, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-purple-50 dark:bg-purple-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:tag'
                  width='24'
                  height='24'
                  className='text-purple-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Categories
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {new Set(savedOutfits.map((o) => o.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Outfits Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden group cursor-pointer'>
              <div className='relative h-64 overflow-hidden'>
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='absolute top-4 right-4 flex gap-2'>
                  <button className='p-2 bg-white dark:bg-black rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                    <Icon
                      icon='mdi:pencil'
                      width='18'
                      height='18'
                      className='text-blue-500'
                    />
                  </button>
                  <button className='p-2 bg-white dark:bg-black rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                    <Icon
                      icon='mdi:delete'
                      width='18'
                      height='18'
                      className='text-red-500'
                    />
                  </button>
                </div>
                <div className='absolute top-4 left-4'>
                  <span className='px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full'>
                    {outfit.category}
                  </span>
                </div>
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-black dark:text-white mb-2'>
                  {outfit.name}
                </h3>
                <div className='flex items-center gap-2 mb-3'>
                  <Icon
                    icon='mdi:star'
                    width='16'
                    height='16'
                    className='text-yellow-500'
                  />
                  <span className='text-gray-600 dark:text-gray-400 text-sm'>
                    Inspired by {outfit.celebrity}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm'>
                    <Icon icon='mdi:hanger' width='16' height='16' />
                    <span>{outfit.items} items</span>
                  </div>
                  <span className='text-gray-500 dark:text-gray-400 text-xs'>
                    {new Date(outfit.savedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
