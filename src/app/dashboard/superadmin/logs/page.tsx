'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

const logs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    level: 'info',
    user: 'admin@example.com',
    action: 'User login',
    details: 'Successful login from IP 192.168.1.1',
    icon: 'mdi:login',
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:25:10',
    level: 'warning',
    user: 'system',
    action: 'High memory usage',
    details: 'Memory usage exceeded 80%',
    icon: 'mdi:alert',
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:20:05',
    level: 'error',
    user: 'user@example.com',
    action: 'Failed login attempt',
    details: 'Invalid credentials - 3rd attempt',
    icon: 'mdi:alert-circle',
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:15:00',
    level: 'info',
    user: 'admin@example.com',
    action: 'Database backup',
    details: 'Scheduled backup completed successfully',
    icon: 'mdi:database',
  },
  {
    id: 5,
    timestamp: '2024-01-15 14:10:45',
    level: 'success',
    user: 'system',
    action: 'Security scan',
    details: 'No vulnerabilities detected',
    icon: 'mdi:shield-check',
  },
]

export default function LogsPage() {
  const [levelFilter, setLevelFilter] = useState<
    'all' | 'info' | 'warning' | 'error' | 'success'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLevel && matchesSearch
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'warning':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'success':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    }
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-black dark:text-white'>
              System Logs
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Monitor system activity and track events.
            </p>
          </div>
          <div className='flex gap-2'>
            <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
              <Icon icon='mdi:download' width='20' height='20' />
              <span>Export</span>
            </button>
            <button className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
              <Icon icon='mdi:refresh' width='20' height='20' />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Total Logs
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              {logs.length}
            </p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Info
            </p>
            <p className='text-2xl font-bold text-blue-500'>
              {logs.filter((l) => l.level === 'info').length}
            </p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Success
            </p>
            <p className='text-2xl font-bold text-green-500'>
              {logs.filter((l) => l.level === 'success').length}
            </p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Warnings
            </p>
            <p className='text-2xl font-bold text-yellow-500'>
              {logs.filter((l) => l.level === 'warning').length}
            </p>
          </div>
          <div className='bg-white dark:bg-black rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-800'>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Errors
            </p>
            <p className='text-2xl font-bold text-red-500'>
              {logs.filter((l) => l.level === 'error').length}
            </p>
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
                  placeholder='Search logs...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setLevelFilter('all')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  levelFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                All
              </button>
              <button
                onClick={() => setLevelFilter('info')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  levelFilter === 'info'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Info
              </button>
              <button
                onClick={() => setLevelFilter('success')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  levelFilter === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Success
              </button>
              <button
                onClick={() => setLevelFilter('warning')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  levelFilter === 'warning'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Warning
              </button>
              <button
                onClick={() => setLevelFilter('error')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  levelFilter === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                }`}>
                Error
              </button>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          <div className='divide-y divide-gray-200 dark:divide-gray-800'>
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className='p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-start gap-4'>
                  <div className={`p-3 rounded-2xl ${getLevelColor(log.level)}`}>
                    <Icon icon={log.icon} width='24' height='24' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h3 className='text-lg font-bold text-black dark:text-white'>
                          {log.action}
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>
                          {log.details}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                      <span className='flex items-center gap-1'>
                        <Icon icon='mdi:clock' width='16' height='16' />
                        {log.timestamp}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Icon icon='mdi:account' width='16' height='16' />
                        {log.user}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Showing {filteredLogs.length} of {logs.length} logs
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
