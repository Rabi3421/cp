"use client"
import { Icon } from '@iconify/react'
import Image from 'next/image'

interface CelebrityDetailClientProps {
  celebrity: any
  educationList: string[]
}

// Helper function to insert gallery images as a grouped grid (up to 4 images)
const insertGalleryImagesInContent = (htmlContent: string, galleryImages: string[], celebrityName: string) => {
  if (!galleryImages || galleryImages.length === 0) return htmlContent

  // Split content by paragraphs
  const paragraphs = htmlContent.split('</p>')
  const totalParagraphs = paragraphs.length - 1 // Last split is empty when content ends with </p>

  if (totalParagraphs < 2) return htmlContent // Not enough content to insert images

  let result = ''
  let imageIndex = 0

  paragraphs.forEach((paragraph, index) => {
    if (paragraph.trim()) {
      result += paragraph + '</p>'

      // Insert a grouped grid of images after every 3 paragraphs (if available)
      const shouldInsertGalleryGrid = (index + 1) % 3 === 0 && imageIndex < galleryImages.length

      if (shouldInsertGalleryGrid && index < totalParagraphs - 1) {
        // Take up to 4 images for this group
        const imagesToShow = galleryImages.slice(imageIndex, imageIndex + 4)

        result += `
          <div class="my-10 -mx-4 sm:mx-0">
            <div class="relative bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <div class="absolute -top-6 right-6 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md transform rotate-6 shadow-lg">AD</div>

              <div class="flex flex-col md:flex-row items-stretch gap-6">
                <div class="md:w-1/3 lg:w-1/4 bg-primary/5 rounded-lg p-4 flex flex-col justify-center">
                  <div class="text-sm uppercase text-gray-500 tracking-wider">Promoted</div>
                  <div class="mt-2 text-lg font-bold text-gray-900">This is my ad section</div>
                  <p class="mt-2 text-sm text-gray-600">Hand-picked visuals and sponsored content curated to match this article.</p>
                  <div class="mt-4">
                    <a href="#gallery" class="relative inline-flex items-center rounded-full p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-shadow duration-300">
                      <span class="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
                        <svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4 text-indigo-600' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                          <path fillRule='evenodd' d='M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z' clipRule='evenodd' />
                        </svg>
                        <span>Explore</span>
                      </span>
                    </a>
                  </div>
                </div>

                <div class="md:flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                  ${imagesToShow
                    .map((img, i) => `
                      <div class="relative rounded-xl overflow-hidden bg-white/60 shadow-sm">
                        <img src="${img}" alt="${celebrityName} - Gallery ${imageIndex + i + 1}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                        <div class="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-1 rounded">Ad Image</div>
                      </div>
                    `)
                    .join('')}
                </div>
              </div>
            </div>
          </div>
        `

        imageIndex += imagesToShow.length
      }
    }
  })

  return result
}

