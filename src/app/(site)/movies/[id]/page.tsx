'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Movie } from '@/app/types/movie'
import { Icon } from '@iconify/react'

const MovieDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [movieId, setMovieId] = useState<string>('')

  useEffect(() => {
    params.then(p => setMovieId(p.id))
  }, [])

  useEffect(() => {
    if (!movieId) return
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const moviesData = data.MoviesData || []
        const found = moviesData.find((m: Movie) => m.id === movieId)
        setMovie(found || null)
        
        // Get related movies with same genre
        if (found) {
          const related = moviesData
            .filter((m: Movie) => 
              m.id !== found.id && 
              m.genre.some(g => found.genre.includes(g))
            )
            .slice(0, 4)
          setRelatedMovies(related)
        }
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [movieId])

  if (loading) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='aspect-[2/3] bg-gray-200 rounded-3xl'></div>
              <div className='md:col-span-2 space-y-4'>
                <div className='h-12 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-40 bg-gray-200 rounded'></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!movie) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-6xl px-4 text-center'>
          <Icon icon='mdi:movie-open-remove' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h2 className='text-3xl font-bold mb-4'>Movie Not Found</h2>
          <Link href='/movies' className='text-primary hover:underline'>
            Back to Movies
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className='bg-grey'>
      {/* Hero Section */}
      <section className='pt-32 pb-12'>
        <div className='container mx-auto max-w-6xl px-4'>
          <Link 
            href='/movies'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Movies</span>
          </Link>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Movie Poster */}
            <div className='relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl'>
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className='object-cover'
              />
            </div>

            {/* Movie Details */}
            <div className='md:col-span-2'>
              <div className='bg-white rounded-3xl p-8 shadow-xl'>
                <h1 className='text-4xl font-bold mb-4'>
                  {movie.title}
                </h1>

                <div className='flex flex-wrap items-center gap-4 mb-6'>
                  <div className='flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold'>
                    <Icon icon='mdi:star' width='20' height='20' />
                    <span>{movie.rating}/10</span>
                  </div>
                  <span className='text-gray-600'>{movie.releaseDate}</span>
                  <span className='text-gray-600'>{movie.runtime}</span>
                  <div className='flex gap-2'>
                    {movie.genre.map((g, idx) => (
                      <span
                        key={idx}
                        className='px-3 py-1 bg-grey rounded-full text-sm text-gray-700'>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='space-y-6'>
                  <div>
                    <h2 className='text-xl font-bold mb-2'>Synopsis</h2>
                    <p className='text-gray-700 leading-relaxed'>
                      {movie.synopsis}
                    </p>
                  </div>

                  <div>
                    <h2 className='text-xl font-bold mb-2'>Director</h2>
                    <p className='text-gray-700'>{movie.director}</p>
                  </div>

                  <div>
                    <h2 className='text-xl font-bold mb-2'>Cast</h2>
                    <div className='flex flex-wrap gap-2'>
                      {movie.cast.map((actor, idx) => (
                        <span
                          key={idx}
                          className='px-4 py-2 bg-grey rounded-full text-gray-700'>
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {movie.boxOffice && (
                    <div>
                      <h2 className='text-xl font-bold mb-2'>Box Office</h2>
                      <p className='text-gray-700'>{movie.boxOffice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='bg-white rounded-3xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold mb-6'>Movie Information</h2>
            
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Icon icon='mdi:calendar' width='24' height='24' className='text-primary mt-1' />
                  <div>
                    <p className='font-semibold'>Release Date</p>
                    <p className='text-gray-600'>{movie.releaseDate}</p>
                  </div>
                </div>
                
                <div className='flex items-start gap-3'>
                  <Icon icon='mdi:clock-outline' width='24' height='24' className='text-primary mt-1' />
                  <div>
                    <p className='font-semibold'>Runtime</p>
                    <p className='text-gray-600'>{movie.runtime}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Icon icon='mdi:movie-open' width='24' height='24' className='text-primary mt-1' />
                  <div>
                    <p className='font-semibold'>Genres</p>
                    <p className='text-gray-600'>{movie.genre.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Icon icon='mdi:account-supervisor' width='24' height='24' className='text-primary mt-1' />
                  <div>
                    <p className='font-semibold'>Director</p>
                    <p className='text-gray-600'>{movie.director}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Icon icon='mdi:star-circle' width='24' height='24' className='text-primary mt-1' />
                  <div>
                    <p className='font-semibold'>Rating</p>
                    <p className='text-gray-600'>{movie.rating}/10</p>
                  </div>
                </div>

                {movie.boxOffice && (
                  <div className='flex items-start gap-3'>
                    <Icon icon='mdi:cash-multiple' width='24' height='24' className='text-primary mt-1' />
                    <div>
                      <p className='font-semibold'>Box Office</p>
                      <p className='text-gray-600'>{movie.boxOffice}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className='pb-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-8'>More Like This</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {relatedMovies.map((item) => (
                <Link
                  key={item.id}
                  href={`/movies/${item.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full aspect-[2/3] overflow-hidden'>
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1'>
                        <Icon icon='mdi:star' width='16' height='16' />
                        {item.rating}
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-lg font-bold mb-1 group-hover:text-primary transition line-clamp-1'>
                        {item.title}
                      </h3>
                      <p className='text-sm text-gray-500'>{item.releaseDate}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default MovieDetailPage
