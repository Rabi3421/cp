'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Movie } from '@/app/types/movie'
import { Icon } from '@iconify/react'

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setMovies(data.MoviesData || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique genres
  const allGenres = movies.flatMap(m => m.genre)
  const genres = ['All', ...new Set(allGenres)]

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.cast.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre)
    return matchesSearch && matchesGenre
  })

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              movies & shows
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Celebrity Movies & TV Shows
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Explore the filmography of your favorite celebrities, from blockbuster hits to critically acclaimed performances.
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
                placeholder='Search movies, actors, or genres...'
                aria-label='Search movies'
              />
            </div>
          </div>

          {/* Genre Filter */}
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
      </section>

      {/* Movies Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl overflow-hidden shadow-xl animate-pulse'>
                  <div className='w-full aspect-[2/3] bg-gray-200'></div>
                  <div className='p-4'>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:movie-open-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No movies found</h3>
              <p className='text-gray-600'>Try adjusting your search or genre filter</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
              {filteredMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full aspect-[2/3] overflow-hidden'>
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1'>
                        <Icon icon='mdi:star' width='16' height='16' />
                        {movie.rating}
                      </div>
                    </div>
                    
                    <div className='p-4'>
                      <h3 className='text-lg font-bold mb-1 group-hover:text-primary transition line-clamp-1'>
                        {movie.title}
                      </h3>
                      
                      <p className='text-sm text-gray-500 mb-2'>
                        {movie.releaseDate}
                      </p>

                      <div className='flex flex-wrap gap-1'>
                        {movie.genre.slice(0, 2).map((g, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-grey rounded-full text-xs text-gray-600'>
                            {g}
                          </span>
                        ))}
                      </div>
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

export default MoviesPage
