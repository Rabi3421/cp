'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import OutfitList from './OutfitList'
import OutfitForm from './OutfitForm'

export default function OutfitsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    totalViews: 0,
    totalLikes: 0,
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
  const [selectedOutfit, setSelectedOutfit] = useState(null)

  useEffect(() => {
    fetchOutfits()
  }, [pagination.page, filters])

  const fetchOutfits = async () => {
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

      const response = await axios.get(`/api/superadmin/outfits?${params}`)
      if (response.data.success) {
        setOutfits(response.data.data)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching outfits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedOutfit(null)
    setView('create')
  }

  const handleEdit = (outfit: any) => {
    setSelectedOutfit(outfit)
    setView('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return

    try {
      const response = await axios.delete(`/api/superadmin/outfits/${id}`)
      if (response.data.success) {
        fetchOutfits()
        alert('Outfit deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting outfit:', error)
      alert('Failed to delete outfit')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (view === 'edit' && selectedOutfit) {
        const response = await axios.put(
          `/api/superadmin/outfits/${(selectedOutfit as any)._id}`,
          data
        )
        if (response.data.success) {
          alert('Outfit updated successfully')
          setView('list')
          fetchOutfits()
        }
      } else {
        const response = await axios.post('/api/superadmin/outfits', data)
        if (response.data.success) {
          alert('Outfit created successfully')
          setView('list')
          fetchOutfits()
        }
      }
    } catch (error: any) {
      console.error('Error saving outfit:', error)
      alert(error.response?.data?.error || 'Failed to save outfit')
    }
  }

  const handleCancel = () => {
    setSelectedOutfit(null)
    setView('list')
  }

  if (view === 'create' || view === 'edit') {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <OutfitForm
          outfit={selectedOutfit}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={view === 'edit'}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-4 sm:space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              Celebrity Outfits
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base'>
              Manage celebrity outfit collections
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Add Outfit</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4'>
          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Outfits
              </p>
              <Icon
                icon='mdi:tshirt-crew'
                className='text-blue-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.total}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
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

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
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

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
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

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
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

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Likes
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

        {/* Outfits List */}
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Icon
              icon='mdi:loading'
              className='animate-spin text-blue-600'
              width='48'
              height='48'
            />
          </div>
        ) : (
          <OutfitList
            outfits={outfits}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
