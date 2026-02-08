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
      cache: 'no-store', // Disable caching for testing
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
      cache: 'no-store', // Disable caching for testing
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
  console.log('Fetched celebrity data:', celebrity)
  if (!celebrity) {
    notFound()
  }

  // Format arrays for display
  const professions = Array.isArray(celebrity.profession) 
    ? celebrity.profession.join(', ') 
    : celebrity.profession || celebrity.occupation

  // Prepare a list for rendering badges under the name
  const professionList = Array.isArray(celebrity.profession)
    ? celebrity.profession
    : celebrity.profession
      ? celebrity.profession.split(',').map((s: string) => s.trim())
      : celebrity.occupation
        ? celebrity.occupation.split(',').map((s: string) => s.trim())
        : []

  const educationList = Array.isArray(celebrity.education) 
    ? celebrity.education 
    : celebrity.education ? [celebrity.education] : []

  // Fetch related outfits for this celebrity (server-side)
  let relatedOutfits: any[] = []
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const q = new URLSearchParams({ celebrity: celebrity._id, limit: '6' })
    const res = await fetch(`${baseUrl}/api/outfits?${q.toString()}`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) relatedOutfits = data.data
    }
  } catch (err) {
    console.error('Error fetching related outfits:', err)
  }

  // Fetch related celebrities (people also search for)
  let relatedCelebritiesList: any[] = []
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const q2 = new URLSearchParams({ slug: celebrity.slug, limit: '6' })
    const res2 = await fetch(`${baseUrl}/api/celebrities/related?${q2.toString()}`, { next: { revalidate: 3600 } })
    if (res2.ok) {
      const d2 = await res2.json()
      if (d2.success && Array.isArray(d2.data)) relatedCelebritiesList = d2.data
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
      <section className='relative overflow-hidden bg-grey pt-32 pb-16'>
        <div className='container mx-auto max-w-7xl px-4'>
          <Link
            href='/celebrities'
            className='inline-flex items-center gap-2 text-primary font-semibold mb-2 mt-1 bg-white border border-gray-200 px-2 py-1 rounded-md hover:bg-primary/5 transition relative z-10'>
            <Icon icon='tabler:chevron-left' width='16' height='16' />
            Back to Celebrities
          </Link>

          {/* Mobile: show name + badges first, desktop will show name inside left column */}
          <div className='block lg:hidden mb-4'>
            <h1 className='text-3xl font-bold mb-3'>{celebrity.name}</h1>
            {professionList && professionList.length > 0 && (
              <div className='flex flex-wrap items-center gap-2'>
                {professionList.map((p: string, i: number) => (
                  <span key={i} className='inline-flex items-center text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full'>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            {/* Left: Info (primary content) */}
            <div className='lg:col-span-2 order-2 lg:order-1'>
              <div className='hidden lg:block'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>{celebrity.name}</h1>

                {/* Render professions/categories as small badges */}
                {professionList && professionList.length > 0 && (
                  <div className='flex flex-wrap items-center gap-2 mb-8'>
                    {professionList.map((p: string, i: number) => (
                      <span key={i} className='inline-flex items-center text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full'>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Introduction (no heading) */}
              {celebrity.introduction && (
                <div className='bg-white rounded-2xl p-8 shadow-xl'>
                  <div 
                    className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none break-words whitespace-normal'
                    dangerouslySetInnerHTML={{ __html: celebrity.introduction }}
                  />
                  
                  {/* Add a gallery image after introduction if available */}
                  {/* {celebrity.galleryImages && celebrity.galleryImages.length > 0 && (
                    <div className='mt-8 -mx-8 sm:-mx-4 md:mx-0'>
                      <div className='relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg'>
                        <Image
                          src={celebrity.galleryImages[0]}
                          alt={`${celebrity.name} - Introduction Image`}
                          fill
                          className='object-cover'
                        />
                      </div>
                    </div>
                  )} */}
                </div>
              )}

              {/* Quick Links (blue) + Contents box - moved below introduction */}
              <div className='mt-8 mb-8'>
                <div className='bg-primary/10 rounded-2xl p-6 flex items-center gap-4 mb-6'>
                  <div className='bg-primary/20 p-3 rounded-md'>
                    <Icon icon='mdi:book-open-page-variant' width='20' height='20' className='text-primary' />
                  </div>
                  <div>
                    <h4 className='font-semibold'>Quick Links</h4>
                    <p className='text-sm text-gray-600'>Jump to important sections of the article</p>
                  </div>
                </div>

                <div>
                  <div className='bg-white rounded-2xl p-6 shadow-lg'>
                    <h4 className='font-semibold mb-4'>Contents</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
                      <div className='space-y-2'>
                        <a href='#early-life' className='block hover:text-primary'>1 Early life</a>
                        <a href='#career' className='block hover:text-primary'>2 Career</a>
                        <a href='#achievements' className='block hover:text-primary'>3 Achievements</a>
                        <a href='#awards' className='block hover:text-primary'>4 Awards</a>
                        <a href='#works' className='block hover:text-primary'>5 Notable works</a>
                      </div>
                      <div className='space-y-2'>
                        <a href='#filmography' className='block hover:text-primary'>6 Filmography</a>
                        <a href='#personal-life' className='block hover:text-primary'>7 Personal life</a>
                        <a href='#education' className='block hover:text-primary'>8 Education</a>
                        <a href='#physical-attributes' className='block hover:text-primary'>9 Physical attributes</a>
                        <a href='#extras' className='block hover:text-primary'>10 More</a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Featured image (full-bleed, taller) */}
                <div className='mt-6 -mx-4 sm:-mx-6 md:-mx-8 lg:mx-0'>
                  <div className='relative w-full h-64 md:h-96 lg:h-[520px] rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src={celebrity.coverImage || '/images/placeholder.jpg'}
                      alt={`${celebrity.name} - featured`}
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image + Quick facts (sticky card) */}
            <div className='lg:col-span-1 order-1 lg:order-2'>
              <div className='sticky top-24 space-y-6'>
                <div className='relative w-full h-96 lg:h-auto lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl'>
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

                {/* Sidebar: Quick Facts card (image above, facts below) */}
                <div className='bg-white rounded-2xl p-6 shadow-xl'>
                  <h3 className='text-xl font-bold mb-4'>{celebrity.name}</h3>
                  <div className='text-sm text-gray-700 space-y-3'>
                    {celebrity.born && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Born:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.born}</span>
                      </div>
                    )}

                    {celebrity.birthPlace && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Birth Place:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.birthPlace}</span>
                      </div>
                    )}

                    {celebrity.age && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Age:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.age}</span>
                      </div>
                    )}

                    {celebrity.nationality && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Nationality:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.nationality}</span>
                      </div>
                    )}

                    {(celebrity.occupation || celebrity.profession) && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Occupation:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{professions}</span>
                      </div>
                    )}

                    {celebrity.yearsActive && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Years active:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.yearsActive}</span>
                      </div>
                    )}

                    {celebrity.height && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Height:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.height}</span>
                      </div>
                    )}

                    {celebrity.netWorth && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Net Worth:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.netWorth}</span>
                      </div>
                    )}
                    {/* Family details moved here */}
                    {celebrity.spouse && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Spouse:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.spouse}</span>
                      </div>
                    )}

                    {celebrity.children && celebrity.children.length > 0 && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Children:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.children.join(', ')}</span>
                      </div>
                    )}

                    {celebrity.parents && celebrity.parents.length > 0 && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Parents:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.parents.join(', ')}</span>
                      </div>
                    )}

                    {celebrity.siblings && celebrity.siblings.length > 0 && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Siblings:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.siblings.join(', ')}</span>
                      </div>
                    )}

                    {/* Education (moved to sidebar) */}
                    {educationList && educationList.length > 0 && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Education:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{educationList.join(', ')}</span>
                      </div>
                    )}

                    {/* Physical attributes (moved to sidebar) */}
                    {celebrity.height && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Height:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.height}</span>
                      </div>
                    )}
                    {celebrity.weight && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Weight:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.weight}</span>
                      </div>
                    )}
                    {celebrity.eyeColor && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Eye Color:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.eyeColor}</span>
                      </div>
                    )}
                    {celebrity.hairColor && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Hair Color:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.hairColor}</span>
                      </div>
                    )}
                    {celebrity.bodyMeasurements && (
                      <div className='flex items-start justify-between'>
                        <span className='text-gray-500'>Body Measurements:</span>
                        <span className='font-semibold text-right break-words max-w-[65%] whitespace-normal'>{celebrity.bodyMeasurements}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow / Stats card */}
                { (celebrity.socialMedia && Object.values(celebrity.socialMedia).some(Boolean)) || celebrity.viewCount > 0 ? (
                  <div className='bg-white rounded-2xl p-6 shadow-xl'>
                    {celebrity.socialMedia && Object.values(celebrity.socialMedia).some(Boolean) && (
                      <>
                        <h4 className='font-semibold mb-3'>Follow</h4>
                        <div className='flex flex-wrap gap-3 mb-4'>
                          {celebrity.socialMedia.instagram && (
                            <a href={celebrity.socialMedia.instagram} target='_blank' rel='noreferrer' className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition text-sm font-semibold'>
                              <Icon icon='mdi:instagram' width='18' height='18' /> Instagram
                            </a>
                          )}
                          {celebrity.socialMedia.youtube && (
                            <a href={celebrity.socialMedia.youtube} target='_blank' rel='noreferrer' className='flex items-center gap-2 bg-grey hover:bg-primary hover:text-white px-4 py-2 rounded-full transition text-sm font-semibold'>
                              <Icon icon='mdi:youtube' width='18' height='18' /> YouTube
                            </a>
                          )}
                        </div>
                      </>
                    )}

                    {celebrity.viewCount > 0 && (
                      <div>
                        <h4 className='font-semibold mb-3'>Profile Stats</h4>
                        <div className='text-sm text-gray-700 space-y-2'>
                          <div className='flex items-center justify-between'><span>Views</span><span className='font-bold'>{celebrity.viewCount.toLocaleString()}</span></div>
                          {celebrity.popularityScore > 0 && <div className='flex items-center justify-between'><span>Popularity</span><span className='font-bold'>{celebrity.popularityScore}/10</span></div>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null }

              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Pass celebrity data to client component for interactive tabs */}
      <CelebrityDetailClient celebrity={celebrity} educationList={educationList} />

      {/* Gallery Section */}
      {/* {celebrity.galleryImages && celebrity.galleryImages.length > 0 && (
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
      )} */}

      {/* Related Outfits Section (for this celebrity) */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-6'>
            Outfits featuring {celebrity.name}
          </h2>
          {relatedOutfits.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {relatedOutfits.map((outfit: any) => (
                <Link key={outfit._id} href={`/outfits/${outfit.slug}`} className='group'>
                  <div className='bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
                    <div className='relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-2xl'>
                      <Image src={outfit.images?.[0] || '/images/placeholder.jpg'} alt={outfit.title} fill className='object-cover' />
                    </div>
                    <h3 className='text-lg font-bold mb-1 line-clamp-2'>{outfit.title}</h3>
                    <p className='text-sm text-gray-500 mb-3'>{outfit.event} • {outfit.designer}</p>
                    <div className='flex items-center justify-between'>
                      <span className='text-primary font-semibold'>View Details</span>
                      <span className='text-sm text-gray-400'>{outfit.year || ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='text-center'>
              <p className='text-gray-600 mb-6'>No outfits found for this celebrity yet.</p>
              <Link href='/outfits' className='inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-darkmode transition'>
                Browse Outfits
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* People Also Search For - Related Celebrities (outfit-style cards) */}
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
    </main>
  )
}

export default CelebrityDetailPage
