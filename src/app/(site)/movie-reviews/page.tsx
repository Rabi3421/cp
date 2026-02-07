'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'

interface MovieReview {
  _id: string
  title: string
  slug: string
  movieTitle: string
  poster: string
  excerpt: string
  rating: number
  publishDate: string
  featured: boolean
  movieDetails: {
    releaseYear: number
    director: string
    genre: string[]
    runtime: number
  }
  author: {
    name: string
    avatar: string
  }
  stats: {
    views: number
  }
}

const MovieReviewsPage = () => {
  const [reviews, setReviews] = useState<MovieReview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          limit: '12',
          sortBy: 'publishDate',
          sortOrder: 'desc',
        })
        
        if (searchQuery) params.append('search', searchQuery)
        if (selectedGenre !== 'All') params.append('genre', selectedGenre)

        const res = await fetch(`/api/movie-reviews?${params}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        
        setReviews(data.data || [])
        if (data.genres) {
          setGenres(['All', ...data.genres])
        }
      } catch (error) {
        console.error('Error fetching movie reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchQuery, selectedGenre])

  const featuredReview = reviews.find(r => r.featured)

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              movie reviews
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Expert Movie Reviews & Analysis
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              In-depth reviews, ratings, and analysis of the latest movies featuring your favorite celebrities.
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
                placeholder='Search movie reviews...'
                aria-label='Search movie reviews'
              />
            </div>
          </div>

          {/* Genre Filter */}
          {genres.length > 0 && (
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
          )}
        </div>
      </section>

      {/* Featured Review */}
      {featuredReview && !searchQuery && selectedGenre === 'All' && (
        <section className='py-12 bg-white'>
          <div className='container mx-auto max-w-7xl px-4'>
            <div className='flex items-center gap-2 mb-6'>
              <Icon icon='mdi:star' width='24' height='24' className='text-primary' />
              <h2 className='text-2xl font-bold'>Featured Review</h2>
            </div>
            <Link href={`/movie-reviews/${featuredReview.slug}`} className='group'>
              <div className='bg-grey rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                <div className='grid md:grid-cols-2 gap-0'>
                  <div className='relative h-80 md:h-full overflow-hidden'>
                    <Image
                      src={featuredReview.poster}
                      alt={featuredReview.movieTitle}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-8 md:p-12 flex flex-col justify-center'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {featuredReview.movieDetails.genre[0]}
                      </div>
                      <div className='flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full'>
                        <Icon icon='mdi:star' width='18' height='18' />
                        <span className='font-bold'>{featuredReview.rating}/10</span>
                      </div>
                    </div>
                    <p className='text-gray-500 text-sm mb-2'>{featuredReview.movieTitle}</p>
                    <h3 className='text-3xl font-bold mb-4 group-hover:text-primary transition'>
                      {featuredReview.title}
                    </h3>
                    <p className='text-gray-600 mb-6 text-lg'>
                      {featuredReview.excerpt}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-500 mb-6'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src={featuredReview.author.avatar}
                          alt={featuredReview.author.name}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />
                        <span className='font-semibold'>{featuredReview.author.name}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Icon icon='mdi:calendar' width='16' height='16' />
                        <span>{new Date(featuredReview.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Icon icon='mdi:eye' width='16' height='16' />
                        <span>{featuredReview.stats.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <span className='text-primary font-semibold flex items-center gap-1'>
                      Read Full Review
                      <Icon icon='tabler:chevron-right' width='20' height='20' />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className='py-20 bg-grey'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold mb-8'>All Reviews</h2>
          
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-80 bg-gray-200 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:movie-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No reviews found</h3>
              <p className='text-gray-600'>Try adjusting your search or genre filter</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {reviews.map((review) => (
                <Link
                  key={review._id}
                  href={`/movie-reviews/${review.slug}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col'>
                    <div className='relative w-full h-96 overflow-hidden'>
                      <Image
                        src={review.poster}
                        alt={review.movieTitle}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {review.movieDetails.genre[0]}
                      </div>
                      <div className='absolute top-4 right-4 flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-full font-bold'>
                        <Icon icon='mdi:star' width='18' height='18' />
                        <span>{review.rating}/10</span>
                      </div>
                    </div>
                    
                    <div className='p-6 flex flex-col flex-grow'>
                      <p className='text-gray-500 text-sm mb-2'>{review.movieTitle}</p>
                      <h3 className='text-xl font-bold mb-3 group-hover:text-primary transition line-clamp-2'>
                        {review.title}
                      </h3>
                      
                      <p className='text-gray-600 mb-4 line-clamp-3 flex-grow'>
                        {review.excerpt}
                      </p>
                      
                      <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src={review.author.avatar}
                            alt={review.author.name}
                            width={24}
                            height={24}
                            className='rounded-full'
                          />
                          <span>{review.author.name}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Icon icon='mdi:clock-outline' width='16' height='16' />
                          <span>{review.movieDetails.runtime} min</span>
                        </div>
                      </div>
                      
                      <div className='pt-4 border-t border-gray-100'>
                        <span className='text-primary font-semibold flex items-center gap-1'>
                          Read Review
                          <Icon icon='tabler:chevron-right' width='20' height='20' />
                        </span>
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

export default MovieReviewsPage
