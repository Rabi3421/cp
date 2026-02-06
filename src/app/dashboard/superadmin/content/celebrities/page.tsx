'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CelebrityList from './CelebrityList'
import CelebrityForm from './CelebrityForm'

export default function CelebritiesPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    featured: 0,
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
    status: '',
    category: '',
    sort: '-createdAt',
  })
  const [selectedCelebrity, setSelectedCelebrity] = useState(null)

  useEffect(() => {
    fetchCelebrities()
  }, [pagination.page, filters])

  const fetchCelebrities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        sort: filters.sort,
      })

      const response = await axios.get(`/api/superadmin/celebrities?${params}`)
      if (response.data.success) {
        setCelebrities(response.data.data)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching celebrities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedCelebrity(null)
    setView('create')
  }

  const handleEdit = (celebrity: any) => {
    setSelectedCelebrity(celebrity)
    setView('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this celebrity?')) return

    try {
      const response = await axios.delete(`/api/superadmin/celebrities/${id}`)
      if (response.data.success) {
        fetchCelebrities()
        alert('Celebrity deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting celebrity:', error)
      alert('Failed to delete celebrity')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (view === 'edit' && selectedCelebrity) {
        const response = await axios.put(
          `/api/superadmin/celebrities/${(selectedCelebrity as any)._id}`,
          data
        )
        if (response.data.success) {
          alert('Celebrity updated successfully')
          setView('list')
          fetchCelebrities()
        }
      } else {
        const response = await axios.post('/api/superadmin/celebrities', data)
        if (response.data.success) {
          alert('Celebrity created successfully')
          setView('list')
          fetchCelebrities()
        }
      }
    } catch (error: any) {
      console.error('Error saving celebrity:', error)
      alert(error.response?.data?.error || 'Failed to save celebrity')
    }
  }

  const handleCancel = () => {
    setSelectedCelebrity(null)
    setView('list')
  }

  if (view === 'create' || view === 'edit') {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <CelebrityForm
          celebrity={selectedCelebrity}
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
              Celebrity Profiles
            </h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
              Manage celebrity profiles and information
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Add Celebrity</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3'>
          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Profiles
              </p>
              <Icon
                icon='mdi:account-group'
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
              {stats.totalViews}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3'>
            <div className='lg:col-span-2'>
              <div className='relative'>
                <Icon
                  icon='mdi:magnify'
                  width='20'
                  height='20'
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  placeholder='Search celebrities...'
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Status</option>
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
              <option value='scheduled'>Scheduled</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Categories</option>
              <option value='Actress'>Actress</option>
              <option value='Actor'>Actor</option>
              <option value='Model'>Model</option>
              <option value='Singer'>Singer</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className='px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value='-createdAt'>Newest First</option>
              <option value='createdAt'>Oldest First</option>
              <option value='name'>Name (A-Z)</option>
              <option value='-name'>Name (Z-A)</option>
              <option value='-viewCount'>Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Celebrity List */}
        <CelebrityList
          celebrities={celebrities}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchCelebrities}
        />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className='flex items-center justify-between bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
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
                className='px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm'
              >
                Previous
              </button>
              <span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className='px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm'
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
