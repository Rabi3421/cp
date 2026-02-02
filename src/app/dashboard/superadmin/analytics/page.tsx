'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const stats = [
    {
      label: 'Total Users',
      value: '12,345',
      change: '+12.5%',
      trend: 'up',
      icon: 'mdi:account-group',
      color: 'blue',
    },
    {
      label: 'Active Sessions',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: 'mdi:account-clock',
      color: 'green',
    },
    {
      label: 'Page Views',
      value: '89,432',
      change: '+15.3%',
      trend: 'up',
      icon: 'mdi:eye',
      color: 'purple',
    },
    {
      label: 'Avg. Session Duration',
      value: '4m 32s',
      change: '-2.1%',
      trend: 'down',
      icon: 'mdi:clock',
      color: 'orange',
    },
  ]

  const topPages = [
    { page: '/dashboard', views: 15432, uniqueViews: 8234, avgTime: '3m 45s' },
    { page: '/celebrities', views: 12891, uniqueViews: 7123, avgTime: '5m 12s' },
    { page: '/outfits', views: 10234, uniqueViews: 6543, avgTime: '4m 23s' },
    { page: '/movies', views: 8756, uniqueViews: 5432, avgTime: '3m 56s' },
    { page: '/news', views: 7234, uniqueViews: 4321, avgTime: '2m 34s' },
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 4532, percentage: 42 },
    { source: 'Search Engines', visitors: 3210, percentage: 30 },
    { source: 'Social Media', visitors: 2145, percentage: 20 },
    { source: 'Referral', visitors: 858, percentage: 8 },
  ]

  const browserStats = [
    { browser: 'Chrome', users: 6543, percentage: 53 },
    { browser: 'Safari', users: 3210, percentage: 26 },
    { browser: 'Firefox', users: 1543, percentage: 12 },
    { browser: 'Edge', users: 987, percentage: 8 },
    { browser: 'Others', users: 62, percentage: 1 },
  ]

  const recentActivity = [
    { time: '2 min ago', user: 'john@example.com', action: 'Viewed celebrity profile', page: '/celebrities/taylor-swift' },
    { time: '5 min ago', user: 'sarah@example.com', action: 'Added outfit to favorites', page: '/outfits/summer-2024' },
    { time: '8 min ago', user: 'mike@example.com', action: 'Read article', page: '/news/latest-fashion' },
    { time: '12 min ago', user: 'emma@example.com', action: 'Watched movie trailer', page: '/movies/upcoming-2024' },
    { time: '15 min ago', user: 'david@example.com', action: 'Submitted review', page: '/movies/the-great-film' },
  ]

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    }
    return colors[color] || 'bg-blue-500'
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              Analytics Dashboard
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Monitor website performance and user behavior.
            </p>
          </div>
          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className='w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='7d'>Last 7 Days</option>
              <option value='30d'>Last 30 Days</option>
              <option value='90d'>Last 90 Days</option>
              <option value='1y'>Last Year</option>
            </select>
            <button className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors'>
              <Icon icon='mdi:download' width='20' height='20' />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`${getColorClass(stat.color)} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon icon={stat.icon} className='text-white' width='24' height='24' />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  <Icon
                    icon={stat.trend === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down'}
                    width='16'
                    height='16'
                  />
                  {stat.change}
                </span>
              </div>
              <h3 className='text-xl sm:text-2xl font-bold text-black dark:text-white mb-1'>
                {stat.value}
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Top Pages */}
          <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-black dark:text-white'>
                Top Pages
              </h2>
              <Icon icon='mdi:file-document' width='24' height='24' className='text-gray-400' />
            </div>
            <div className='space-y-4'>
              {topPages.map((page, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-900 last:border-0 last:pb-0'
                >
                  <div className='flex-1'>
                    <p className='font-medium text-black dark:text-white mb-1'>
                      {page.page}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                      <span>{page.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{page.uniqueViews.toLocaleString()} unique</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                      {page.avgTime}
                    </p>
                    <p className='text-xs text-gray-400'>avg. time</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg sm:text-xl font-bold text-black dark:text-white'>
                Traffic Sources
              </h2>
              <Icon icon='mdi:chart-pie' width='24' height='24' className='text-gray-400' />
            </div>
            <div className='space-y-4'>
              {trafficSources.map((source, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-black dark:text-white'>
                      {source.source}
                    </span>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className='w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all'
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {/* Browser Statistics */}
          <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg sm:text-xl font-bold text-black dark:text-white'>
                Browser Statistics
              </h2>
              <Icon icon='mdi:web' width='24' height='24' className='text-gray-400' />
            </div>
            <div className='space-y-4'>
              {browserStats.map((browser, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-900 last:border-0 last:pb-0'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center'>
                      <Icon icon='mdi:web' width='20' height='20' className='text-gray-600 dark:text-gray-400' />
                    </div>
                    <div>
                      <p className='font-medium text-black dark:text-white'>
                        {browser.browser}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {browser.users.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-black dark:text-white'>
                      {browser.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg sm:text-xl font-bold text-black dark:text-white'>
                Recent Activity
              </h2>
              <Icon icon='mdi:history' width='24' height='24' className='text-gray-400' />
            </div>
            <div className='space-y-4'>
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-900 last:border-0 last:pb-0'
                >
                  <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Icon icon='mdi:account-circle' width='18' height='18' className='text-blue-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-black dark:text-white mb-1'>
                      {activity.user}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                      {activity.action}
                    </p>
                    <p className='text-xs text-gray-400 truncate'>
                      {activity.page}
                    </p>
                  </div>
                  <span className='text-xs text-gray-400 flex-shrink-0'>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-black dark:text-white'>
              Performance Metrics
            </h2>
            <Icon icon='mdi:speedometer' width='24' height='24' className='text-gray-400' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-3 rounded-full border-8 border-green-500 flex items-center justify-center'>
                <span className='text-2xl font-bold text-black dark:text-white'>95</span>
              </div>
              <p className='font-medium text-black dark:text-white mb-1'>Performance</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Page Load Speed</p>
            </div>
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-3 rounded-full border-8 border-blue-500 flex items-center justify-center'>
                <span className='text-2xl font-bold text-black dark:text-white'>88</span>
              </div>
              <p className='font-medium text-black dark:text-white mb-1'>Accessibility</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>WCAG Compliance</p>
            </div>
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-3 rounded-full border-8 border-purple-500 flex items-center justify-center'>
                <span className='text-2xl font-bold text-black dark:text-white'>92</span>
              </div>
              <p className='font-medium text-black dark:text-white mb-1'>Best Practices</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Code Quality</p>
            </div>
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-3 rounded-full border-8 border-orange-500 flex items-center justify-center'>
                <span className='text-2xl font-bold text-black dark:text-white'>97</span>
              </div>
              <p className='font-medium text-black dark:text-white mb-1'>SEO</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Search Optimization</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
