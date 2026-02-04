import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Icon } from '@iconify/react'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/outfits/${id}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return {
        title: 'Outfit Not Found',
        description: 'The outfit you are looking for does not exist.',
      }
    }

    const { data: outfit } = await res.json()
    const celebrityName = typeof outfit.celebrity === 'object' ? outfit.celebrity.name : ''

    return {
      title: outfit.seo?.metaTitle || `${outfit.title} - ${celebrityName} Outfit Details`,
      description: outfit.seo?.metaDescription || outfit.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      keywords: outfit.seo?.metaKeywords || outfit.tags,
      openGraph: {
        title: outfit.seo?.ogTitle || outfit.title,
        description: outfit.seo?.ogDescription || outfit.description?.replace(/<[^>]*>/g, '').slice(0, 160),
        type: 'article',
        url: outfit.seo?.ogUrl || `${baseUrl}/outfits/${outfit.slug}`,
        images: outfit.seo?.ogImages?.length > 0 ? outfit.seo.ogImages : outfit.images,
        siteName: 'Celebrity Persona',
      },
      twitter: {
        card: 'summary_large_image',
        title: outfit.seo?.twitterTitle || outfit.title,
        description: outfit.seo?.twitterDescription || outfit.description?.replace(/<[^>]*>/g, '').slice(0, 160),
        images: outfit.seo?.twitterImage ? [outfit.seo.twitterImage] : [outfit.images[0]],
      },
    }
  } catch (error) {
    return {
      title: 'Outfit Details',
      description: 'Explore celebrity outfit details and fashion inspiration.',
    }
  }
}

async function getOutfit(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/outfits/${slug}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return null
    }

    const { data } = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching outfit:', error)
    return null
  }
}

const OutfitDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const outfit = await getOutfit(id)

  if (!outfit) {
    notFound()
  }

  const celebrityName = typeof outfit.celebrity === 'object' ? outfit.celebrity.name : ''
  const celebritySlug = typeof outfit.celebrity === 'object' ? outfit.celebrity.slug : ''

  return (
    <main>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: outfit.title,
            description: outfit.description?.replace(/<[^>]*>/g, ''),
            image: outfit.images,
            brand: outfit.brand || outfit.designer,
            offers: outfit.price ? {
              '@type': 'Offer',
              price: outfit.price.replace(/[^0-9.]/g, ''),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: outfit.purchaseLink,
            } : undefined,
          }),
        }}
      />

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
                priority
              />
              {outfit.isFeatured && (
                <div className='absolute top-4 right-4 bg-yellow-500 text-white p-3 rounded-full'>
                  <Icon icon='mdi:star' width='24' height='24' />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              {outfit.event && (
                <div className='bg-primary/15 inline-block px-5 py-2 rounded-full mb-4'>
                  <span className='text-primary font-bold'>{outfit.event}</span>
                </div>
              )}

              <h1 className='text-4xl md:text-5xl font-bold mb-4'>{outfit.title}</h1>
              
              {celebrityName && celebritySlug && (
                <Link 
                  href={`/celebrities/${celebritySlug}`} 
                  className='inline-flex items-center gap-2 text-xl text-gray-600 hover:text-primary transition mb-4'
                >
                  <Icon icon='mdi:account' width='24' height='24' />
                  {celebrityName}
                </Link>
              )}

              <div className='flex items-center gap-6 mb-6'>
                {outfit.year && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Icon icon='mdi:calendar' width='20' height='20' />
                    <span>{outfit.year}</span>
                  </div>
                )}
                {outfit.price && (
                  <div className='flex items-center gap-2'>
                    <Icon icon='mdi:tag' width='20' height='20' className='text-primary' />
                    <span className='text-2xl font-bold text-primary'>{outfit.price}</span>
                  </div>
                )}
              </div>

              {outfit.description && (
                <div 
                  className='prose prose-lg max-w-none mb-8'
                  dangerouslySetInnerHTML={{ __html: outfit.description }}
                />
              )}

              {/* Stats */}
              <div className='flex items-center gap-6 mb-8'>
                {outfit.viewCount > 0 && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Icon icon='mdi:eye' width='20' height='20' />
                    <span>{outfit.viewCount}</span>
                  </div>
                )}
                {outfit.likesCount > 0 && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Icon icon='mdi:heart' width='20' height='20' />
                    <span>{outfit.likesCount}</span>
                  </div>
                )}
                {outfit.shareCount > 0 && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Icon icon='mdi:share' width='20' height='20' />
                    <span>{outfit.shareCount}</span>
                  </div>
                )}
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
              {outfit.tags && outfit.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-8'>
                  {outfit.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className='bg-grey px-4 py-2 rounded-full text-sm font-semibold'>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

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
      {outfit.images && outfit.images.length > 1 && (
        <section className='py-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-12 text-center'>More Photos</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {outfit.images.slice(1).map((image: string, index: number) => (
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

