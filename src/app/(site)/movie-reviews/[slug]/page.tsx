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
  content: string
  rating: number
  publishDate: string
  featured: boolean
  movieDetails: {
    releaseYear: number
    director: string
    writers: string[]
    cast: Array<{
      name: string
      character: string
      image?: string
    }>
    genre: string[]
    runtime: number
    studio: string
    mpaaRating?: string
  }
  author: {
    name: string
    avatar: string
    bio: string
  }
  stats: {
    views: number
    likes: number
    comments: number
  }
  scores?: {
    criticsScore: number
    audienceScore: number
  }
}

const MovieReviewDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [review, setReview] = useState<MovieReview | null>(null)
  const [relatedReviews, setRelatedReviews] = useState<MovieReview[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/movie-reviews/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setReview(data.data)
        setRelatedReviews(data.related || [])
      } catch (error) {
        console.error('Error fetching movie review:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
            <div className='h-12 bg-gray-200 rounded w-3/4 mb-4'></div>
            <div className='w-full h-[500px] bg-gray-200 rounded-3xl mb-8'></div>
            <div className='space-y-3'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='h-4 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!review) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4 text-center'>
          <Icon icon='mdi:movie-remove-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h2 className='text-3xl font-bold mb-4'>Movie Review Not Found</h2>
          <Link href='/movie-reviews' className='text-primary hover:underline'>
            Back to Movie Reviews
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className='bg-grey'>
      {/* Hero Section */}
      <section className='pt-32 pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <Link 
            href='/movie-reviews'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Movie Reviews</span>
          </Link>

          <div className='flex items-center gap-3 mb-4'>
            <div className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
              {review.movieDetails.genre[0]}
            </div>
            <div className='flex items-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold'>
              <Icon icon='mdi:star' width='20' height='20' />
              <span>{review.rating}/10</span>
            </div>
          </div>

          <p className='text-gray-500 text-lg mb-2'>{review.movieTitle} ({review.movieDetails.releaseYear})</p>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            {review.title}
          </h1>

          <div className='flex flex-wrap items-center gap-6 mb-8'>
            <div className='flex items-center gap-3'>
              <Image
                src={review.author.avatar}
                alt={review.author.name}
                width={48}
                height={48}
                className='rounded-full'
              />
              <div>
                <p className='font-semibold'>{review.author.name}</p>
                <p className='text-sm text-gray-500'>
                  {new Date(review.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <div className='flex items-center gap-1'>
                <Icon icon='mdi:eye' width='18' height='18' />
                <span>{review.stats.views.toLocaleString()} views</span>
              </div>
              <div className='flex items-center gap-1'>
                <Icon icon='mdi:clock-outline' width='18' height='18' />
                <span>{review.movieDetails.runtime} min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Poster */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl'>
            <Image
              src={review.poster}
              alt={review.movieTitle}
              fill
              className='object-cover'
            />
          </div>
        </div>
      </section>

      {/* Movie Info */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='bg-white rounded-3xl p-8 shadow-xl'>
            <h2 className='text-2xl font-bold mb-6'>Movie Information</h2>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Director</p>
                <p className='font-semibold'>{review.movieDetails.director}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Studio</p>
                <p className='font-semibold'>{review.movieDetails.studio}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Genre</p>
                <p className='font-semibold'>{review.movieDetails.genre.join(', ')}</p>
              </div>
              <div>
                <p className='text-gray-500 text-sm mb-1'>Runtime</p>
                <p className='font-semibold'>{review.movieDetails.runtime} minutes</p>
              </div>
              {review.movieDetails.mpaaRating && (
                <div>
                  <p className='text-gray-500 text-sm mb-1'>Rating</p>
                  <p className='font-semibold'>{review.movieDetails.mpaaRating}</p>
                </div>
              )}
            </div>

            {review.movieDetails.cast && review.movieDetails.cast.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-xl font-bold mb-4'>Cast</h3>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {review.movieDetails.cast.slice(0, 6).map((member, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      {member.image && (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={48}
                          height={48}
                          className='rounded-full'
                        />
                      )}
                      <div>
                        <p className='font-semibold text-sm'>{member.name}</p>
                        <p className='text-xs text-gray-500'>{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Review Content */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            <div 
              className='prose prose-lg max-w-none'
              dangerouslySetInnerHTML={{ __html: review.content }}
            />
          </div>
        </div>
      </section>

      {/* Scores Section */}
      {review.scores && (
        <section className='pb-12'>
          <div className='container mx-auto max-w-4xl px-4'>
            <div className='bg-white rounded-3xl p-8 shadow-xl'>
              <h2 className='text-2xl font-bold mb-6'>Scores</h2>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='text-center p-6 bg-grey rounded-2xl'>
                  <p className='text-gray-500 mb-2'>Critics Score</p>
                  <p className='text-4xl font-bold text-primary'>{review.scores.criticsScore}%</p>
                </div>
                <div className='text-center p-6 bg-grey rounded-2xl'>
                  <p className='text-gray-500 mb-2'>Audience Score</p>
                  <p className='text-4xl font-bold text-primary'>{review.scores.audienceScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Reviews */}
      {relatedReviews.length > 0 && (
        <section className='pb-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-8'>Related Reviews</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {relatedReviews.map((relatedReview) => (
                <Link
                  key={relatedReview._id}
                  href={`/movie-reviews/${relatedReview.slug}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full h-80 overflow-hidden'>
                      <Image
                        src={relatedReview.poster}
                        alt={relatedReview.movieTitle}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 right-4 flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-full font-bold'>
                        <Icon icon='mdi:star' width='18' height='18' />
                        <span>{relatedReview.rating}/10</span>
                      </div>
                    </div>
                    <div className='p-6'>
                      <p className='text-gray-500 text-sm mb-2'>{relatedReview.movieTitle}</p>
                      <h3 className='text-lg font-bold group-hover:text-primary transition line-clamp-2'>
                        {relatedReview.title}
                      </h3>
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

export default MovieReviewDetailPage
