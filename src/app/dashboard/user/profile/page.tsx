'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Fashion enthusiast and celebrity style tracker.',
    location: 'Los Angeles, CA',
    website: 'https://example.com',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update API call
    setIsEditing(false)
  }

  return (
    <DashboardLayout requiredRole='user'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Profile
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage your personal information and preferences.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Profile Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
              <div className='text-center'>
                <div className='relative inline-block'>
                  <img
                    src={user?.avatar || '/images/team/user1.svg'}
                    alt={user?.name}
                    className='w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-100 dark:border-gray-800'
                  />
                  <button className='absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors'>
                    <Icon icon='mdi:camera' width='20' height='20' />
                  </button>
                </div>
                <h2 className='text-xl font-bold text-black dark:text-white mt-4'>
                  {user?.name}
                </h2>
                <p className='text-gray-600 dark:text-gray-400 text-sm capitalize'>
                  {user?.role}
                </p>
                <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-800'>
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div>
                      <p className='text-2xl font-bold text-black dark:text-white'>
                        24
                      </p>
                      <p className='text-gray-500 dark:text-gray-400 text-xs'>
                        Favorites
                      </p>
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-black dark:text-white'>
                        12
                      </p>
                      <p className='text-gray-500 dark:text-gray-400 text-xs'>
                        Outfits
                      </p>
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-black dark:text-white'>
                        156
                      </p>
                      <p className='text-gray-500 dark:text-gray-400 text-xs'>
                        Views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-black dark:text-white'>
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-xl hover:bg-primary hover:text-white transition-colors'>
                    <Icon icon='mdi:pencil' width='18' height='18' />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setIsEditing(false)}
                      className='px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className='px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors'>
                      Save
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={4}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Location
                  </label>
                  <input
                    type='text'
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Website
                  </label>
                  <input
                    type='url'
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent'
                  />
                </div>
              </form>
            </div>

            {/* Account Settings */}
            <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mt-6'>
              <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
                Account Settings
              </h2>
              <div className='space-y-4'>
                <button className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <Icon
                      icon='mdi:lock-reset'
                      width='20'
                      height='20'
                      className='text-gray-600 dark:text-gray-400'
                    />
                    <span className='text-black dark:text-white font-medium'>
                      Change Password
                    </span>
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
                      icon='mdi:shield-check'
                      width='20'
                      height='20'
                      className='text-gray-600 dark:text-gray-400'
                    />
                    <span className='text-black dark:text-white font-medium'>
                      Privacy & Security
                    </span>
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
                      icon='mdi:delete-forever'
                      width='20'
                      height='20'
                      className='text-red-500'
                    />
                    <span className='text-red-500 font-medium'>
                      Delete Account
                    </span>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
