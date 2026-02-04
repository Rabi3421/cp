'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Outfit } from '@/app/types/outfit'
import { Icon } from '@iconify/react'

const OutfitDetailPage = () => {
  const params = useParams()
  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const foundOutfit = data.OutfitsData?.find(
          (o: Outfit) => o._id === params.id
        )
        setOutfit(foundOutfit || null)
      } catch (error) {
        console.error('Error fetching outfit:', error)
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

  if (!outfit) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4 text-center'>
          <Icon icon='mdi:hanger' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h1 className='text-3xl font-bold mb-4'>Outfit Not Found</h1>
          <Link href='/outfits' className='text-primary font-semibold hover:underline'>
            Back to Outfits
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <Link
            href='/outfits'
            className='inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:underline'>
            <Icon icon='tabler:chevron-left' width='20' height='20' />
            Back to Outfits
          </Link>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Left: Image */}
            <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-xl'>
              <Image
                src={outfit.images[0] || '/images/placeholder.jpg'}
                alt={outfit.title}
                fill
                className='object-cover'
              />
            </div>

            {/* Right: Info */}
            <div>
              <div className='bg-primary/15 inline-block px-5 py-2 rounded-full mb-4'>
                <span className='text-primary font-bold'>{outfit.event}</span>
              </div>

              <h1 className='text-4xl md:text-5xl font-bold mb-4'>{outfit.title}</h1>
              
              {typeof outfit.celebrity === 'object' && (
                <Link 
                  href={`/celebrities/${outfit.celebrity.slug}`} 
                  className='inline-flex items-center gap-2 text-xl text-gray-600 hover:text-primary transition mb-4'
                >
                  <Icon icon='mdi:account' width='24' height='24' />
                  {outfit.celebrity.name}
                </Link>
              )}

              <div className='flex items-center gap-6 mb-6'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Icon icon='mdi:calendar' width='20' height='20' />
                  <span>{outfit.year}</span>
                </div>
                {outfit.price && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:tag' width='20' height='20' className='text-primary' />
                    <span className='text-2xl font-bold text-primary'>{outfit.price}</span>
                  </div>
                )}
              </div>

              <div 
                className='prose prose-lg max-w-none mb-8'
                dangerouslySetInnerHTML={{ __html: outfit.description }}
              />

              {/* Stats */}
              <div className='flex items-center gap-6 mb-8'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Icon icon='mdi:eye' width='20' height='20' />
                  <span>{outfit.viewCount}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Icon icon='mdi:heart' width='20' height='20' />
                  <span>{outfit.likesCount}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Icon icon='mdi:share' width='20' height='20' />
                  <span>{outfit.shareCount}</span>
                </div>
              </div>

              {/* Details */}
              <div className='space-y-3 mb-8'>
                {outfit.designer && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:pencil-ruler' width='20' height='20' className='text-primary' />
                    <span className='font-semibold'>Designer:</span>
                    <span>{outfit.designer}</span>
                  </div>
                )}
                {outfit.brand && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:tag-text' width='20' height='20' className='text-primary' />
                    <span className='font-semibold'>Brand:</span>
                    <span>{outfit.brand}</span>
                  </div>
                )}
                {outfit.category && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:shape' width='20' height='20' className='text-primary' />
                    <span className='font-semibold'>Category:</span>
                    <span>{outfit.category}</span>
                  </div>
                )}
                {outfit.color && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:palette' width='20' height='20' className='text-primary' />
                    <span className='font-semibold'>Color:</span>
                    <span>{outfit.color}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className='flex flex-wrap gap-2 mb-8'>
                {outfit.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='bg-grey px-4 py-2 rounded-full text-sm font-semibold'>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Purchase Link */}
              {outfit.purchaseLink && (
                <a
                  href={outfit.purchaseLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-darkmode transition'>
                  <Icon icon='mdi:shopping' width='24' height='24' />
                  Shop This Look
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {outfit.images.length > 1 && (
        <section className='py-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-12 text-center'>More Photos</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {outfit.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className='relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow'>
                  <Image
                    src={image}
                    alt={`${outfit.title} - Image ${index + 2}`}
                    fill
                    className='object-cover'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Section */}
      <section className='py-20 bg-grey'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            More Celebrity Outfits
          </h2>
          <div className='text-center'>
            <Link
              href='/outfits'
              className='inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-darkmode transition'>
              View All Outfits
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default OutfitDetailPage
