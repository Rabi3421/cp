import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Icon } from '@iconify/react'
import CelebrityDetailClient from './CelebrityDetailClient'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/celebrities/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      return {
        title: 'Celebrity Not Found',
        description: 'The celebrity profile you are looking for does not exist.',
      }
    }

    const { data: celebrity } = await res.json()

    return {
      title: celebrity.seo?.metaTitle || `${celebrity.name} - Biography, Career & Personal Life`,
      description: celebrity.seo?.metaDescription || `Learn about ${celebrity.name}, ${celebrity.occupation}. Explore biography, career, awards, and personal life.`,
      keywords: celebrity.seo?.metaKeywords || celebrity.tags,
      openGraph: {
        title: celebrity.seo?.ogTitle || celebrity.name,
        description: celebrity.seo?.ogDescription || celebrity.introduction?.replace(/<[^>]*>/g, '').slice(0, 160),
        type: celebrity.seo?.ogType || 'profile',
        url: celebrity.seo?.ogUrl || `${baseUrl}/celebrities/${celebrity.slug}`,
        images: celebrity.seo?.ogImages?.length > 0 ? celebrity.seo.ogImages : [celebrity.profileImage],
        siteName: celebrity.seo?.ogSiteName || 'Celebrity Persona',
        locale: celebrity.seo?.ogLocale || 'en_US',
      },
      twitter: {
        card: celebrity.seo?.twitterCard || 'summary_large_image',
        title: celebrity.seo?.twitterTitle || celebrity.name,
        description: celebrity.seo?.twitterDescription || celebrity.introduction?.replace(/<[^>]*>/g, '').slice(0, 160),
        images: celebrity.seo?.twitterImage ? [celebrity.seo.twitterImage] : [celebrity.profileImage],
        site: celebrity.seo?.twitterSite,
        creator: celebrity.seo?.twitterCreator,
      },
      robots: {
        index: !celebrity.seo?.noindex,
        follow: !celebrity.seo?.nofollow,
      },
      alternates: {
        canonical: celebrity.seo?.canonicalUrl || `${baseUrl}/celebrities/${celebrity.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Celebrity Profile',
      description: 'Explore celebrity biography, career, and personal life.',
    }
  }
}

async function getCelebrity(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/celebrities/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      return null
    }

    const { data } = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching celebrity:', error)
    return null
  }
}

const CelebrityDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const celebrity = await getCelebrity(id)

  if (!celebrity) {
    notFound()
  }

  // Format arrays for display
  const professions = Array.isArray(celebrity.profession) 
    ? celebrity.profession.join(', ') 
    : celebrity.profession || celebrity.occupation

  const educationList = Array.isArray(celebrity.education) 
    ? celebrity.education 
    : celebrity.education ? [celebrity.education] : []

  return (
    <main>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: celebrity.name,
            birthDate: celebrity.born,
            birthPlace: celebrity.birthPlace,
            nationality: celebrity.nationality,
            jobTitle: professions,
            image: celebrity.profileImage,
            description: celebrity.introduction?.replace(/<[^>]*>/g, ''),
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/celebrities/${celebrity.slug}`,
            sameAs: [
              celebrity.socialMedia?.instagram,
              celebrity.socialMedia?.twitter,
              celebrity.socialMedia?.facebook,
              celebrity.socialMedia?.youtube,
            ].filter(Boolean),
          }),
        }}
      />

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
                  src={celebrity.profileImage || celebrity.coverImage || '/images/placeholder.jpg'}
                  alt={celebrity.name}
                  fill
                  className='object-cover'
                  priority
                />
                {celebrity.isFeatured && (
                  <div className='absolute top-4 right-4 bg-yellow-500 text-white p-3 rounded-full'>
                    <Icon icon='mdi:star' width='24' height='24' />
                  </div>
                )}
                {celebrity.isVerified && (
                  <div className='absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-full'>
                    <Icon icon='mdi:check-decagram' width='24' height='24' />
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              {celebrity.socialMedia && Object.values(celebrity.socialMedia).some(v => v) && (
                <div className='mt-6 bg-white rounded-2xl p-6 shadow-xl'>
                  <h4 className='font-semibold mb-4'>Follow {celebrity.name}</h4>
                  <div className='flex flex-wrap gap-3'>
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
                    {celebrity.socialMedia.facebook && (
                      <a
                        href={celebrity.socialMedia.facebook}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition'>
                        <Icon icon='mdi:facebook' width='20' height='20' />
                        <span className='text-sm font-semibold'>Facebook</span>
                      </a>
                    )}
                    {celebrity.socialMedia.youtube && (
                      <a
                        href={celebrity.socialMedia.youtube}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition'>
                        <Icon icon='mdi:youtube' width='20' height='20' />
                        <span className='text-sm font-semibold'>YouTube</span>
                      </a>
                    )}
                    {celebrity.socialMedia.website && (
                      <a
                        href={celebrity.socialMedia.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition'>
                        <Icon icon='mdi:web' width='20' height='20' />
                        <span className='text-sm font-semibold'>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              {celebrity.viewCount > 0 && (
                <div className='mt-6 bg-white rounded-2xl p-6 shadow-xl'>
                  <h4 className='font-semibold mb-4'>Profile Stats</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-600'>Views</span>
                      <span className='font-bold'>{celebrity.viewCount.toLocaleString()}</span>
                    </div>
                    {celebrity.popularityScore > 0 && (
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-600'>Popularity</span>
                        <span className='font-bold'>{celebrity.popularityScore}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className='lg:col-span-2'>
              {celebrity.categories && celebrity.categories.length > 0 && (
                <div className='bg-primary/15 inline-block px-5 py-2 rounded-full mb-4'>
                  <span className='text-primary font-bold'>{celebrity.categories[0]}</span>
                </div>
              )}

              <h1 className='text-4xl md:text-5xl font-bold mb-4'>{celebrity.name}</h1>
              <p className='text-xl text-gray-600 mb-8'>{professions}</p>

              {/* Quick Info Grid */}
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mb-8'>
                {celebrity.born && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:cake-variant' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Born</span>
                    </div>
                    <p className='font-semibold'>{celebrity.born}</p>
                    {celebrity.age && <p className='text-sm text-gray-500'>Age: {celebrity.age}</p>}
                  </div>
                )}

                {celebrity.birthPlace && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:map-marker' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Birthplace</span>
                    </div>
                    <p className='font-semibold'>{celebrity.birthPlace}</p>
                  </div>
                )}

                {celebrity.nationality && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:flag' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Nationality</span>
                    </div>
                    <p className='font-semibold'>{celebrity.nationality}</p>
                  </div>
                )}

                {celebrity.height && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:human-male-height' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Height</span>
                    </div>
                    <p className='font-semibold'>{celebrity.height}</p>
                  </div>
                )}

                {celebrity.yearsActive && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:calendar-clock' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Years Active</span>
                    </div>
                    <p className='font-semibold'>{celebrity.yearsActive}</p>
                  </div>
                )}

                {celebrity.netWorth && (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon icon='mdi:cash' width='24' height='24' className='text-primary' />
                      <span className='text-sm text-gray-500'>Net Worth</span>
                    </div>
                    <p className='font-semibold'>{celebrity.netWorth}</p>
                  </div>
                )}
              </div>

              {/* Introduction */}
              {celebrity.introduction && (
                <div className='bg-white rounded-2xl p-8 shadow-xl'>
                  <h3 className='text-2xl font-bold mb-4'>Introduction</h3>
                  <div 
                    className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: celebrity.introduction }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pass celebrity data to client component for interactive tabs */}
      <CelebrityDetailClient celebrity={celebrity} educationList={educationList} />

      {/* Gallery Section */}
      {celebrity.galleryImages && celebrity.galleryImages.length > 0 && (
        <section className='py-20 bg-grey'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
              <Icon icon='mdi:image-multiple' width='32' height='32' className='text-primary' />
              Photo Gallery
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {celebrity.galleryImages.slice(0, 12).map((image: string, index: number) => (
                <div key={index} className='relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group'>
                  <Image
                    src={image}
                    alt={`${celebrity.name} - Photo ${index + 1}`}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Section */}
      <section className='py-20 bg-white'>
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
