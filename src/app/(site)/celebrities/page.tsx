'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Celebrity } from '@/app/types/celebrity'
import { Icon } from '@iconify/react'

const CelebritiesPage = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCelebrities(data.CelebritiesData || [])
      } catch (error) {
        console.error('Error fetching celebrities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredCelebrities = celebrities.filter((celebrity) =>
    celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celebrity.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              celebrity profiles
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Discover Your Favorite Celebrities
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Explore in-depth profiles, filmography, awards, and exclusive insights about the world's most famous personalities.
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-12'>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon icon='mdi:magnify' width='24' height='24' />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-14 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white text-lg'
                placeholder='Search celebrities by name or occupation...'
                aria-label='Search celebrities'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Celebrities Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-80 bg-gray-200 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : filteredCelebrities.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:account-search' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No celebrities found</h3>
              <p className='text-gray-600'>Try adjusting your search query</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredCelebrities.map((celebrity) => (
                <Link
                  key={celebrity.id}
                  href={`/celebrities/${celebrity.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full h-80 mb-6 overflow-hidden rounded-2xl'>
                      <Image
                        src={celebrity.image}
                        alt={celebrity.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {celebrity.category}
                      </div>
                    </div>
                    
                    <h3 className='text-2xl font-bold mb-2 group-hover:text-primary transition'>
                      {celebrity.name}
                    </h3>
                    
                    <p className='text-gray-600 mb-4'>
                      {celebrity.occupation}
                    </p>
                    
                    <div className='flex items-center gap-2 text-sm text-gray-500 mb-4'>
                      <Icon icon='mdi:map-marker' width='16' height='16' />
                      <span>{celebrity.birthPlace}</span>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <span className='text-primary font-semibold flex items-center gap-1'>
                        View Profile
                        <Icon icon='tabler:chevron-right' width='20' height='20' />
                      </span>
                      
                      {celebrity.socialMedia && (
                        <div className='flex gap-2'>
                          {celebrity.socialMedia.instagram && (
                            <div className='w-8 h-8 bg-grey rounded-full flex items-center justify-center'>
                              <Icon icon='mdi:instagram' width='16' height='16' />
                            </div>
                          )}
                          {celebrity.socialMedia.twitter && (
                            <div className='w-8 h-8 bg-grey rounded-full flex items-center justify-center'>
                              <Icon icon='mdi:twitter' width='16' height='16' />
                            </div>
                          )}
                        </div>
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

export default CelebritiesPage
