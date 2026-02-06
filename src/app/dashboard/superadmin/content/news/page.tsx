'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsForm from './NewsForm'

export default function NewsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    sort: '-createdAt',
  })
  const [selectedNews, setSelectedNews] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [pagination.page, filters])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })

      const response = await axios.get(`/api/superadmin/news?${params}`)
      if (response.data.success) {
        setNews(response.data.data)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedNews(null)
    setView('create')
  }

  const handleEdit = (newsItem: any) => {
    setSelectedNews(newsItem)
    setView('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return

    try {
      const response = await axios.delete(`/api/superadmin/news/${id}`)
      if (response.data.success) {
        fetchNews()
        alert('News article deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Failed to delete news article')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (view === 'edit' && selectedNews) {
        const response = await axios.put(
          `/api/superadmin/news/${(selectedNews as any)._id}`,
          data
        )
        if (response.data.success) {
          alert('News article updated successfully')
          setView('list')
          fetchNews()
        }
      } else {
        const response = await axios.post('/api/superadmin/news', data)
        if (response.data.success) {
          alert('News article created successfully')
          setView('list')
          fetchNews()
        }
      }
    } catch (error: any) {
      console.error('Error saving news:', error)
      alert(error.response?.data?.error || 'Failed to save news article')
    }
  }

  const handleCancel = () => {
    setSelectedNews(null)
    setView('list')
  }

  if (view === 'create' || view === 'edit') {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <NewsForm
          news={selectedNews}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={view === 'edit'}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-1 sm:space-y-2 mt-0 -mt-4 sm:-mt-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 py-0'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:gap-3'>
            <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              Celebrity News
            </h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
              Manage celebrity news articles and updates
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Add News</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3'>
          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total News
              </p>
              <Icon
                icon='mdi:newspaper'
                className='text-blue-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.total}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Published
              </p>
              <Icon
                icon='mdi:check-circle'
                className='text-green-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.published}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Draft
              </p>
              <Icon
                icon='mdi:file-document-edit'
                className='text-gray-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.draft}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Featured
              </p>
              <Icon
                icon='mdi:star'
                className='text-yellow-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.featured}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Views
              </p>
              <Icon
                icon='mdi:eye'
                className='text-purple-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.totalViews}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Likes
              </p>
              <Icon
                icon='mdi:heart'
                className='text-red-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.totalLikes}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white dark:bg-black rounded-2xl shadow-xl p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
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
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Status</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
              <option value='scheduled'>Scheduled</option>
            </select>
            <button
              onClick={fetchNews}
              className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm'
            >
              <Icon icon='mdi:refresh' width='18' height='18' />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* News List */}
        <div className='bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Icon
                icon='mdi:loading'
                className='animate-spin text-blue-600'
                width='32'
                height='32'
              />
            </div>
          ) : news.length === 0 ? (
            <div className='text-center p-8'>
              <Icon
                icon='mdi:newspaper-variant-outline'
                className='mx-auto text-gray-400 mb-4'
                width='64'
                height='64'
              />
              <p className='text-gray-600 dark:text-gray-400'>
                No news articles found
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Article
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Author
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Stats
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                  {news.map((item: any) => (
                    <tr
                      key={item._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className='w-16 h-16 object-cover rounded-lg'
                          />
                          <div>
                            <p className='font-medium text-black dark:text-white line-clamp-1'>
                              {item.title}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                              {item.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {item.author}
                      </td>
                      <td className='px-4 py-4'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : item.status === 'draft'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.featured && (
                          <Icon
                            icon='mdi:star'
                            className='inline ml-2 text-yellow-500'
                            width='16'
                            height='16'
                          />
                        )}
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400'>
                          <span className='flex items-center gap-1'>
                            <Icon icon='mdi:eye' width='14' height='14' />
                            {item.viewCount || 0}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Icon icon='mdi:heart' width='14' height='14' />
                            {item.likesCount || 0}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Icon icon='mdi:comment' width='14' height='14' />
                            {item.commentsCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {new Date(item.publishDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(item)}
                            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <Icon icon='mdi:pencil' width='18' height='18' />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
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
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className='px-3 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              >
                Previous
              </button>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className='px-3 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
