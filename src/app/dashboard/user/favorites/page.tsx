'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const favorites = [
  {
    id: 1,
    type: 'celebrity',
    name: 'Emma Watson',
    image: '/images/team/user1.svg',
    description: 'Actress & Activist',
    addedDate: '2024-01-15',
  },
  {
    id: 2,
    type: 'outfit',
    name: 'Red Carpet Elegance',
    image: '/images/featured/featured1.svg',
    description: 'Oscar 2024 Best Look',
    addedDate: '2024-01-14',
  },
  {
    id: 3,
    type: 'celebrity',
    name: 'Zendaya',
    image: '/images/team/user2.svg',
    description: 'Actress & Singer',
    addedDate: '2024-01-13',
  },
  {
    id: 4,
    type: 'outfit',
    name: 'Summer Casual Style',
    image: '/images/featured/featured2.svg',
    description: 'Street Fashion 2024',
    addedDate: '2024-01-12',
  },
]

export default function FavoritesPage() {
  const [filter, setFilter] = useState<'all' | 'celebrity' | 'outfit'>('all')

  const filteredFavorites =
    filter === 'all'
      ? favorites
      : favorites.filter((item) => item.type === filter)

  return (
    <DashboardLayout requiredRole='user'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            My Favorites
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            All your favorite celebrities and outfits in one place.
          </p>
        </div>

        {/* Filters */}
        <div className='flex gap-3'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-gray-800'
            }`}>
            All
          </button>
          <button
            onClick={() => setFilter('celebrity')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'celebrity'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-gray-800'
            }`}>
            Celebrities
          </button>
          <button
            onClick={() => setFilter('outfit')}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === 'outfit'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-gray-800'
            }`}>
            Outfits
          </button>
        </div>

        {/* Favorites Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden group'>
              <div className='relative h-64 overflow-hidden'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute top-4 right-4'>
                  <button className='p-2 bg-white dark:bg-black rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                    <Icon
                      icon='mdi:heart'
                      width='20'
                      height='20'
                      className='text-red-500'
                    />
                  </button>
                </div>
                <div className='absolute top-4 left-4'>
                  <span className='px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize'>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-black dark:text-white mb-2'>
                  {item.name}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
                  {item.description}
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-500 dark:text-gray-400 text-xs'>
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </span>
                  <button className='text-primary hover:text-primary/80 transition-colors font-medium text-sm'>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFavorites.length === 0 && (
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-12 text-center border border-gray-200 dark:border-gray-800'>
            <Icon
              icon='mdi:heart-outline'
              width='64'
              height='64'
              className='text-gray-300 dark:text-gray-700 mx-auto mb-4'
            />
            <h3 className='text-xl font-bold text-black dark:text-white mb-2'>
              No favorites yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Start adding your favorite celebrities and outfits!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
