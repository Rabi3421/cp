'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

const admins = [
  {
    id: 1,
    name: 'Admin User 1',
    email: 'admin1@celebritypersona.com',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-10',
    avatar: '/images/team/user1.svg',
    lastActive: '2 hours ago',
    permissions: ['users', 'content', 'analytics'],
  },
  {
    id: 2,
    name: 'Admin User 2',
    email: 'admin2@celebritypersona.com',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-12',
    avatar: '/images/team/user2.svg',
    lastActive: '1 day ago',
    permissions: ['users', 'content'],
  },
]

export default function AdminsPage() {
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
          <button className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
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
                  8
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
                  7
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-4'>
              <div className='bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:clock'
                  width='24'
                  height='24'
                  className='text-blue-500'
                />
              </div>
              <div>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Online Now
                </p>
                <p className='text-2xl font-bold text-black dark:text-white'>
                  3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white'>
              Current Admins
            </h2>
          </div>
          <div className='divide-y divide-gray-200 dark:divide-gray-800'>
            {admins.map((admin) => (
              <div
                key={admin.id}
                className='p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-4'>
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className='w-16 h-16 rounded-full object-cover'
                    />
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='text-lg font-bold text-black dark:text-white'>
                          {admin.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            admin.status === 'active'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-900'
                          }`}>
                          {admin.status}
                        </span>
                      </div>
                      <p className='text-gray-600 dark:text-gray-400 text-sm mb-2'>
                        {admin.email}
                      </p>
                      <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <Icon icon='mdi:calendar' width='16' height='16' />
                          Joined{' '}
                          {new Date(admin.joinDate).toLocaleDateString()}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Icon icon='mdi:clock' width='16' height='16' />
                          Active {admin.lastActive}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 mt-3'>
                        <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                          Permissions:
                        </span>
                        {admin.permissions.map((perm) => (
                          <span
                            key={perm}
                            className='px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize'>
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <button className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors'>
                      <Icon icon='mdi:pencil' width='20' height='20' />
                    </button>
                    <button className='p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-lg transition-colors'>
                      <Icon icon='mdi:key' width='20' height='20' />
                    </button>
                    <button className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors'>
                      <Icon icon='mdi:account-remove' width='20' height='20' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Templates */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
            Permission Templates
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <h3 className='font-bold text-black dark:text-white mb-2'>
                Content Manager
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm mb-3'>
                Manage all content types
              </p>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>Content CRUD</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>Media Upload</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:close'
                    width='16'
                    height='16'
                    className='text-red-500'
                  />
                  <span>User Management</span>
                </div>
              </div>
            </div>

            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <h3 className='font-bold text-black dark:text-white mb-2'>
                User Manager
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm mb-3'>
                Manage users and permissions
              </p>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>User CRUD</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>Role Assignment</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:close'
                    width='16'
                    height='16'
                    className='text-red-500'
                  />
                  <span>System Settings</span>
                </div>
              </div>
            </div>

            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <h3 className='font-bold text-black dark:text-white mb-2'>
                Full Admin
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm mb-3'>
                All permissions except superadmin
              </p>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>All Content</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>All Users</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                  <Icon
                    icon='mdi:check'
                    width='16'
                    height='16'
                    className='text-green-500'
                  />
                  <span>Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
