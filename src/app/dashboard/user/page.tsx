'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

const stats = [
  {
    icon: 'mdi:heart',
    label: 'Favorites',
    value: '24',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/10',
  },
  {
    icon: 'mdi:tshirt-crew',
    label: 'Saved Outfits',
    value: '12',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    icon: 'mdi:eye',
    label: 'Profile Views',
    value: '156',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    icon: 'mdi:clock',
    label: 'Activity',
    value: '8h',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
  },
]

const recentActivities = [
  {
    icon: 'mdi:heart',
    action: 'Added to favorites',
    item: 'Emma Watson - Red Carpet Look',
    time: '2 hours ago',
  },
  {
    icon: 'mdi:tshirt-crew',
    action: 'Saved outfit',
    item: 'Summer Casual Style',
    time: '5 hours ago',
  },
  {
    icon: 'mdi:star',
    action: 'Followed celebrity',
    item: 'Zendaya',
    time: '1 day ago',
  },
  {
    icon: 'mdi:comment',
    action: 'Commented on',
    item: 'Oscar 2024 Best Dressed',
    time: '2 days ago',
  },
]

export default function UserDashboard() {
  return (
    <DashboardLayout requiredRole='user'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Welcome back! Here's your activity overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
              <div className='flex items-center gap-4'>
                <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                  <Icon
                    icon={stat.icon}
                    width='24'
                    height='24'
                    className={stat.color}
                  />
                </div>
                <div>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    {stat.label}
                  </p>
                  <p className='text-2xl font-bold text-black dark:text-white'>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <h2 className='text-xl font-bold text-black dark:text-white mb-4'>
            Recent Activity
          </h2>
          <div className='space-y-4'>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className='flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <div className='bg-primary/10 p-2 rounded-xl'>
                  <Icon
                    icon={activity.icon}
                    width='20'
                    height='20'
                    className='text-primary'
                  />
                </div>
                <div className='flex-1'>
                  <p className='text-black dark:text-white font-medium'>
                    {activity.action}
                  </p>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    {activity.item}
                  </p>
                </div>
                <span className='text-gray-500 dark:text-gray-400 text-sm'>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h3 className='text-lg font-bold text-black dark:text-white mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <button className='w-full flex items-center gap-3 p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors'>
                <Icon icon='mdi:heart-plus' width='20' height='20' />
                <span>Add to Favorites</span>
              </button>
              <button className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <Icon icon='mdi:tshirt-crew' width='20' height='20' />
                <span>Save Outfit</span>
              </button>
              <button className='w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                <Icon icon='mdi:star-plus' width='20' height='20' />
                <span>Follow Celebrity</span>
              </button>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h3 className='text-lg font-bold text-black dark:text-white mb-4'>
              Popular This Week
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer'>
                <img
                  src='/images/team/user1.svg'
                  alt='Celebrity'
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <p className='text-black dark:text-white font-medium'>
                    Emma Watson
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    1.2M followers
                  </p>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </div>
              <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer'>
                <img
                  src='/images/team/user2.svg'
                  alt='Celebrity'
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <p className='text-black dark:text-white font-medium'>
                    Zendaya
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    980K followers
                  </p>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </div>
              <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer'>
                <img
                  src='/images/team/user3.svg'
                  alt='Celebrity'
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <p className='text-black dark:text-white font-medium'>
                    Tom Holland
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    850K followers
                  </p>
                </div>
                <Icon
                  icon='mdi:chevron-right'
                  width='20'
                  height='20'
                  className='text-gray-400'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
