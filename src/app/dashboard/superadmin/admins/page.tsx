'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'

interface Admin {
  _id: string
  name: string
  email: string
  role: 'admin'
  isActive: boolean
  avatar?: string
  createdAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    fetchAdmins()
  }, [pagination.page, searchQuery, activeFilter])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchQuery) params.append('search', searchQuery)
      if (activeFilter !== 'all') params.append('isActive', activeFilter === 'active' ? 'true' : 'false')

      const response = await fetch(`/api/superadmin/admins?${params}`)
      const data = await response.json()

      if (data.success) {
        setAdmins(data.data.admins)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Please fill all fields')
      return
    }

    try {
      const response = await fetch('/api/superadmin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newAdmin),
      })

      const data = await response.json()

      if (data.success) {
        fetchAdmins()
        setShowCreateModal(false)
        setNewAdmin({ name: '', email: '', password: '' })
        alert('Admin created successfully')
      } else {
        console.error('Create admin error:', data)
        alert(data.message || 'Failed to create admin')
      }
    } catch (error) {
      console.error('Failed to create admin:', error)
      alert('Failed to create admin')
    }
  }

  const handleUpdateAdmin = async (adminId: string, updates: Partial<Admin>) => {
    try {
      const response = await fetch(`/api/superadmin/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (data.success) {
        fetchAdmins()
        setShowEditModal(false)
        setEditingAdmin(null)
        alert('Admin updated successfully')
      } else {
        alert(data.message || 'Failed to update admin')
      }
    } catch (error) {
      console.error('Failed to update admin:', error)
      alert('Failed to update admin')
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    try {
      const response = await fetch(`/api/superadmin/admins/${adminId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchAdmins()
        alert('Admin deleted successfully')
      } else {
        alert(data.message || 'Failed to delete admin')
      }
    } catch (error) {
      console.error('Failed to delete admin:', error)
      alert('Failed to delete admin')
    }
  }

  const handleToggleActive = async (admin: Admin) => {
    await handleUpdateAdmin(admin._id, { isActive: !admin.isActive })
  }

  const activeAdmins = admins.filter(a => a.isActive).length
  const inactiveAdmins = admins.filter(a => !a.isActive).length

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              Admin Management
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage admin users and their permissions.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
            <Icon icon='mdi:shield-account-plus' width='20' height='20' />
            <span>Add Admin</span>
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-purple-50 dark:bg-purple-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:shield-account'
                  width='24'
                  height='24'
                  className='text-purple-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Total Admins
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {pagination.total}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:check-circle'
                  width='24'
                  height='24'
                  className='text-green-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Active
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {activeAdmins}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:close-circle'
                  width='24'
                  height='24'
                  className='text-red-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Inactive
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  {inactiveAdmins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Icon
                  icon='mdi:magnify'
                  width='20'
                  height='20'
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                />
                <input
                  type='text'
                  placeholder='Search admins...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                All
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Active
              </button>
              <button
                onClick={() => setActiveFilter('inactive')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeFilter === 'inactive'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          ) : (
            <>
              <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
                <h2 className='text-xl font-bold text-black dark:text-white'>
                  Current Admins ({admins.length})
                </h2>
              </div>
              <div className='divide-y divide-gray-200 dark:divide-gray-800'>
                {admins.length === 0 ? (
                  <div className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                    No admins found
                  </div>
                ) : (
                  admins.map((admin) => (
                    <div
                      key={admin._id}
                      className='p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4'>
                          <img
                            src={admin.avatar || '/images/team/user1.svg'}
                            alt={admin.name}
                            className='w-16 h-16 rounded-full object-cover'
                          />
                          <div>
                            <div className='flex items-center gap-2 mb-1'>
                              <h3 className='text-lg font-bold text-black dark:text-white'>
                                {admin.name}
                              </h3>
                              <button
                                onClick={() => handleToggleActive(admin)}
                                className={`px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer ${
                                  admin.isActive
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                                }`}>
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </div>
                            <p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
                              {admin.email}
                            </p>
                            <div className='flex items-center gap-4 text-sm'>
                              <span className='text-gray-500 dark:text-gray-400'>
                                Joined: {new Date(admin.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => {
                              setEditingAdmin(admin)
                              setShowEditModal(true)
                            }}
                            className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'
                            title='Edit admin'>
                            <Icon icon='mdi:pencil' width='20' height='20' />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'
                            title='Delete admin'>
                            <Icon icon='mdi:delete' width='20' height='20' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pagination.page === page
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                        }`}>
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800'>
              <h3 className='text-xl font-bold text-black dark:text-white mb-4'>Create New Admin</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Name</label>
                  <input
                    type='text'
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter admin name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                  <input
                    type='email'
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter email'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
                  <input
                    type='password'
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter password (min 6 characters)'
                  />
                </div>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewAdmin({ name: '', email: '', password: '' })
                    }}
                    className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'>
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAdmin}
                    className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90'>
                    Create Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditModal && editingAdmin && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800'>
              <h3 className='text-xl font-bold text-black dark:text-white mb-4'>Edit Admin</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Name</label>
                  <input
                    type='text'
                    value={editingAdmin.name}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                  <input
                    type='email'
                    value={editingAdmin.email}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                  />
                </div>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingAdmin(null)
                    }}
                    className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'>
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateAdmin(editingAdmin._id, { name: editingAdmin.name, email: editingAdmin.email })}
                    className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90'>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
