 'use client'
import { Icon } from '@iconify/react'

interface CelebrityDetailClientProps {
  celebrity: any
  educationList: string[]
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
                dangerouslySetInnerHTML={{ __html: celebrity.earlyLife }}
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
                dangerouslySetInnerHTML={{ __html: celebrity.personalLife }}
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
                dangerouslySetInnerHTML={{ __html: celebrity.career }}
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
