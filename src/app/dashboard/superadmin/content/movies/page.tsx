'use client'

import DashboardLayout from '@/app/components/Dashboard/DashboardLayout'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieForm from './MovieForm'

export default function MoviesPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    announced: 0,
    inProduction: 0,
    postProduction: 0,
    released: 0,
    featured: 0,
    avgAnticipation: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    genre: '',
    language: '',
  })
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [pagination.page, filters])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.language && { language: filters.language }),
        sortBy: 'releaseDate',
        sortOrder: 'desc',
      })

      const response = await axios.get(`/api/superadmin/movies?${params}`)
      if (response.data.success) {
        setMovies(response.data.data)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedMovie(null)
    setView('create')
  }

  const handleEdit = (movie: any) => {
    setSelectedMovie(movie)
    setView('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return

    try {
      const response = await axios.delete(`/api/superadmin/movies/${id}`)
      if (response.data.success) {
        fetchMovies()
        alert('Movie deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Failed to delete movie')
    }
  }

  const handleSave = async (data: any) => {
    try {
      if (view === 'edit' && selectedMovie) {
        const response = await axios.put(
          `/api/superadmin/movies/${(selectedMovie as any)._id}`,
          data
        )
        if (response.data.success) {
          alert('Movie updated successfully')
          setView('list')
          fetchMovies()
        }
      } else {
        const response = await axios.post('/api/superadmin/movies', data)
        if (response.data.success) {
          alert('Movie created successfully')
          setView('list')
          fetchMovies()
        }
      }
    } catch (error: any) {
      console.error('Error saving movie:', error)
      alert(error.response?.data?.error || 'Failed to save movie')
    }
  }

  const handleCancel = () => {
    setSelectedMovie(null)
    setView('list')
  }

  if (view === 'create' || view === 'edit') {
    return (
      <DashboardLayout requiredRole='superadmin'>
        <MovieForm
          movie={selectedMovie}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={view === 'edit'}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole='superadmin'>
      <div className='space-y-1 sm:space-y-2 mt-0 -mt-4 sm:-mt-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 py-0'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:gap-3'>
            <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              Upcoming Movies
            </h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
              Manage upcoming movie releases and information
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:plus' width='20' height='20' />
            <span>Add Movie</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3'>
          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Total Movies
              </p>
              <Icon
                icon='mdi:movie-open'
                className='text-blue-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.total}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Announced
              </p>
              <Icon
                icon='mdi:bell'
                className='text-green-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.announced}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                In Production
              </p>
              <Icon
                icon='mdi:filmstrip'
                className='text-orange-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.inProduction}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Post-Production
              </p>
              <Icon
                icon='mdi:movie-edit'
                className='text-purple-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.postProduction}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Released
              </p>
              <Icon
                icon='mdi:check-circle'
                className='text-green-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.released}
            </p>
          </div>

          <div className='bg-white dark:bg-black rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                Avg Score
              </p>
              <Icon
                icon='mdi:star'
                className='text-yellow-600'
                width='20'
                height='20'
              />
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
              {stats.avgAnticipation.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='bg-white dark:bg-black rounded-2xl shadow-xl p-2 sm:p-4 border border-gray-200 dark:border-gray-800'>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <div className='flex-1 relative'>
              <Icon
                icon='mdi:magnify'
                width='20'
                height='20'
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
              />
              <input
                type='text'
                placeholder='Search movies...'
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
            >
              <option value=''>All Status</option>
              <option value='Announced'>Announced</option>
              <option value='In Production'>In Production</option>
              <option value='Post-Production'>Post-Production</option>
              <option value='Released'>Released</option>
            </select>
            <button
              onClick={fetchMovies}
              className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm'
            >
              <Icon icon='mdi:refresh' width='18' height='18' />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Movies List */}
        <div className='bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Icon
                icon='mdi:loading'
                className='animate-spin text-blue-600'
                width='32'
                height='32'
              />
            </div>
          ) : movies.length === 0 ? (
            <div className='text-center p-8'>
              <Icon
                icon='mdi:movie-open-outline'
                className='mx-auto text-gray-400 mb-4'
                width='64'
                height='64'
              />
              <p className='text-gray-600 dark:text-gray-400'>
                No movies found
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Movie
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Director
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Release
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Score
                    </th>
                    <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                  {movies.map((movie: any) => (
                    <tr
                      key={movie._id}
                      className='hover:bg-gray-50 dark:hover:bg-gray-900/50'
                    >
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className='w-12 h-16 object-cover rounded-lg'
                          />
                          <div>
                            <p className='font-medium text-black dark:text-white line-clamp-1'>
                              {movie.title}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              {movie.genre.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {movie.director}
                      </td>
                      <td className='px-4 py-4'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            movie.status === 'Released'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : movie.status === 'In Production'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                              : movie.status === 'Post-Production'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}
                        >
                          {movie.status}
                        </span>
                        {movie.featured && (
                          <Icon
                            icon='mdi:star'
                            className='inline ml-2 text-yellow-500'
                            width='16'
                            height='16'
                          />
                        )}
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-gray-400'>
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-1'>
                          <Icon
                            icon='mdi:star'
                            className='text-yellow-500'
                            width='16'
                            height='16'
                          />
                          <span className='text-sm font-medium text-black dark:text-white'>
                            {movie.anticipationScore.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(movie)}
                            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <Icon icon='mdi:pencil' width='18' height='18' />
                          </button>
                          <button
                            onClick={() => handleDelete(movie._id)}
                            className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                            title='Delete'
                          >
                            <Icon icon='mdi:delete' width='18' height='18' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                disabled={pagination.page === 1}
                className='px-3 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              >
                Previous
              </button>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                disabled={pagination.page === pagination.pages}
                className='px-3 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
