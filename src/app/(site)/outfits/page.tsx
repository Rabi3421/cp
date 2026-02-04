'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Outfit } from '@/app/types/outfit'
import { Icon } from '@iconify/react'

const OutfitsPage = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setOutfits(data.OutfitsData || [])
      } catch (error) {
        console.error('Error fetching outfits:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredOutfits = outfits.filter((outfit) => {
    const celebrityName = typeof outfit.celebrity === 'object' 
      ? outfit.celebrity.name 
      : outfit.celebrity
    return (
      outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      celebrityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.event.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              outfit decode
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Decode Celebrity Style
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Get the exact breakdown of your favorite celebrity outfits. Shop similar styles and recreate iconic looks.
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto'>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon icon='mdi:magnify' width='24' height='24' />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-14 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white text-lg'
                placeholder='Search by celebrity, event, or style...'
                aria-label='Search outfits'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Outfits Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-96 bg-gray-200 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : filteredOutfits.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:hanger' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No outfits found</h3>
              <p className='text-gray-600'>Try adjusting your search query</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {filteredOutfits.map((outfit) => (
                <Link
                  key={outfit._id}
                  href={`/outfits/${outfit._id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full h-96 mb-6 overflow-hidden rounded-2xl'>
                      <Image
                        src={outfit.images[0] || '/images/placeholder.jpg'}
                        alt={outfit.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {outfit.event}
                      </div>
                      {outfit.price && (
                        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur text-darkmode px-4 py-2 rounded-full text-sm font-bold'>
                          {outfit.price}
                        </div>
                      )}
                    </div>
                    
                    <h3 className='text-2xl font-bold mb-2 group-hover:text-primary transition'>
                      {outfit.title}
                    </h3>
                    
                    <div className='flex items-center gap-2 mb-4'>
                      <Icon icon='mdi:account' width='20' height='20' className='text-gray-500' />
                      <span className='text-gray-600 font-semibold'>
                        {typeof outfit.celebrity === 'object' ? outfit.celebrity.name : outfit.celebrity}
                      </span>
                    </div>
                    
                    <div 
                      className='text-gray-600 mb-4 line-clamp-2'
                      dangerouslySetInnerHTML={{ __html: outfit.description }}
                    />
                    
                    <div className='flex items-center justify-between'>
                      <span className='text-primary font-semibold flex items-center gap-1'>
                        View Outfit
                        <Icon icon='tabler:chevron-right' width='20' height='20' />
                      </span>
                      
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Icon icon='mdi:image-multiple' width='16' height='16' />
                        <span>{outfit.images.length} photos</span>
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

export default OutfitsPage
