'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

export default function SystemPage() {
  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            System Configuration
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage system settings and configurations.
          </p>
        </div>

        {/* System Status */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon
                icon='mdi:server'
                width='24'
                height='24'
                className='text-blue-500'
              />
              <h3 className='font-bold text-black dark:text-white'>Server</h3>
            </div>
            <p className='text-2xl font-bold text-green-500 mb-1'>Online</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Uptime: 99.9%
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon
                icon='mdi:database'
                width='24'
                height='24'
                className='text-green-500'
              />
              <h3 className='font-bold text-black dark:text-white'>
                Database
              </h3>
            </div>
            <p className='text-2xl font-bold text-green-500 mb-1'>Healthy</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Size: 2.4 GB
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon
                icon='mdi:memory'
                width='24'
                height='24'
                className='text-yellow-500'
              />
              <h3 className='font-bold text-black dark:text-white'>Memory</h3>
            </div>
            <p className='text-2xl font-bold text-yellow-500 mb-1'>64%</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              6.4 / 10 GB
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-3'>
              <Icon
                icon='mdi:harddisk'
                width='24'
                height='24'
                className='text-purple-500'
              />
              <h3 className='font-bold text-black dark:text-white'>Storage</h3>
            </div>
            <p className='text-2xl font-bold text-purple-500 mb-1'>42%</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              42 / 100 GB
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Database Management */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Database Management
            </h2>
            <div className='space-y-4'>
              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:database-refresh'
                    width='20'
                    height='20'
                    className='text-blue-500'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Backup Database
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Last backup: 4 hours ago
                    </p>
                  </div>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </button>

              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:database-import'
                    width='20'
                    height='20'
                    className='text-green-500'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Restore Database
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Restore from backup
                    </p>
                  </div>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </button>

              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:database-settings'
                    width='20'
                    height='20'
                    className='text-purple-500'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Optimize Database
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Clean and optimize
                    </p>
                  </div>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </button>

              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:database-remove'
                    width='20'
                    height='20'
                    className='text-red-500'
                  />
                  <div className='text-left'>
                    <p className='text-red-500 font-medium'>Clear Cache</p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Clear all cached data
                    </p>
                  </div>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-red-400'
                />
              </button>
            </div>
          </div>

          {/* Security */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Security Settings
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    Force HTTPS
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Enforce secure connections
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    API Rate Limiting
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Limit API requests
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    IP Whitelist
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Restrict admin access
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-gray-300 rounded-full'>
                  <span className='absolute top-1 left-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    2FA Required
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Require for all admins
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>
            </div>
          </div>

          {/* Email Configuration */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Email Configuration
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  SMTP Server
                </label>
                <input
                  type='text'
                  defaultValue='smtp.gmail.com'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  SMTP Port
                </label>
                <input
                  type='text'
                  defaultValue='587'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  From Email
                </label>
                <input
                  type='email'
                  defaultValue='noreply@celebritypersona.com'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <button className='w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
                Test Connection
              </button>
            </div>
          </div>

          {/* API Configuration */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              API Configuration
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  API Version
                </label>
                <select className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'>
                  <option>v1.0</option>
                  <option>v2.0 (Beta)</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Rate Limit
                </label>
                <input
                  type='text'
                  defaultValue='1000 requests/hour'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  API Key
                </label>
                <div className='flex gap-2'>
                  <input
                    type='password'
                    defaultValue='••••••••••••••••'
                    className='flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                  <button className='px-4 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors'>
                    <Icon icon='mdi:refresh' width='20' height='20' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <button className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium'>
            Save All Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
