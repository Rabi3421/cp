'use client'
import { useState } from 'react'
import { Icon } from '@iconify/react'

interface CelebrityDetailClientProps {
  celebrity: any
  educationList: string[]
}

const CelebrityDetailClient = ({ celebrity, educationList }: CelebrityDetailClientProps) => {
  const [activeTab, setActiveTab] = useState<'biography' | 'achievements' | 'personal'>('biography')

  // Check if we have content for each tab
  const hasBiography = celebrity.earlyLife || celebrity.career
  const hasAchievements = (celebrity.achievements && celebrity.achievements.length > 0) || 
                          (celebrity.awards && celebrity.awards.length > 0) ||
                          (celebrity.works && celebrity.works.length > 0) ||
                          (celebrity.movies && celebrity.movies.length > 0)
  const hasPersonalLife = celebrity.personalLife || celebrity.spouse || celebrity.children?.length > 0 || 
                          celebrity.parents?.length > 0 || educationList.length > 0

  // If no content for tabs, don't render anything
  if (!hasBiography && !hasAchievements && !hasPersonalLife) {
    return null
  }

  return (
    <section className='py-20'>
      <div className='container mx-auto max-w-7xl px-4'>
        {/* Tabs */}
        <div className='flex flex-wrap gap-4 mb-12 justify-center'>
          {hasBiography && (
            <button
              onClick={() => setActiveTab('biography')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'biography'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Life & Career
            </button>
          )}
          {hasAchievements && (
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'achievements'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Achievements & Awards
            </button>
          )}
          {hasPersonalLife && (
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition ${
                activeTab === 'personal'
                  ? 'bg-primary text-white'
                  : 'bg-grey text-gray-700 hover:bg-gray-200'
              }`}>
              Personal Life
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
          {activeTab === 'biography' && (
            <div className='space-y-8'>
              {celebrity.earlyLife && (
                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:book-open-page-variant' width='32' height='32' className='text-primary' />
                    Early Life
                  </h2>
                  <div 
                    className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: celebrity.earlyLife }}
                  />
                </div>
              )}

              {celebrity.career && (
                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:star-circle' width='32' height='32' className='text-primary' />
                    Career
                  </h2>
                  <div 
                    className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: celebrity.career }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className='space-y-8'>
              {celebrity.achievements && celebrity.achievements.length > 0 && (
                <div>
                  <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
                    <Icon icon='mdi:trophy' width='32' height='32' className='text-primary' />
                    Achievements
                  </h2>
                  <div className='space-y-4'>
                    {celebrity.achievements.map((achievement: any, index: number) => (
                      <div
                        key={index}
                        className='p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                        {typeof achievement === 'string' ? (
                          <p className='text-lg text-gray-700'>{achievement}</p>
                        ) : (
                          <>
                            {achievement.title && <h3 className='text-xl font-bold mb-2'>{achievement.title}</h3>}
                            {achievement.description && <p className='text-gray-700'>{achievement.description}</p>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {celebrity.awards && celebrity.awards.length > 0 && (
                <div>
                  <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
                    <Icon icon='mdi:trophy-award' width='32' height='32' className='text-primary' />
                    Awards & Recognition
                  </h2>
                  <div className='space-y-4'>
                    {celebrity.awards.map((award: any, index: number) => (
                      <div
                        key={index}
                        className='flex items-start gap-6 p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                        <div className='flex-shrink-0'>
                          <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center'>
                            <Icon icon='mdi:trophy-award' width='32' height='32' />
                          </div>
                        </div>
                        <div className='flex-grow'>
                          {award.year && (
                            <div className='flex items-center gap-3 mb-2'>
                              <span className='bg-primary text-white px-4 py-1 rounded-full text-sm font-bold'>
                                {award.year}
                              </span>
                            </div>
                          )}
                          <h3 className='text-xl font-bold mb-1'>{award.title || award.name}</h3>
                          {award.category && (
                            <p className='text-gray-600 mb-1'>
                              <span className='font-semibold'>Category:</span> {award.category}
                            </p>
                          )}
                          {award.work && (
                            <p className='text-sm text-gray-500'>For: {award.work}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {celebrity.works && celebrity.works.length > 0 && (
                <div>
                  <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
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
                  <h2 className='text-3xl font-bold mb-8 flex items-center gap-3'>
                    <Icon icon='mdi:movie-open' width='32' height='32' className='text-primary' />
                    Filmography
                  </h2>
                  <div className='space-y-4'>
                    {celebrity.movies.map((movie: any, index: number) => (
                      <div
                        key={index}
                        className='flex items-start gap-6 p-6 bg-grey rounded-2xl hover:bg-primary/10 transition'>
                        <div className='flex-shrink-0 text-center'>
                          {movie.year && (
                            <div className='w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg'>
                              {movie.year.toString().slice(-2)}
                            </div>
                          )}
                        </div>
                        <div className='flex-grow'>
                          <h3 className='text-xl font-bold mb-1'>{movie.title || movie.name}</h3>
                          {movie.role && (
                            <p className='text-gray-600 mb-2'>
                              <span className='font-semibold'>Role:</span> {movie.role}
                            </p>
                          )}
                          <div className='flex items-center gap-2'>
                            {movie.type && (
                              <span className='bg-white px-3 py-1 rounded-full text-sm font-semibold'>
                                {movie.type}
                              </span>
                            )}
                            {movie.year && <span className='text-sm text-gray-500'>{movie.year}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'personal' && (
            <div className='space-y-8'>
              {celebrity.personalLife && (
                <div>
                  <h2 className='text-3xl font-bold mb-4 flex items-center gap-3'>
                    <Icon icon='mdi:heart' width='32' height='32' className='text-primary' />
                    Personal Life
                  </h2>
                  <div 
                    className='text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: celebrity.personalLife }}
                  />
                </div>
              )}

              {/* Family Information */}
              {(celebrity.spouse || celebrity.children?.length > 0 || celebrity.parents?.length > 0 || celebrity.siblings?.length > 0) && (
                <div>
                  <h2 className='text-3xl font-bold mb-6 flex items-center gap-3'>
                    <Icon icon='mdi:account-group' width='32' height='32' className='text-primary' />
                    Family
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {celebrity.spouse && (
                      <div className='p-6 bg-grey rounded-2xl'>
                        <h4 className='font-semibold mb-2 flex items-center gap-2'>
                          <Icon icon='mdi:ring' width='20' height='20' className='text-primary' />
                          Spouse
                        </h4>
                        <p className='text-gray-700'>{celebrity.spouse}</p>
                      </div>
                    )}
                    {celebrity.children && celebrity.children.length > 0 && (
                      <div className='p-6 bg-grey rounded-2xl'>
                        <h4 className='font-semibold mb-2 flex items-center gap-2'>
                          <Icon icon='mdi:baby-face' width='20' height='20' className='text-primary' />
                          Children
                        </h4>
                        <ul className='space-y-1'>
                          {celebrity.children.map((child: string, idx: number) => (
                            <li key={idx} className='text-gray-700'>{child}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {celebrity.parents && celebrity.parents.length > 0 && (
                      <div className='p-6 bg-grey rounded-2xl'>
                        <h4 className='font-semibold mb-2 flex items-center gap-2'>
                          <Icon icon='mdi:account-supervisor' width='20' height='20' className='text-primary' />
                          Parents
                        </h4>
                        <ul className='space-y-1'>
                          {celebrity.parents.map((parent: string, idx: number) => (
                            <li key={idx} className='text-gray-700'>{parent}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {celebrity.siblings && celebrity.siblings.length > 0 && (
                      <div className='p-6 bg-grey rounded-2xl'>
                        <h4 className='font-semibold mb-2 flex items-center gap-2'>
                          <Icon icon='mdi:account-multiple' width='20' height='20' className='text-primary' />
                          Siblings
                        </h4>
                        <ul className='space-y-1'>
                          {celebrity.siblings.map((sibling: string, idx: number) => (
                            <li key={idx} className='text-gray-700'>{sibling}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {educationList.length > 0 && (
                <div>
                  <h2 className='text-3xl font-bold mb-6 flex items-center gap-3'>
                    <Icon icon='mdi:school' width='32' height='32' className='text-primary' />
                    Education
                  </h2>
                  <div className='space-y-3'>
                    {educationList.map((edu, idx) => (
                      <div key={idx} className='p-6 bg-grey rounded-2xl'>
                        <p className='text-lg text-gray-700'>{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Attributes */}
              {(celebrity.height || celebrity.weight || celebrity.eyeColor || celebrity.hairColor || celebrity.bodyMeasurements) && (
                <div>
                  <h2 className='text-3xl font-bold mb-6 flex items-center gap-3'>
                    <Icon icon='mdi:human' width='32' height='32' className='text-primary' />
                    Physical Attributes
                  </h2>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {celebrity.height && (
                      <div className='p-4 bg-grey rounded-2xl'>
                        <p className='text-sm text-gray-500 mb-1'>Height</p>
                        <p className='font-semibold'>{celebrity.height}</p>
                      </div>
                    )}
                    {celebrity.weight && (
                      <div className='p-4 bg-grey rounded-2xl'>
                        <p className='text-sm text-gray-500 mb-1'>Weight</p>
                        <p className='font-semibold'>{celebrity.weight}</p>
                      </div>
                    )}
                    {celebrity.eyeColor && (
                      <div className='p-4 bg-grey rounded-2xl'>
                        <p className='text-sm text-gray-500 mb-1'>Eye Color</p>
                        <p className='font-semibold'>{celebrity.eyeColor}</p>
                      </div>
                    )}
                    {celebrity.hairColor && (
                      <div className='p-4 bg-grey rounded-2xl'>
                        <p className='text-sm text-gray-500 mb-1'>Hair Color</p>
                        <p className='font-semibold'>{celebrity.hairColor}</p>
                      </div>
                    )}
                    {celebrity.bodyMeasurements && (
                      <div className='p-4 bg-grey rounded-2xl col-span-2'>
                        <p className='text-sm text-gray-500 mb-1'>Body Measurements</p>
                        <p className='font-semibold'>{celebrity.bodyMeasurements}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CelebrityDetailClient
