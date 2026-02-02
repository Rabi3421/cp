'use client'

import { Icon } from '@iconify/react'
import Image from 'next/image'

interface CelebrityListProps {
  celebrities: any[]
  loading: boolean
  onEdit: (celebrity: any) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function CelebrityList({
  celebrities,
  loading,
  onEdit,
  onDelete,
  onRefresh,
}: CelebrityListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className='bg-white dark:bg-black rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      </div>
    )
  }

  if (celebrities.length === 0) {
    return (
      <div className='bg-white dark:bg-black rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-gray-800 text-center'>
        <Icon
          icon='mdi:account-off'
          width='64'
          height='64'
          className='mx-auto mb-4 text-gray-400'
        />
        <h3 className='text-xl font-bold text-black dark:text-white mb-2'>
          No Celebrities Found
        </h3>
        <p className='text-gray-600 dark:text-gray-400'>
          Start by creating your first celebrity profile
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
      {/* Desktop Table View */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
            <tr>
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Celebrity
              </th>
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Categories
              </th>
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Stats
              </th>
              <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Updated
              </th>
              <th className='px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
            {celebrities.map((celebrity) => (
              <tr
                key={celebrity._id}
                className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-3'>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0'>
                      {celebrity.profileImage ? (
                        <img
                          src={celebrity.profileImage}
                          alt={celebrity.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <Icon
                          icon='mdi:account'
                          className='w-full h-full text-gray-400'
                        />
                      )}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium text-black dark:text-white truncate'>
                          {celebrity.name}
                        </p>
                        {celebrity.isVerified && (
                          <Icon
                            icon='mdi:check-decagram'
                            className='text-blue-500 flex-shrink-0'
                            width='16'
                            height='16'
                          />
                        )}
                        {celebrity.isFeatured && (
                          <Icon
                            icon='mdi:star'
                            className='text-yellow-500 flex-shrink-0'
                            width='16'
                            height='16'
                          />
                        )}
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {celebrity.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-wrap gap-1'>
                    {celebrity.categories?.slice(0, 2).map((cat: string, idx: number) => (
                      <span
                        key={idx}
                        className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      >
                        {cat}
                      </span>
                    ))}
                    {celebrity.categories?.length > 2 && (
                      <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'>
                        +{celebrity.categories.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      celebrity.status
                    )}`}
                  >
                    {celebrity.status}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                    <div className='flex items-center gap-1'>
                      <Icon icon='mdi:eye' width='14' height='14' />
                      <span>{celebrity.viewCount || 0}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Icon icon='mdi:share' width='14' height='14' />
                      <span>{celebrity.shareCount || 0}</span>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(celebrity.updatedAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <button
                      onClick={() => onEdit(celebrity)}
                      className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                      title='Edit'
                    >
                      <Icon icon='mdi:pencil' width='18' height='18' />
                    </button>
                    <button
                      onClick={() => onDelete(celebrity._id)}
                      className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
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
      <div className='md:hidden divide-y divide-gray-200 dark:divide-gray-800'>
        {celebrities.map((celebrity) => (
          <div key={celebrity._id} className='p-4'>
            <div className='flex items-start gap-3 mb-3'>
              <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0'>
                {celebrity.profileImage ? (
                  <img
                    src={celebrity.profileImage}
                    alt={celebrity.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <Icon
                    icon='mdi:account'
                    className='w-full h-full text-gray-400'
                  />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='text-sm font-semibold text-black dark:text-white truncate'>
                    {celebrity.name}
                  </h3>
                  {celebrity.isVerified && (
                    <Icon
                      icon='mdi:check-decagram'
                      className='text-blue-500 flex-shrink-0'
                      width='16'
                      height='16'
                    />
                  )}
                  {celebrity.isFeatured && (
                    <Icon
                      icon='mdi:star'
                      className='text-yellow-500 flex-shrink-0'
                      width='16'
                      height='16'
                    />
                  )}
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
                  {celebrity.slug}
                </p>
                <div className='flex items-center gap-2 mb-2'>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      celebrity.status
                    )}`}
                  >
                    {celebrity.status}
                  </span>
                  {celebrity.categories?.slice(0, 1).map((cat: string, idx: number) => (
                    <span
                      key={idx}
                      className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                  <div className='flex items-center gap-1'>
                    <Icon icon='mdi:eye' width='14' height='14' />
                    <span>{celebrity.viewCount || 0}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Icon icon='mdi:share' width='14' height='14' />
                    <span>{celebrity.shareCount || 0}</span>
                  </div>
                  <span>{new Date(celebrity.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => onEdit(celebrity)}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm'
              >
                <Icon icon='mdi:pencil' width='16' height='16' />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(celebrity._id)}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm'
              >
                <Icon icon='mdi:delete' width='16' height='16' />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
