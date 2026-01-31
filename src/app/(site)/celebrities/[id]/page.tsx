'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Celebrity } from '@/app/types/celebrity'
import { Icon } from '@iconify/react'

const CelebrityDetailPage = () => {
  const params = useParams()
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'biography' | 'filmography' | 'awards'>('biography')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const foundCelebrity = data.CelebritiesData?.find(
          (c: Celebrity) => c.id === params.id
        )
        setCelebrity(foundCelebrity || null)
      } catch (error) {
        console.error('Error fetching celebrity:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='animate-pulse'>
            <div className='h-96 bg-gray-200 rounded-3xl mb-8'></div>
            <div className='h-8 bg-gray-200 rounded w-1/2 mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          </div>
        </div>
      </main>
    )
  }

  if (!celebrity) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4 text-center'>
          <Icon icon='mdi:account-off' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h1 className='text-3xl font-bold mb-4'>Celebrity Not Found</h1>
          <Link href='/celebrities' className='text-primary font-semibold hover:underline'>
            Back to Celebrities
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Hero Section with Image */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <Link
            href='/celebrities'
            className='inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:underline'>
            <Icon icon='tabler:chevron-left' width='20' height='20' />
            Back to Celebrities
          </Link>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            {/* Left: Image */}
            <div className='lg:col-span-1'>
              <div className='relative w-full h-96 lg:h-auto lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl sticky top-24'>
                <Image
                  src={celebrity.image}
                  alt={celebrity.name}
                  fill
                  className='object-cover'
                />
              </div>
              
              {/* Social Media Links */}
              {celebrity.socialMedia && (
                <div className='mt-6 bg-white rounded-2xl p-6 shadow-xl'>
                  <h4 className='font-semibold mb-4'>Follow {celebrity.name}</h4>
                  <div className='flex gap-3'>
                    {celebrity.socialMedia.instagram && (
                      <a
                        href={celebrity.socialMedia.instagram}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition'>
                        <Icon icon='mdi:instagram' width='20' height='20' />
                        <span className='text-sm font-semibold'>Instagram</span>
                      </a>
                    )}
                    {celebrity.socialMedia.twitter && (
                      <a
                        href={celebrity.socialMedia.twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition'>
                        <Icon icon='mdi:twitter' width='20' height='20' />
                        <span className='text-sm font-semibold'>Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className='lg:col-span-2'>
              <div className='bg-primary/15 inline-block px-5 py-2 rounded-full mb-4'>
                <span className='text-primary font-bold'>{celebrity.category}</span>
              </div>

              <h1 className='text-4xl md:text-5xl font-bold mb-4'>{celebrity.name}</h1>
              <p className='text-xl text-gray-600 mb-8'>{celebrity.occupation}</p>

              {/* Quick Info Grid */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-white rounded-2xl p-6 shadow-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <Icon icon='mdi:cake-variant' width='24' height='24' className='text-primary' />
                    <span className='text-sm text-gray-500'>Born</span>
                  </div>
                  <p className='font-semibold'>{celebrity.birthDate}</p>
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <Icon icon='mdi:map-marker' width='24' height='24' className='text-primary' />
                    <span className='text-sm text-gray-500'>Birthplace</span>
                  </div>
                  <p className='font-semibold'>{celebrity.birthPlace}</p>
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <Icon icon='mdi:flag' width='24' height='24' className='text-primary' />
                    <span className='text-sm text-gray-500'>Nationality</span>
                  </div>
                  <p className='font-semibold'>{celebrity.nationality}</p>
                </div>

                {celebrity.height && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:human-male-height' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Height</span>
                    </div>
                    <p className='font-semibold'>{celebrity.height}</p>
                  </div>
                )}
              </div>

              {/* Short Biography */}
              <div className='bg-white rounded-2xl p-8 shadow-xl'>
                <h3 className='text-2xl font-bold mb-4'>Biography</h3>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  {celebrity.biography}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          {/* Tabs */}
          <div className='flex flex-wrap gap-4 mb-12 justify-center'>
            <button
              onClick={() => setActiveTab('biography')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'biography'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Life & Career
            </button>
            <button
              onClick={() => setActiveTab('filmography')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'filmography'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Filmography
            </button>
            <button
              onClick={() => setActiveTab('awards')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'awards'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Awards & Recognition
            </button>
          </div>

          {/* Tab Content */}
          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            {activeTab === 'biography' && (
              <div className='space-y-8'>
                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:book-open-page-variant' width='32' height='32' className='text-primary' />
                    Early Life
                  </h2>
                  <p className='text-lg text-gray-700 leading-relaxed'>
                    {celebrity.earlyLife}
                  </p>
                </div>

                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:star-circle' width='32' height='32' className='text-primary' />
                    Career
                  </h2>
                  <p className='text-lg text-gray-700 leading-relaxed'>
                    {celebrity.career}
                  </p>
                </div>

                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:heart' width='32' height='32' className='text-primary' />
                    Personal Life
                  </h2>
                  <p className='text-lg text-gray-700 leading-relaxed'>
                    {celebrity.personalLife}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'filmography' && (
              <div>
                <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
                  <Icon icon='mdi:movie-open' width='32' height='32' className='text-primary' />
                  Complete Filmography
                </h2>
                <div className='space-y-4'>
                  {celebrity.filmography.map((film, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-6 p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                      <div className='flex-shrink-0 text-center'>
                        <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg'>
                          {film.year.split('-')[0].slice(-2)}
                        </div>
                      </div>
                      <div className='flex-grow'>
                        <h3 className='text-xl font-bold mb-1'>{film.title}</h3>
                        <p className='text-gray-600 mb-2'>
                          <span className='font-semibold'>Role:</span> {film.role}
                        </p>
                        <div className='flex items-center gap-2'>
                          <span className='bg-white px-3 py-1 rounded-full text-sm font-semibold'>
                            {film.type}
                          </span>
                          <span className='text-sm text-gray-500'>{film.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'awards' && (
              <div>
                <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
                  <Icon icon='mdi:trophy' width='32' height='32' className='text-primary' />
                  Awards & Accolades
                </h2>
                <div className='space-y-4'>
                  {celebrity.awards.map((award, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-6 p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                      <div className='flex-shrink-0'>
                        <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center'>
                          <Icon icon='mdi:trophy-award' width='32' height='32' />
                        </div>
                      </div>
                      <div className='flex-grow'>
                        <div className='flex items-center gap-3 mb-2'>
                          <span className='bg-primary text-white px-4 py-1 rounded-full text-sm font-bold'>
                            {award.year}
                          </span>
                        </div>
                        <h3 className='text-xl font-bold mb-1'>{award.title}</h3>
                        <p className='text-gray-600 mb-1'>
                          <span className='font-semibold'>Category:</span> {award.category}
                        </p>
                        {award.work && (
                          <p className='text-sm text-gray-500'>
                            For: {award.work}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Section (placeholder) */}
      <section className='py-20 bg-grey'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Explore More Celebrities
          </h2>
          <div className='text-center'>
            <Link
              href='/celebrities'
              className='inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-darkmode transition'>
              View All Celebrities
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CelebrityDetailPage
