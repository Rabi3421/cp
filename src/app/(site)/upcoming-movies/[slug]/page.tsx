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
    image?: string
  }>
  synopsis: string
  plotSummary?: string
  status: 'Announced' | 'In Production' | 'Post-Production' | 'Released' | 'Cancelled'
  anticipationScore: number
  duration?: number
  mpaaRating?: string
  regions: string[]
  featured: boolean
  trailer?: string
  studio?: string
  producers?: string[]
  writers?: string[]
  ticketLinks?: Array<{
    platform: string
    url: string
    available: boolean
  }>
  budget?: number
  boxOfficeProjection?: number
}

const UpcomingMovieDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/upcoming-movies/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setMovie(data.data)
        setRelatedMovies(data.related || [])
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Announced': return 'bg-blue-500'
      case 'In Production': return 'bg-yellow-500'
      case 'Post-Production': return 'bg-orange-500'
      case 'Released': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

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
          <Link href='/upcoming-movies' className='text-primary hover:underline'>
            Back to Upcoming Movies
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className='bg-grey'>
      {/* Hero Section with Backdrop */}
      {movie.backdrop && (
        <section className='relative h-[500px] overflow-hidden'>
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-grey via-grey/80 to-transparent'></div>
        </section>
      )}

      {/* Main Content */}
      <section className={movie.backdrop ? '-mt-32 relative z-10 pb-12' : 'pt-32 pb-12'}>
        <div className='container mx-auto max-w-6xl px-4'>
          <Link 
            href='/upcoming-movies'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Upcoming Movies</span>
          </Link>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Movie Poster */}
            <div className='relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className='object-cover'
              />
              <div className={`absolute top-4 left-4 ${getStatusColor(movie.status)} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                {movie.status}
              </div>
              {movie.anticipationScore > 0 && (
                <div className='absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1'>
                  <Icon icon='mdi:fire' width='20' height='20' />
                  <span>{movie.anticipationScore}%</span>
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className='md:col-span-2 space-y-6'>
              <div className='bg-white rounded-3xl p-8 shadow-xl'>
                <h1 className='text-4xl font-bold mb-4'>
                  {movie.title}
                </h1>

                <div className='flex flex-wrap items-center gap-4 mb-6'>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Icon icon='mdi:calendar' width='20' height='20' />
                    <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {movie.duration && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Icon icon='mdi:clock-outline' width='20' height='20' />
                      <span>{movie.duration} min</span>
                    </div>
                  )}
                  {movie.mpaaRating && (
                    <span className='px-3 py-1 bg-grey rounded-full text-sm font-semibold'>
                      {movie.mpaaRating}
                    </span>
                  )}
                </div>

                <div className='flex flex-wrap gap-2 mb-6'>
                  {movie.genre.map((g, idx) => (
                    <span
                      key={idx}
                      className='px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold'>
                      {g}
                    </span>
                  ))}
                </div>

                <div className='space-y-6'>
                  <div>
                    <h2 className='text-xl font-bold mb-3'>Synopsis</h2>
                    <p className='text-gray-700 leading-relaxed'>
                      {movie.synopsis}
                    </p>
                  </div>

                  {movie.plotSummary && (
                    <div>
                      <h2 className='text-xl font-bold mb-3'>Plot Summary</h2>
                      <p className='text-gray-700 leading-relaxed'>
                        {movie.plotSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trailer */}
              {movie.trailer && (
                <div className='bg-white rounded-3xl p-8 shadow-xl'>
                  <h2 className='text-2xl font-bold mb-4'>Official Trailer</h2>
                  <div className='aspect-video rounded-2xl overflow-hidden bg-black'>
                    <iframe
                      src={movie.trailer}
                      className='w-full h-full'
                      allowFullScreen
                      title='Movie Trailer'
                    />
                  </div>
                </div>
              )}

              {/* Ticket Links */}
              {movie.ticketLinks && movie.ticketLinks.length > 0 && (
                <div className='bg-white rounded-3xl p-8 shadow-xl'>
                  <h2 className='text-2xl font-bold mb-4'>Book Tickets</h2>
                  <div className='flex flex-wrap gap-4'>
                    {movie.ticketLinks.filter(link => link.available).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition flex items-center gap-2'>
                        <Icon icon='mdi:ticket' width='20' height='20' />
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Production Details */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='bg-white rounded-3xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold mb-6'>Production Details</h2>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Director</p>
                <p className='font-semibold'>{movie.director}</p>
              </div>
              {movie.studio && (
                <div>
                  <p className='text-gray-500 text-sm mb-1'>Studio</p>
                  <p className='font-semibold'>{movie.studio}</p>
                </div>
              )}
              <div>
                <p className='text-gray-500 text-sm mb-1'>Language</p>
                <p className='font-semibold'>{movie.language}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Release Regions</p>
                <p className='font-semibold'>{movie.regions.join(', ')}</p>
              </div>
              {movie.budget && (
                <div>
                  <p className='text-gray-500 text-sm mb-1'>Budget</p>
                  <p className='font-semibold'>${movie.budget.toLocaleString()}</p>
                </div>
              )}
              {movie.boxOfficeProjection && (
                <div>
                  <p className='text-gray-500 text-sm mb-1'>Box Office Projection</p>
                  <p className='font-semibold'>${movie.boxOfficeProjection.toLocaleString()}</p>
                </div>
              )}
            </div>

            {movie.writers && movie.writers.length > 0 && (
              <div className='mt-6'>
                <p className='text-gray-500 text-sm mb-2'>Writers</p>
                <p className='font-semibold'>{movie.writers.join(', ')}</p>
              </div>
            )}

            {movie.producers && movie.producers.length > 0 && (
              <div className='mt-6'>
                <p className='text-gray-500 text-sm mb-2'>Producers</p>
                <p className='font-semibold'>{movie.producers.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <section className='pb-12'>
          <div className='container mx-auto max-w-6xl px-4'>
            <div className='bg-white rounded-3xl p-8 shadow-xl'>
              <h2 className='text-2xl font-bold mb-6'>Cast</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {movie.cast.map((member, index) => (
                  <div key={index} className='text-center'>
                    {member.image && (
                      <div className='relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden'>
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <p className='font-semibold'>{member.name}</p>
                    {member.character && (
                      <p className='text-sm text-gray-500'>{member.character}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className='pb-20'>
          <div className='container mx-auto max-w-6xl px-4'>
            <h2 className='text-3xl font-bold mb-8'>More Upcoming Movies</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {relatedMovies.map((relatedMovie) => (
                <Link
                  key={relatedMovie._id}
                  href={`/upcoming-movies/${relatedMovie.slug}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full aspect-[2/3] overflow-hidden'>
                      <Image
                        src={relatedMovie.poster}
                        alt={relatedMovie.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className={`absolute top-3 left-3 ${getStatusColor(relatedMovie.status)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                        {relatedMovie.status}
                      </div>
                      {relatedMovie.anticipationScore > 0 && (
                        <div className='absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                          <Icon icon='mdi:fire' width='14' height='14' />
                          {relatedMovie.anticipationScore}%
                        </div>
                      )}
                    </div>
                    <div className='p-4'>
                      <h3 className='text-sm font-bold group-hover:text-primary transition line-clamp-2'>
                        {relatedMovie.title}
                      </h3>
                      <p className='text-xs text-gray-500 mt-1'>
                        {new Date(relatedMovie.releaseDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
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

export default UpcomingMovieDetailPage
