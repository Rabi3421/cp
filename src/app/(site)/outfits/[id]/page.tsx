import Link from 'next/link'
import Image from 'next/image'
import ImageGalleryClient from './ImageGalleryClient'
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
  const celebrityId = typeof outfit.celebrity === 'object' ? outfit.celebrity._id : outfit.celebrity

  // Fetch related outfits (by celebrity) and related celebrities for 'people also search for'
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  let otherOutfits: any[] = []
  let relatedCelebritiesList: any[] = []

  try {
    if (celebrityId) {
      const ro = await fetch(`${baseUrl}/api/outfits?celebrity=${celebrityId}&limit=8`, { next: { revalidate: 3600 } })
      if (ro.ok) {
        const roJson = await ro.json()
        otherOutfits = (roJson.data || []).filter((o: any) => String(o._id) !== String(outfit._id)).slice(0, 6)
      }
    }
  } catch (err) {
    console.error('Error fetching other outfits:', err)
  }

  try {
    if (celebritySlug) {
      const rc = await fetch(`${baseUrl}/api/celebrities/related?slug=${encodeURIComponent(celebritySlug)}&limit=6`, { next: { revalidate: 3600 } })
      if (rc.ok) {
        const rcJson = await rc.json()
        relatedCelebritiesList = rcJson.data || []
      }
    }
  } catch (err) {
    console.error('Error fetching related celebrities:', err)
  }

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
            {/* Left: Image Gallery */}
            <div className='relative'>
              {/* Client-side gallery with thumbnails */}
              {/* @ts-expect-error Async server -> client props */}
              <ImageGalleryClient images={outfit.images} featured={outfit.isFeatured} />
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

      {/* Other Outfits (related) */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-6'>Other Outfits</h2>
          {otherOutfits.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {otherOutfits.map((o: any) => (
                <Link key={o._id} href={`/outfits/${o.slug}`} className='group'>
                  <div className='bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
                    <div className='relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-2xl'>
                      <Image src={o.images?.[0] || '/images/placeholder.jpg'} alt={o.title} fill className='object-cover' />
                    </div>
                    <h3 className='text-lg font-bold mb-1 line-clamp-2'>{o.title}</h3>
                    <p className='text-sm text-gray-500 mb-3'>{o.event} • {o.designer}</p>
                    <div className='flex items-center justify-between'>
                      <span className='text-primary font-semibold'>View Details</span>
                      <span className='text-sm text-gray-400'>{o.year || ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='text-center'>
              <p className='text-gray-600 mb-6'>No related outfits found.</p>
              <Link href='/outfits' className='inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-darkmode transition'>
                Browse Outfits
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* People Also Search For - Related Celebrities */}
      <section className='py-16 bg-grey'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>People also search for</h2>
          {relatedCelebritiesList.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
              {relatedCelebritiesList.map((c: any) => (
                <Link key={c._id} href={`/celebrities/${c.slug}`} className='group'>
                  <div className='bg-white rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-2xl'>
                      <Image
                        src={c.profileImage || '/images/placeholder.jpg'}
                        alt={c.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <h3 className='text-sm font-semibold mb-1 line-clamp-2'>{c.name}</h3>
                    {c.occupation && (
                      <p className='text-xs text-gray-500 mb-2 line-clamp-1'>
                        {Array.isArray(c.occupation) ? c.occupation.join(', ') : c.occupation}
                      </p>
                    )}
                    <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                      <span className='text-primary text-xs font-semibold'>View Profile</span>
                      <span className='text-xs text-gray-400'>{/* optional meta */}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-600'>No similar celebrities found.</p>
          )}
        </div>
      </section>

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

