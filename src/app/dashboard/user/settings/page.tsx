'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    favorites: true,
    newContent: true,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: false,
    showFavorites: true,
  })

  return (
    <DashboardLayout requiredRole='user'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage your preferences and account settings.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Notifications */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Notifications
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:email'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Email Notifications
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      email: !notifications.email,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.email ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:bell'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Push Notifications
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Get real-time alerts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      push: !notifications.push,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.push ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.push ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:heart'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Favorites Updates
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Notify about favorite celebs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      favorites: !notifications.favorites,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.favorites ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.favorites ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:newspaper'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      New Content
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Alert for new posts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      newContent: !notifications.newContent,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.newContent ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.newContent ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Privacy
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:eye'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Public Profile
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Make profile visible to all
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({
                      ...privacy,
                      profilePublic: !privacy.profilePublic,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.profilePublic ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacy.profilePublic ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:clock'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Show Activity
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Display recent activity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({
                      ...privacy,
                      showActivity: !privacy.showActivity,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.showActivity ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacy.showActivity ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:heart'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div>
                    <p className='text-black dark:text-white font-medium'>
                      Show Favorites
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Make favorites list public
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({
                      ...privacy,
                      showFavorites: !privacy.showFavorites,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacy.showFavorites ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacy.showFavorites ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Appearance
            </h2>
            <div className='space-y-4'>
              <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <label className='block text-black dark:text-white font-medium mb-3'>
                  Theme
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <button className='p-3 rounded-lg border-2 border-primary bg-primary/10 text-center'>
                    <Icon
                      icon='mdi:white-balance-sunny'
                      width='24'
                      height='24'
                      className='mx-auto mb-1 text-primary'
                    />
                    <span className='text-xs text-black dark:text-white'>
                      Light
                    </span>
                  </button>
                  <button className='p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center hover:border-primary transition-colors'>
                    <Icon
                      icon='mdi:moon-waning-crescent'
                      width='24'
                      height='24'
                      className='mx-auto mb-1 text-gray-600 dark:text-gray-400'
                    />
                    <span className='text-xs text-black dark:text-white'>
                      Dark
                    </span>
                  </button>
                  <button className='p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center hover:border-primary transition-colors'>
                    <Icon
                      icon='mdi:theme-light-dark'
                      width='24'
                      height='24'
                      className='mx-auto mb-1 text-gray-600 dark:text-gray-400'
                    />
                    <span className='text-xs text-black dark:text-white'>
                      Auto
                    </span>
                  </button>
                </div>
              </div>

              <div className='p-4 rounded-xl border border-gray-200 dark:border-gray-800'>
                <label className='block text-black dark:text-white font-medium mb-3'>
                  Language
                </label>
                <select className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent'>
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data & Storage */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Data & Storage
            </h2>
            <div className='space-y-4'>
              <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='flex items-center gap-3'>
                  <Icon
                    icon='mdi:download'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Download Data
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Export all your data
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
                    icon='mdi:cached'
                    width='20'
                    height='20'
                    className='text-gray-600 dark:text-gray-400'
                  />
                  <div className='text-left'>
                    <p className='text-black dark:text-white font-medium'>
                      Clear Cache
                    </p>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                      Free up storage space
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

              <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-gray-600 dark:text-gray-400 text-sm'>
                    Storage Used
                  </span>
                  <span className='text-black dark:text-white font-medium'>
                    2.4 MB / 100 MB
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full'
                    style={{ width: '2.4%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end'>
          <button className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium'>
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
