'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

interface Movie {
  _id: string
  title: string
  slug: string
  releaseDate: string
  poster: string
  backdrop?: string
  language: string
  genre: string[]
  director: string
  cast: Array<{
    name: string
    role?: string
    character?: string
  }>
  synopsis: string
  status: 'Announced' | 'In Production' | 'Post-Production' | 'Released' | 'Cancelled'
  anticipationScore: number
  duration?: number
  mpaaRating?: string
  featured: boolean
  trailer?: string
  studio?: string
}

const UpcomingMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [genres, setGenres] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          limit: '12',
          sortBy: 'releaseDate',
          sortOrder: 'desc',
        })
        
        if (searchQuery) params.append('search', searchQuery)
        if (selectedGenre !== 'All') params.append('genre', selectedGenre)
        if (selectedStatus !== 'All') params.append('status', selectedStatus)

        const res = await fetch(`/api/upcoming-movies?${params}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        
        setMovies(data.data || [])
        if (data.filters) {
          setGenres(['All', ...data.filters.genres])
          setStatuses(['All', ...data.filters.statuses])
        }
      } catch (error) {
        console.error('Error fetching upcoming movies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchQuery, selectedGenre, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Announced': return 'bg-blue-500'
      case 'In Production': return 'bg-yellow-500'
      case 'Post-Production': return 'bg-orange-500'
      case 'Released': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              upcoming releases
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Upcoming Movies & Releases
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Stay updated with the latest upcoming movies featuring your favorite celebrities. Get release dates, trailers, and exclusive insights.
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-8'>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon icon='mdi:magnify' width='24' height='24' />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-14 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white text-lg'
                placeholder='Search upcoming movies, actors, or directors...'
                aria-label='Search movies'
              />
            </div>
          </div>

          {/* Filters */}
          <div className='space-y-4'>
            {/* Genre Filter */}
            {genres.length > 0 && (
              <div>
                <p className='text-center text-gray-600 mb-3 font-semibold'>Filter by Genre</p>
                <div className='flex flex-wrap justify-center gap-3'>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-6 py-3 rounded-full font-semibold transition ${
                        selectedGenre === genre
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}>
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Filter */}
            {statuses.length > 0 && (
              <div>
                <p className='text-center text-gray-600 mb-3 font-semibold'>Filter by Status</p>
                <div className='flex flex-wrap justify-center gap-3'>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-6 py-3 rounded-full font-semibold transition ${
                        selectedStatus === status
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold mb-8'>Upcoming Releases</h2>
          
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='bg-grey rounded-3xl overflow-hidden shadow-xl animate-pulse'>
                  <div className='w-full aspect-[2/3] bg-gray-200'></div>
                  <div className='p-4'>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:movie-open-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No movies found</h3>
              <p className='text-gray-600'>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  href={`/upcoming-movies/${movie.slug}`}
                  className='group'>
                  <div className='bg-grey rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full aspect-[2/3] overflow-hidden'>
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className={`absolute top-4 left-4 ${getStatusColor(movie.status)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {movie.status}
                      </div>
                      {movie.anticipationScore > 0 && (
                        <div className='absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1'>
                          <Icon icon='mdi:fire' width='16' height='16' />
                          {movie.anticipationScore}%
                        </div>
                      )}
                    </div>
                    
                    <div className='p-4'>
                      <h3 className='text-lg font-bold mb-1 group-hover:text-primary transition line-clamp-2'>
                        {movie.title}
                      </h3>
                      
                      <p className='text-sm text-gray-500 mb-2 flex items-center gap-1'>
                        <Icon icon='mdi:calendar' width='14' height='14' />
                        {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>

                      <div className='flex flex-wrap gap-1 mb-2'>
                        {movie.genre.slice(0, 2).map((g, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-white rounded-full text-xs text-gray-600'>
                            {g}
                          </span>
                        ))}
                      </div>

                      {movie.director && (
                        <p className='text-xs text-gray-500 truncate'>
                          Dir: {movie.director}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default UpcomingMoviesPage
