'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

export default function AdminSettingsPage() {
  return (
    <DashboardLayout requiredRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Admin Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Configure admin preferences and platform settings.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* General Settings */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              General Settings
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Site Name
                </label>
                <input
                  type='text'
                  defaultValue='Celebrity Persona'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Admin Email
                </label>
                <input
                  type='email'
                  defaultValue='admin@celebritypersona.com'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Timezone
                </label>
                <select className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'>
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC+00:00 (UTC)</option>
                  <option>UTC+01:00 (Central European Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Content Settings
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    Auto-approve content
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Skip manual approval
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-gray-300 rounded-full'>
                  <span className='absolute top-1 left-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    Enable comments
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Allow user comments
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Max upload size (MB)
                </label>
                <input
                  type='number'
                  defaultValue='10'
                  className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Security
            </h2>
            <div className='space-y-4'>
              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:shield-key'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Two-Factor Authentication
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Add extra security layer
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
                    icon='mdi:lock-reset'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Password Policy
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Configure requirements
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
                    icon='mdi:history'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Session Timeout
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Auto logout duration
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
            </div>
          </div>

          {/* Email Notifications */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Email Notifications
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    New user signups
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Notify on registration
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    Content submissions
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Notify on new content
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
              </div>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div>
                  <p className='text-black dark:text-white font-medium'>
                    System alerts
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Critical notifications
                  </p>
                </div>
                <button className='relative w-12 h-6 bg-primary rounded-full'>
                  <span className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full' />
                </button>
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
