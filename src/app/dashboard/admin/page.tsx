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
    icon: 'mdi:star',
    label: 'Celebrities',
    value: '156',
    change: '+5%',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
  },
  {
    icon: 'mdi:newspaper',
    label: 'Content Items',
    value: '892',
    change: '+18%',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    icon: 'mdi:chart-line',
    label: 'Page Views',
    value: '45.2K',
    change: '+24%',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
  },
]

const recentUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    joinDate: '2024-01-15',
    avatar: '/images/team/user1.svg',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    joinDate: '2024-01-14',
    avatar: '/images/team/user2.svg',
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    joinDate: '2024-01-13',
    avatar: '/images/team/user3.svg',
  },
]

const recentContent = [
  {
    type: 'celebrity',
    title: 'Emma Watson Profile Updated',
    date: '2 hours ago',
    icon: 'mdi:star',
  },
  {
    type: 'news',
    title: 'Oscar 2024 Red Carpet Highlights',
    date: '5 hours ago',
    icon: 'mdi:newspaper',
  },
  {
    type: 'blog',
    title: 'Fashion Trends Spring 2024',
    date: '1 day ago',
    icon: 'mdi:post',
  },
  {
    type: 'movie',
    title: 'Dune: Part Two Added',
    date: '2 days ago',
    icon: 'mdi:movie',
  },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout requiredRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Admin Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage users, content, and platform analytics.
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
          {/* Recent Users */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-black dark:text-white'>
                Recent Users
              </h2>
              <button className='text-primary hover:text-primary/80 text-sm font-medium'>
                View All
              </button>
            </div>
            <div className='space-y-4'>
              {recentUsers.map((user) => (
                <div
                  key={user.email}
                  className='flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='w-12 h-12 rounded-full object-cover'
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
                  <div className='text-right'>
                    <span className='px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize'>
                      {user.role}
                    </span>
                    <p className='text-gray-500 dark:text-gray-400 text-xs mt-1'>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Content */}
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-black dark:text-white'>
                Recent Content
              </h2>
              <button className='text-primary hover:text-primary/80 text-sm font-medium'>
                View All
              </button>
            </div>
            <div className='space-y-4'>
              {recentContent.map((item, index) => (
                <div
                  key={index}
                  className='flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'>
                  <div className='bg-primary/10 p-2 rounded-xl'>
                    <Icon
                      icon={item.icon}
                      width='20'
                      height='20'
                      className='text-primary'
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='text-black dark:text-white font-medium'>
                      {item.title}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full capitalize'>
                        {item.type}
                      </span>
                      <span className='text-gray-500 dark:text-gray-400 text-xs'>
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
                icon='mdi:account-plus'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>Add User</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:star-plus'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>Add Celebrity</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:newspaper-plus'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>Create News</span>
            </button>
            <button className='flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-colors group'>
              <Icon
                icon='mdi:chart-bar'
                width='24'
                height='24'
                className='text-primary group-hover:text-white'
              />
              <span className='font-medium'>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
