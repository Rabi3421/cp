'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const ChangelogPage = () => {
  const versions = [
    {
      version: '2.0.0',
      date: 'December 2024',
      type: 'Major Release',
      changes: [
        'Complete redesign with celebrity-focused content',
        'Added Celebrity Profiles with detailed biographies',
        'Introduced Outfit Decode feature',
        'New News section with article categorization',
        'Expert Blogs with featured articles',
        'Movies & Shows database',
        'Comprehensive search functionality across all sections',
        'Dark mode support',
        'Mobile-responsive design improvements',
        'Performance optimizations',
      ]
    },
    {
      version: '1.5.0',
      date: 'November 2024',
      type: 'Feature Update',
      changes: [
        'Enhanced hero section with search functionality',
        'Improved navigation with social media integration',
        'Updated footer with additional links',
        'Added loading skeletons for better UX',
        'Implemented dynamic routing for content pages',
      ]
    },
    {
      version: '1.0.0',
      date: 'October 2024',
      type: 'Initial Release',
      changes: [
        'Landing page with hero section',
        'Basic about section',
        'Contact information',
        'Responsive layout foundation',
        'Tailwind CSS integration',
        'Next.js 15 setup',
      ]
    }
  ]

  return (
    <main className='bg-grey'>
      <section className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4'>
          <Link 
            href='/'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Home</span>
          </Link>

          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            <div className='text-center mb-12'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Icon icon='mdi:history' width='32' height='32' className='text-white' />
              </div>
              <h1 className='text-4xl font-bold mb-4'>Changelog</h1>
              <p className='text-lg text-gray-600'>
                Track the evolution of CelebrityPersona
              </p>
            </div>

            <div className='space-y-8'>
              {versions.map((release, index) => (
                <div key={index} className='relative pl-8 border-l-2 border-grey'>
                  <div className='absolute -left-3 top-0 w-5 h-5 bg-primary rounded-full'></div>
                  
                  <div className='mb-2'>
                    <div className='flex flex-wrap items-center gap-3 mb-2'>
                      <h2 className='text-2xl font-bold'>Version {release.version}</h2>
                      <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold'>
                        {release.type}
                      </span>
                    </div>
                    <p className='text-gray-500 flex items-center gap-2'>
                      <Icon icon='mdi:calendar' width='16' height='16' />
                      {release.date}
                    </p>
                  </div>

                  <div className='bg-grey rounded-2xl p-6 mt-4'>
                    <h3 className='font-bold mb-3 text-lg'>What's New:</h3>
                    <ul className='space-y-2'>
                      {release.changes.map((change, idx) => (
                        <li key={idx} className='flex items-start gap-3 text-gray-700'>
                          <Icon icon='mdi:check-circle' width='20' height='20' className='text-primary mt-0.5 flex-shrink-0' />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-12 bg-grey rounded-2xl p-6'>
              <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                <Icon icon='mdi:rocket-launch' width='24' height='24' className='text-primary' />
                What's Coming Next
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>User accounts and personalization</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>Save and bookmark favorite celebrities and outfits</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>Push notifications for celebrity updates</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>Enhanced search with filters and sorting</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>Celebrity comparison tool</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Icon icon='mdi:circle-medium' width='20' height='20' className='text-primary mt-1' />
                  <span>Style quiz and recommendations</span>
                </li>
              </ul>
            </div>

            <div className='mt-8 text-center'>
              <p className='text-gray-600 mb-4'>
                Have a feature request or found a bug?
              </p>
              <button className='bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition'>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ChangelogPage
