'use client'

import { Icon } from '@iconify/react'
import { Outfit } from '@/app/types/outfit'

interface OutfitListProps {
  outfits: Outfit[]
  onEdit: (outfit: Outfit) => void
  onDelete: (id: string) => void
  pagination: {
    page: number
    pages: number
    total: number
  }
  onPageChange: (page: number) => void
  filters: {
    search: string
    status: string
    category: string
  }
  onFilterChange: (filters: any) => void
}

const categories = [
  'All Categories',
  'Casual Wear',
  'Formal Wear',
  'Party Wear',
  'Traditional Wear',
  'Sportswear',
  'Beachwear',
  'Streetwear',
  'Red Carpet',
  'Airport Look',
  'Ethnic Wear',
  'Western Wear',
  'Fusion Wear',
  'Other',
]

export default function OutfitList({
  outfits,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  filters,
  onFilterChange,
}: OutfitListProps) {
  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Filters */}
      <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <label className='block text-xs sm:text-sm font-medium text-black dark:text-white mb-2'>
              Search
            </label>
            <div className='relative'>
              <Icon
                icon='mdi:magnify'
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                width='20'
                height='20'
              />
              <input
                type='text'
                value={filters.search}
                onChange={(e) =>
                  onFilterChange({ ...filters, search: e.target.value })
                }
                placeholder='Search outfits...'
                className='w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs sm:text-sm font-medium text-black dark:text-white mb-2'>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Status</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
              <option value='scheduled'>Scheduled</option>
            </select>
          </div>

          <div>
            <label className='block text-xs sm:text-sm font-medium text-black dark:text-white mb-2'>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ ...filters, category: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-end'>
            <button
              onClick={() =>
                onFilterChange({ search: '', status: '', category: '' })
              }
              className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm'
            >
              <Icon icon='mdi:filter-off' width='16' height='16' className='inline mr-2' />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Outfits List */}
      <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden'>
        {outfits.length === 0 ? (
          <div className='text-center py-12 sm:py-16'>
            <Icon
              icon='mdi:tshirt-crew'
              width='64'
              height='64'
              className='mx-auto text-gray-300 dark:text-gray-700 mb-4'
            />
            <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base'>
              No outfits found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden lg:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Outfit
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Celebrity
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Category
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Event
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Stats
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                  {outfits.map((outfit) => (
                    <tr
                      key={outfit._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          {outfit.images && outfit.images[0] && (
                            <img
                              src={outfit.images[0]}
                              alt={outfit.title}
                              className='w-12 h-12 rounded-lg object-cover'
                            />
                          )}
                          <div>
                            <p className='font-semibold text-black dark:text-white line-clamp-1'>
                              {outfit.title}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {outfit.designer}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                          {typeof outfit.celebrity === 'object'
                            ? outfit.celebrity.name
                            : 'N/A'}
                        </p>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full'>
                          {outfit.category}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                          {outfit.event}
                        </p>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            outfit.status === 'published'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : outfit.status === 'draft'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {outfit.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center gap-1'>
                            <Icon icon='mdi:eye' width='14' height='14' />
                            <span>{outfit.viewCount || 0}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Icon icon='mdi:heart' width='14' height='14' />
                            <span>{outfit.likesCount || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => onEdit(outfit)}
                            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <Icon icon='mdi:pencil' width='18' height='18' />
                          </button>
                          <button
                            onClick={() => onDelete(outfit._id)}
                            className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'
                            title='Delete'
                          >
                            <Icon icon='mdi:delete' width='18' height='18' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='lg:hidden divide-y divide-gray-200 dark:divide-gray-800'>
              {outfits.map((outfit) => (
                <div
                  key={outfit._id}
                  className='p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
                >
                  <div className='flex gap-3 mb-3'>
                    {outfit.images && outfit.images[0] && (
                      <img
                        src={outfit.images[0]}
                        alt={outfit.title}
                        className='w-20 h-20 rounded-lg object-cover flex-shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-black dark:text-white mb-1 line-clamp-2'>
                        {outfit.title}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        {outfit.designer}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            outfit.status === 'published'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : outfit.status === 'draft'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {outfit.status}
                        </span>
                        <span className='px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full'>
                          {outfit.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center gap-1'>
                        <Icon icon='mdi:eye' width='14' height='14' />
                        <span>{outfit.viewCount || 0}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Icon icon='mdi:heart' width='14' height='14' />
                        <span>{outfit.likesCount || 0}</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => onEdit(outfit)}
                        className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'
                      >
                        <Icon icon='mdi:pencil' width='18' height='18' />
                      </button>
                      <button
                        onClick={() => onDelete(outfit._id)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'
                      >
                        <Icon icon='mdi:delete' width='18' height='18' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className='p-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <Icon icon='mdi:chevron-left' width='20' height='20' />
            </button>
            <span className='px-4 py-2 text-sm font-medium text-black dark:text-white'>
              {pagination.page}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className='p-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <Icon icon='mdi:chevron-right' width='20' height='20' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
