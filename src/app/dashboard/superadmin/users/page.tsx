'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'superadmin'
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

export default function SuperadminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    inactive: 0,
  })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  })

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, searchQuery, roleFilter, activeFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (activeFilter !== 'all') params.append('isActive', activeFilter === 'active' ? 'true' : 'false')

      const response = await fetch(`/api/superadmin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data.users)
        setPagination(data.data.pagination)
        
        // Calculate stats
        const totalUsers = data.data.pagination.total
        const activeUsers = data.data.users.filter((u: User) => u.isActive).length
        const adminUsers = data.data.users.filter((u: User) => u.role === 'admin').length
        const inactiveUsers = data.data.users.filter((u: User) => !u.isActive).length
        
        setStats({
          total: totalUsers,
          active: activeUsers,
          admins: adminUsers,
          inactive: inactiveUsers,
        })
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill all fields')
      return
    }

    if (newUser.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (response.ok) {
        fetchUsers()
        setShowCreateModal(false)
        setNewUser({ name: '', email: '', password: '', role: 'user' })
        alert('User created successfully')
      } else {
        alert(data.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
        setShowEditModal(false)
        setEditingUser(null)
        alert('User updated successfully')
      } else {
        alert(data.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
        alert('User deleted successfully')
      } else {
        alert(data.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  const handleToggleActive = async (user: User) => {
    await handleUpdateUser(user._id, { isActive: !user.isActive })
  }

  const handleRoleChange = async (user: User, newRole: 'user' | 'admin') => {
    if (newRole === user.role) return
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return
    await handleUpdateUser(user._id, { role: newRole })
  }

  const filteredUsers = users

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              All Users
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage all users with full role control.
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
            <Icon icon='mdi:account-plus' width='20' height='20' />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6'>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Total Users
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              {stats.total}
            </p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Active
            </p>
            <p className='text-2xl font-bold text-green-500'>{stats.active}</p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Admins
            </p>
            <p className='text-2xl font-bold text-purple-500'>{stats.admins}</p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Inactive
            </p>
            <p className='text-2xl font-bold text-red-500'>{stats.inactive}</p>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800'>
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
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex flex-wrap gap-2 sm:gap-3'>
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  roleFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                All
              </button>
              <button
                onClick={() => setRoleFilter('user')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  roleFilter === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Users
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  roleFilter === 'admin'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Admins
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 dark:bg-gray-900'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        User
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Role
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Join Date
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center gap-3'>
                              <img
                                src={user.avatar || '/images/team/user1.svg'}
                                alt={user.name}
                                className='w-10 h-10 rounded-full object-cover'
                              />
                              <div>
                                <p className='text-black dark:text-white font-medium'>
                                  {user.name}
                                </p>
                                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user, e.target.value as 'user' | 'admin')}
                              className='px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-primary capitalize cursor-pointer'>
                              <option value='user'>User</option>
                              <option value='admin'>Admin</option>
                            </select>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <button
                              onClick={() => handleToggleActive(user)}
                              className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer ${
                                user.isActive
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                                  : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                              }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-sm'>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <button 
                                onClick={() => {
                                  setEditingUser(user)
                                  setShowEditModal(true)
                                }}
                                className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'
                                title='Edit user'>
                                <Icon icon='mdi:pencil' width='18' height='18' />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'
                                title='Delete user'>
                                <Icon icon='mdi:delete' width='18' height='18' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Showing {users.length} of {pagination.total} users
                </p>
                <div className='flex gap-2'>
                  <button 
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
            </>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800'>
              <h3 className='text-xl font-bold text-black dark:text-white mb-4'>Edit User</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Name</label>
                  <input
                    type='text'
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                  <input
                    type='email'
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                  />
                </div>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingUser(null)
                    }}
                    className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'>
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateUser(editingUser._id, { name: editingUser.name, email: editingUser.email })}
                    className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90'>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800'>
              <h3 className='text-xl font-bold text-black dark:text-white mb-4'>Create New User</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Name</label>
                  <input
                    type='text'
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter user name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                  <input
                    type='email'
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter email'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Password</label>
                  <input
                    type='password'
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'
                    placeholder='Enter password (min 6 characters)'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                    className='w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white'>
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>
                <div className='flex gap-3 justify-end'>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setNewUser({ name: '', email: '', password: '', role: 'user' })
                    }}
                    className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'>
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90'>
                    Create User
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
