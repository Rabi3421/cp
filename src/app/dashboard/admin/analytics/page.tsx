'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'

export default function AnalyticsPage() {
  return (
    <DashboardLayout requiredRole='admin'>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-black dark:text-white'>
            Analytics
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Platform performance and user engagement metrics.
          </p>
        </div>

        {/* Overview Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:eye'
                  width='24'
                  height='24'
                  className='text-blue-500'
                />
              </div>
              <span className='text-green-500 text-sm font-medium'>+24%</span>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Page Views
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              145.2K
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:account-multiple'
                  width='24'
                  height='24'
                  className='text-green-500'
                />
              </div>
              <span className='text-green-500 text-sm font-medium'>+18%</span>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Active Users
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              8,542
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-purple-50 dark:bg-purple-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:clock'
                  width='24'
                  height='24'
                  className='text-purple-500'
                />
              </div>
              <span className='text-green-500 text-sm font-medium'>+12%</span>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Avg. Session
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              4m 32s
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-4'>
              <div className='bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl'>
                <Icon
                  icon='mdi:percent'
                  width='24'
                  height='24'
                  className='text-red-500'
                />
              </div>
              <span className='text-red-500 text-sm font-medium'>-5%</span>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
              Bounce Rate
            </p>
            <p className='text-2xl font-bold text-black dark:text-white'>
              32.4%
            </p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              User Growth
            </h2>
            <div className='h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl'>
              <div className='text-center'>
                <Icon
                  icon='mdi:chart-line'
                  width='48'
                  height='48'
                  className='text-gray-300 dark:text-gray-700 mx-auto mb-2'
                />
                <p className='text-gray-400 dark:text-gray-600'>
                  Chart placeholder
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
            <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
              Traffic Sources
            </h2>
            <div className='h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl'>
              <div className='text-center'>
                <Icon
                  icon='mdi:chart-donut'
                  width='48'
                  height='48'
                  className='text-gray-300 dark:text-gray-700 mx-auto mb-2'
                />
                <p className='text-gray-400 dark:text-gray-600'>
                  Chart placeholder
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Content */}
        <div className='bg-white dark:bg-black rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-800'>
          <h2 className='text-xl font-bold text-black dark:text-white mb-6'>
            Top Performing Content
          </h2>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                    Content
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                    Type
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                    Views
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                <tr className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                  <td className='px-6 py-4'>
                    <p className='text-black dark:text-white font-medium'>
                      Emma Watson - Oscar 2024
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 text-xs font-medium rounded-full'>
                      Celebrity
                    </span>
                  </td>
                  <td className='px-6 py-4 text-black dark:text-white'>
                    12.5K
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                        <div
                          className='bg-green-500 h-2 rounded-full'
                          style={{ width: '85%' }}
                        />
                      </div>
                      <span className='text-black dark:text-white text-sm'>
                        85%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                  <td className='px-6 py-4'>
                    <p className='text-black dark:text-white font-medium'>
                      Fashion Trends 2024
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/20 text-xs font-medium rounded-full'>
                      Blog
                    </span>
                  </td>
                  <td className='px-6 py-4 text-black dark:text-white'>
                    9.8K
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                        <div
                          className='bg-green-500 h-2 rounded-full'
                          style={{ width: '72%' }}
                        />
                      </div>
                      <span className='text-black dark:text-white text-sm'>
                        72%
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className='hover:bg-gray-50 dark:hover:bg-gray-900'>
                  <td className='px-6 py-4'>
                    <p className='text-black dark:text-white font-medium'>
                      Dune: Part Two Review
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/20 text-xs font-medium rounded-full'>
                      Movie
                    </span>
                  </td>
                  <td className='px-6 py-4 text-black dark:text-white'>8.2K</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                        <div
                          className='bg-green-500 h-2 rounded-full'
                          style={{ width: '68%' }}
                        />
                      </div>
                      <span className='text-black dark:text-white text-sm'>
                        68%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
