'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const InstructionsPage = () => {
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
                <Icon icon='mdi:book-open-page-variant' width='32' height='32' className='text-white' />
              </div>
              <h1 className='text-4xl font-bold mb-4'>How to Use CelebrityPersona</h1>
              <p className='text-lg text-gray-600'>
                Your complete guide to exploring celebrity fashion and entertainment
              </p>
            </div>

            <div className='space-y-12'>
              {/* Section 1 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    1
                  </div>
                  <h2 className='text-2xl font-bold'>Browse Celebrities</h2>
                </div>
                <p className='text-gray-700 leading-relaxed ml-13'>
                  Navigate to the Celebrities page to explore detailed profiles of your favorite stars. Each profile includes biography, career highlights, filmography, and awards. Use the search function to quickly find specific celebrities by name or filter through the grid view.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    2
                  </div>
                  <h2 className='text-2xl font-bold'>Decode Celebrity Outfits</h2>
                </div>
                <p className='text-gray-700 leading-relaxed ml-13'>
                  Visit the Outfit Decode section to see complete breakdowns of celebrity looks from red carpet events and public appearances. Each outfit includes individual item details with brand names, prices, and shopping links. Perfect for recreating your favorite celebrity styles.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    3
                  </div>
                  <h2 className='text-2xl font-bold'>Stay Updated with News</h2>
                </div>
                <p className='text-gray-700 leading-relaxed ml-13'>
                  Check the News section regularly for the latest celebrity updates, red carpet events, and trending stories. Articles are categorized by topic and include read time estimates. Use filters to find news about specific topics or celebrities you follow.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    4
                  </div>
                  <h2 className='text-2xl font-bold'>Read Expert Blogs</h2>
                </div>
                <p className='text-gray-700 leading-relaxed ml-13'>
                  Our Blogs section features in-depth articles about fashion trends, styling tips, and industry insights. Expert writers analyze celebrity style choices and provide guidance on how to incorporate trends into your own wardrobe. Featured articles are highlighted at the top.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    5
                  </div>
                  <h2 className='text-2xl font-bold'>Explore Movies & Shows</h2>
                </div>
                <p className='text-gray-700 leading-relaxed ml-13'>
                  Browse the filmography of your favorite celebrities in the Movies section. Each entry includes detailed information about the film, cast, director, ratings, and box office performance. Filter by genre to discover new movies in categories you enjoy.
                </p>
              </div>

              {/* Tips Section */}
              <div className='bg-grey rounded-2xl p-6 mt-12'>
                <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <Icon icon='mdi:lightbulb-on' width='24' height='24' className='text-primary' />
                  Pro Tips
                </h3>
                <ul className='space-y-3 text-gray-700'>
                  <li className='flex items-start gap-2'>
                    <Icon icon='mdi:check-circle' width='20' height='20' className='text-primary mt-1' />
                    <span>Use the search functionality on each page to quickly find specific content</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Icon icon='mdi:check-circle' width='20' height='20' className='text-primary mt-1' />
                    <span>Click on celebrity names in outfit breakdowns to view their full profile</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Icon icon='mdi:check-circle' width='20' height='20' className='text-primary mt-1' />
                    <span>Share articles and profiles on social media using the share buttons</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <Icon icon='mdi:check-circle' width='20' height='20' className='text-primary mt-1' />
                    <span>Check the tags at the bottom of articles to find related content</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default InstructionsPage
