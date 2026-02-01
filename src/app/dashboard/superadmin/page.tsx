'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

const stats = [
  {
    icon: 'mdi:account-group',
    label: 'Total Users',
    value: '1,245',
    change: '+12%',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    icon: 'mdi:shield-account',
    label: 'Admins',
    value: '8',
    change: '+1',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
  },
  {
    icon: 'mdi:folder-multiple',
    label: 'Content Items',
    value: '2,458',
    change: '+156',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    icon: 'mdi:server',
    label: 'System Health',
    value: '98.5%',
    change: 'Excellent',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/10',
  },
]

const systemActivity = [
  {
    icon: 'mdi:account-plus',
    action: 'New admin created',
    user: 'SuperAdmin',
    time: '2 hours ago',
    type: 'admin',
  },
  {
    icon: 'mdi:database',
    action: 'Database backup completed',
    user: 'System',
    time: '4 hours ago',
    type: 'system',
  },
  {
    icon: 'mdi:shield-alert',
    action: 'Security scan completed',
    user: 'System',
    time: '6 hours ago',
    type: 'security',
  },
  {
    icon: 'mdi:update',
    action: 'System update available',
    user: 'System',
    time: '1 day ago',
    type: 'update',
  },
]

const roleDistribution = [
  { role: 'Users', count: 1235, percentage: 99.2 },
  { role: 'Admins', count: 8, percentage: 0.6 },
  { role: 'Superadmin', count: 1, percentage: 0.1 },
]

export default function SuperadminDashboard() {
  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Superadmin Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Complete system control and oversight.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                  <Icon
                    icon={stat.icon}
                    width='24'
                    height='24'
                    className={stat.color}
                  />
                </div>
                <span className='text-green-500 text-sm font-medium'>
                  {stat.change}
                </span>
              </div>
              <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
                {stat.label}
              </p>
              <p className='text-2xl font-bold text-black dark:text-white'>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* System Activity */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-black dark:text-white'>
                System Activity
              </h2>
              <button className='text-primary hover:text-primary/80 text-sm font-medium'>
                View All
              </button>
            </div>
            <div className='space-y-4'>
              {systemActivity.map((activity, index) => (
                <div
                  key={index}
                  className='flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                  <div
                    className={`p-2 rounded-xl ${
                      activity.type === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-900/20'
                        : activity.type === 'security'
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : activity.type === 'update'
                            ? 'bg-blue-100 dark:bg-blue-900/20'
                            : 'bg-green-100 dark:bg-green-900/20'
                    }`}>
                    <Icon
                      icon={activity.icon}
                      width='20'
                      height='20'
                      className={
                        activity.type === 'admin'
                          ? 'text-purple-500'
                          : activity.type === 'security'
                            ? 'text-red-500'
                            : activity.type === 'update'
                              ? 'text-blue-500'
                              : 'text-green-500'
                      }
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='text-black dark:text-white font-medium'>
                      {activity.action}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-gray-500 dark:text-gray-400 text-xs'>
                        by {activity.user}
                      </span>
                      <span className='text-gray-400'>•</span>
                      <span className='text-gray-500 dark:text-gray-400 text-xs'>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Distribution */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              User Role Distribution
            </h2>
            <div className='space-y-4'>
              {roleDistribution.map((item) => (
                <div key={item.role}>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-black dark:text-white font-medium'>
                      {item.role}
                    </span>
                    <span className='text-gray-600 dark:text-gray-400 text-sm'>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                    <div
                      className='bg-primary h-2 rounded-full'
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900'>
              <p className='text-black dark:text-white font-medium mb-2'>
                Total Registered
              </p>
              <p className='text-3xl font-bold text-primary'>1,244</p>
              <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
                +12% from last month
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
            System Status
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center gap-3 mb-3'>
                <Icon
                  icon='mdi:database'
                  width='24'
                  height='24'
                  className='text-green-500'
                />
                <span className='text-black dark:text-white font-medium'>
                  Database
                </span>
              </div>
              <p className='text-2xl font-bold text-green-500 mb-1'>
                Healthy
              </p>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>
                Last backup: 4 hours ago
              </p>
            </div>

            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center gap-3 mb-3'>
                <Icon
                  icon='mdi:server'
                  width='24'
                  height='24'
                  className='text-blue-500'
                />
                <span className='text-black dark:text-white font-medium'>
                  Server
                </span>
              </div>
              <p className='text-2xl font-bold text-blue-500 mb-1'>Online</p>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>
                Uptime: 99.9%
              </p>
            </div>

            <div className='p-4 rounded-2xl border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center gap-3 mb-3'>
                <Icon
                  icon='mdi:shield-check'
                  width='24'
                  height='24'
                  className='text-green-500'
                />
                <span className='text-black dark:text-white font-medium'>
                  Security
                </span>
              </div>
              <p className='text-2xl font-bold text-green-500 mb-1'>Secure</p>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>
                Last scan: 6 hours ago
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:shield-account-plus'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>Create Admin</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:database-refresh'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>Backup Database</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:file-document'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>View Logs</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:cog'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>System Config</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