const CelebrityDetailClient = ({ celebrity, educationList }: CelebrityDetailClientProps) => {
  // Check if we have content for each section
  const hasBiography = Boolean(celebrity.earlyLife || celebrity.career)
  const hasAchievements = Boolean(
    (celebrity.achievements && celebrity.achievements.length > 0) ||
    (celebrity.awards && celebrity.awards.length > 0) ||
    (celebrity.works && celebrity.works.length > 0) ||
    (celebrity.movies && celebrity.movies.length > 0)
  )
  const hasPersonalLife = Boolean(
    celebrity.personalLife || celebrity.spouse || (celebrity.children && celebrity.children.length > 0) ||
    (celebrity.parents && celebrity.parents.length > 0) || educationList.length > 0
  )

  // If no content for any section, don't render anything
  if (!hasBiography && !hasAchievements && !hasPersonalLife) {
    return null
  }

  return (
    <section className='py-20'>
      <div className='container mx-auto max-w-7xl px-4'>
        {/* Render sections in order for SEO: Life & Career -> Achievements & Awards -> Personal Life */}
        <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl space-y-12'>
          {/* Life & Career */}
          {celebrity.earlyLife && (
            <div>
              <h2 id='early-life' className='text-3xl font-bold mb-4 flex items-center gap-3'>
                <Icon icon='mdi:book-open-page-variant' width='32' height='32' className='text-primary' />
                Early Life
              </h2>
              <div
                className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none break-words whitespace-normal'
                dangerouslySetInnerHTML={{ 
                  __html: insertGalleryImagesInContent(
                    celebrity.earlyLife,
                    celebrity.galleryImages?.slice(0, 4) || [],
                    celebrity.name
                  ) 
                }}
              />
            </div>
          )}

          {/* Personal Life (moved directly after Early Life) */}
          {celebrity.personalLife && (
            <div>
              <h2 id='personal-life' className='text-3xl font-bold mb-4 flex items-center gap-3'>
                <Icon icon='mdi:heart' width='32' height='32' className='text-primary' />
                Personal Life
              </h2>
              <div
                className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none break-words whitespace-normal'
                dangerouslySetInnerHTML={{ 
                  __html: insertGalleryImagesInContent(
                    celebrity.personalLife,
                    celebrity.galleryImages?.slice(4, 8) || [],
                    celebrity.name
                  ) 
                }}
              />
            </div>
          )}

          {/* Family information moved to sidebar quick facts */}

          {celebrity.career && (
            <div>
              <h2 id='career' className='text-3xl font-bold mb-4 flex items-center gap-3'>
                <Icon icon='mdi:star-circle' width='32' height='32' className='text-primary' />
                Career
              </h2>
              <div
                className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none break-words whitespace-normal'
                dangerouslySetInnerHTML={{ 
                  __html: insertGalleryImagesInContent(
                    celebrity.career,
                    celebrity.galleryImages?.slice(8, 12) || [],
                    celebrity.name
                  ) 
                }}
              />
            </div>
          )}

          {/* Achievements & Awards */}
          {celebrity.achievements && celebrity.achievements.length > 0 && (
            <div>
              <h2 id='achievements' className='text-3xl font-bold mb-8 flex items-center gap-3'>
                <Icon icon='mdi:trophy' width='32' height='32' className='text-primary' />
                Achievements
              </h2>
              <div className=''>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {celebrity.achievements.map((achievement: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition'>
                      <div className='flex-shrink-0 mt-1'>
                        <span className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary'>
                          <Icon icon='mdi:star' width='18' height='18' />
                        </span>
                      </div>
                      <div className='flex-1'>
                        {typeof achievement === 'string' ? (
                          <p className='text-md font-medium text-gray-800'>{achievement}</p>
                        ) : (
                          <>
                            {achievement.title && <h3 className='text-md font-semibold text-gray-900'>{achievement.title}</h3>}
                            {achievement.description && <p className='mt-1 text-sm text-gray-600'>{achievement.description}</p>}
                            {achievement.year && <div className='mt-2 text-xs text-gray-400'>{achievement.year}</div>}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {celebrity.awards && celebrity.awards.length > 0 && (
            <div>
              <h2 id='awards' className='text-3xl font-bold mb-6 flex items-center gap-3'>
                <Icon icon='mdi:trophy-award' width='28' height='28' className='text-primary' />
                Awards & Recognition
              </h2>
              <div className='overflow-x-auto rounded-lg shadow'>
                <table className='min-w-full divide-y divide-gray-200 bg-white'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Year</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Award</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Category</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>For</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {celebrity.awards.map((award: any, index: number) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        <td className='px-4 py-4 text-sm text-gray-700 w-24'>{award.year || award.date || ''}</td>
                        <td className='px-4 py-4 text-sm font-semibold text-gray-800'>{award.title || award.name}</td>
                        <td className='px-4 py-4 text-sm text-gray-600'>{award.category || ''}</td>
                        <td className='px-4 py-4 text-sm text-gray-600'>{award.work || award.for || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {celebrity.works && celebrity.works.length > 0 && (
            <div>
              <h2 id='works' className='text-3xl font-bold mb-8 flex items-center gap-3'>
                <Icon icon='mdi:briefcase' width='32' height='32' className='text-primary' />
                Notable Works
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {celebrity.works.map((work: any, index: number) => (
                  <div
                    key={index}
                    className='p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                    {typeof work === 'string' ? (
                      <p className='font-semibold'>{work}</p>
                    ) : (
                      <>
                        <h3 className='text-lg font-bold mb-1'>{work.title}</h3>
                        {work.year && <p className='text-sm text-gray-500'>{work.year}</p>}
                        {work.role && <p className='text-gray-600'>{work.role}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {celebrity.movies && celebrity.movies.length > 0 && (
            <div>
              <h2 id='filmography' className='text-3xl font-bold mb-6 flex items-center gap-3'>
                <Icon icon='mdi:movie-open' width='28' height='28' className='text-primary' />
                Filmography
              </h2>
              <div className='overflow-x-auto rounded-lg shadow'>
                <table className='min-w-full divide-y divide-gray-200 bg-white'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Year</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Title</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Role</th>
                      <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Type</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {celebrity.movies.map((movie: any, index: number) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        <td className='px-4 py-4 text-sm text-gray-700 w-24'>{movie.year || ''}</td>
                        <td className='px-4 py-4 text-sm font-semibold text-gray-800'>{movie.title || movie.name}</td>
                        <td className='px-4 py-4 text-sm text-gray-600'>{movie.role || ''}</td>
                        <td className='px-4 py-4 text-sm text-gray-600'>{movie.type || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Education and Physical Attributes moved to sidebar quick facts */}
        </div>
      </div>
    </section>
  )
}

export default CelebrityDetailClient
