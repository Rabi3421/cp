'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: '/images/team/user1.svg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-14',
    avatar: '/images/team/user2.svg',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2024-01-13',
    avatar: '/images/team/user3.svg',
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <DashboardLayout requiredRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              Users Management
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage all registered users and their permissions.
            </p>
          </div>
          <button className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
            <Icon icon='mdi:account-plus' width='20' height='20' />
            <span>Add User</span>
          </button>
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
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex gap-3'>
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={user.avatar}
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
                      <span className='px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-sm'>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'>
                          <Icon icon='mdi:pencil' width='18' height='18' />
                        </button>
                        <button className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'>
                          <Icon icon='mdi:delete' width='18' height='18' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <div className='flex gap-2'>
              <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                Previous
              </button>
              <button className='px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors'>
                1
              </button>
              <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                2
              </button>
              <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
