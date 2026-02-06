'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieReviewForm from './MovieReviewForm'

export default function ReviewsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    avgRating: 0,
    totalViews: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    search: '',
    minRating: '',
    featured: '',
  })
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [pagination.page, filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.featured && { featured: filters.featured }),
        sortBy: 'publishDate',
        sortOrder: 'desc',
      })

      const response = await axios.get(`/api/superadmin/reviews?${params}`)
      if (response.data.success) {
        setReviews(response.data.data)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedReview(null)
    setView('create')
  }

  const handleEdit = (review: any) => {
    setSelectedReview(review)
    setView('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await axios.delete(`/api/superadmin/reviews/${id}`)
      if (response.data.success) {
        fetchReviews()
        alert('Review deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (view === 'edit' && selectedReview) {
        const response = await axios.put(
          `/api/superadmin/reviews/${(selectedReview as any)._id}`,
          data
        )
        if (response.data.success) {
          alert('Review updated successfully')
          setView('list')
          fetchReviews()
        }
      } else {
        const response = await axios.post('/api/superadmin/reviews', data)
        if (response.data.success) {
          alert('Review created successfully')
          setView('list')
          fetchReviews()
        }
      }
    } catch (error: any) {
      console.error('Error saving review:', error)
      alert(error.response?.data?.error || 'Failed to save review')
    }
  }

  const handleCancel = () => {
    setSelectedReview(null)
    setView('list')
  }

  if (view === 'create' || view === 'edit') {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <MovieReviewForm
          review={selectedReview}
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
              Movie Reviews & Ratings
            </h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
              Manage movie reviews, ratings, and user feedback
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Add Review</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3'>
          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Reviews
              </p>
              <Icon
                icon='mdi:star-box'
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
                Avg Rating
              </p>
              <Icon
                icon='mdi:chart-line'
                className='text-green-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.avgRating.toFixed(1)}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Views
              </p>
              <Icon
                icon='mdi:eye'
                className='text-purple-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.totalViews.toLocaleString()}
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
                placeholder='Search reviews...'
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
              />
            </div>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
              className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Ratings</option>
              <option value='8'>8+ Stars</option>
              <option value='6'>6+ Stars</option>
              <option value='4'>4+ Stars</option>
            </select>
            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Reviews</option>
              <option value='true'>Featured Only</option>
              <option value='false'>Non-Featured</option>
            </select>
            <button
              onClick={fetchReviews}
              className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm'
            >
              <Icon icon='mdi:refresh' width='18' height='18' />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
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
          ) : reviews.length === 0 ? (
            <div className='text-center p-8'>
              <Icon
                icon='mdi:star-box-outline'
                className='mx-auto text-gray-400 mb-4'
                width='64'
                height='64'
              />
              <p className='text-gray-600 dark:text-gray-400'>
                No reviews found
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Movie
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Author
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Rating
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Views
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Published
                    </th>
                    <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                  {reviews.map((review: any) => (
                    <tr
                      key={review._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={review.poster}
                            alt={review.movieTitle}
                            className='w-12 h-16 object-cover rounded-lg'
                          />
                          <div>
                            <p className='font-medium text-black dark:text-white line-clamp-1'>
                              {review.movieTitle}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                              {review.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-2'>
                          <img
                            src={review.author.avatar}
                            alt={review.author.name}
                            className='w-8 h-8 rounded-full object-cover'
                          />
                          <div>
                            <p className='text-sm font-medium text-black dark:text-white'>
                              {review.author.name}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              {review.author.credentials}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-1'>
                          <Icon
                            icon='mdi:star'
                            className='text-yellow-500'
                            width='16'
                            height='16'
                          />
                          <span className='text-sm font-bold text-black dark:text-white'>
                            {review.rating.toFixed(1)}
                          </span>
                          <span className='text-xs text-gray-500'>/10</span>
                        </div>
                        {review.featured && (
                          <span className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'>
                            <Icon icon='mdi:star' width='12' height='12' />
                            Featured
                          </span>
                        )}
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {review.stats?.views?.toLocaleString() || 0}
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {new Date(review.publishDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(review)}
                            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <Icon icon='mdi:pencil' width='18' height='18' />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
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
