'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const StyleguidePage = () => {
  return (
    <main className='bg-grey'>
      <section className='pt-32 pb-20'>
        <div className='container mx-auto max-w-6xl px-4'>
          <Link 
            href='/'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Home</span>
          </Link>

          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-8'>
            <div className='text-center mb-12'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Icon icon='mdi:palette' width='32' height='32' className='text-white' />
              </div>
              <h1 className='text-4xl font-bold mb-4'>Design Styleguide</h1>
              <p className='text-lg text-gray-600'>
                Visual language and design system of CelebrityPersona
              </p>
            </div>

            {/* Colors Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Color Palette</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div>
                  <div className='w-full h-32 bg-primary rounded-2xl mb-3 shadow-lg'></div>
                  <p className='font-bold'>Primary</p>
                  <p className='text-sm text-gray-600'>Main brand color</p>
                </div>
                <div>
                  <div className='w-full h-32 bg-darkmode rounded-2xl mb-3 shadow-lg'></div>
                  <p className='font-bold'>Dark Mode</p>
                  <p className='text-sm text-gray-600'>Dark theme</p>
                </div>
                <div>
                  <div className='w-full h-32 bg-grey rounded-2xl mb-3 shadow-lg'></div>
                  <p className='font-bold'>Grey</p>
                  <p className='text-sm text-gray-600'>Background</p>
                </div>
                <div>
                  <div className='w-full h-32 bg-white border-2 border-gray-200 rounded-2xl mb-3'></div>
                  <p className='font-bold'>White</p>
                  <p className='text-sm text-gray-600'>Cards & content</p>
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Typography</h2>
              <div className='space-y-6'>
                <div>
                  <h1 className='text-5xl font-bold mb-2'>Heading 1</h1>
                  <p className='text-sm text-gray-600'>text-5xl font-bold</p>
                </div>
                <div>
                  <h2 className='text-4xl font-bold mb-2'>Heading 2</h2>
                  <p className='text-sm text-gray-600'>text-4xl font-bold</p>
                </div>
                <div>
                  <h3 className='text-3xl font-bold mb-2'>Heading 3</h3>
                  <p className='text-sm text-gray-600'>text-3xl font-bold</p>
                </div>
                <div>
                  <h4 className='text-2xl font-bold mb-2'>Heading 4</h4>
                  <p className='text-sm text-gray-600'>text-2xl font-bold</p>
                </div>
                <div>
                  <p className='text-lg mb-2'>Body Large - The quick brown fox jumps over the lazy dog</p>
                  <p className='text-sm text-gray-600'>text-lg</p>
                </div>
                <div>
                  <p className='text-base mb-2'>Body Regular - The quick brown fox jumps over the lazy dog</p>
                  <p className='text-sm text-gray-600'>text-base</p>
                </div>
                <div>
                  <p className='text-sm mb-2'>Body Small - The quick brown fox jumps over the lazy dog</p>
                  <p className='text-sm text-gray-600'>text-sm</p>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Buttons</h2>
              <div className='flex flex-wrap gap-4'>
                <button className='bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition'>
                  Primary Button
                </button>
                <button className='bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border border-gray-200 hover:bg-gray-100 transition'>
                  Secondary Button
                </button>
                <button className='bg-grey text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-300 transition'>
                  Tertiary Button
                </button>
                <button className='bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition text-sm'>
                  Small Button
                </button>
              </div>
            </div>

            {/* Cards Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Cards</h2>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'>
                  <div className='w-full h-48 bg-grey rounded-2xl mb-4'></div>
                  <h3 className='text-xl font-bold mb-2'>Card with Shadow</h3>
                  <p className='text-gray-600'>rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2</p>
                </div>
                <div className='bg-grey rounded-3xl p-6'>
                  <div className='w-full h-48 bg-white rounded-2xl mb-4'></div>
                  <h3 className='text-xl font-bold mb-2'>Flat Card</h3>
                  <p className='text-gray-600'>rounded-3xl without shadow</p>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Badges & Tags</h2>
              <div className='flex flex-wrap gap-3'>
                <span className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                  Primary Badge
                </span>
                <span className='bg-grey text-gray-700 px-4 py-2 rounded-full text-sm'>
                  Grey Badge
                </span>
                <span className='bg-white text-gray-700 px-4 py-2 rounded-full text-sm border border-gray-200'>
                  White Badge
                </span>
                <span className='text-primary font-semibold'>
                  Text Badge
                </span>
              </div>
            </div>

            {/* Input Fields Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Input Fields</h2>
              <div className='space-y-4 max-w-md'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition'
                />
                <input
                  type='text'
                  placeholder='Focused input'
                  className='w-full px-6 py-4 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary transition'
                />
              </div>
            </div>

            {/* Icons Section */}
            <div className='mb-12'>
              <h2 className='text-3xl font-bold mb-6'>Icons</h2>
              <div className='flex flex-wrap gap-6'>
                <div className='text-center'>
                  <Icon icon='mdi:star' width='32' height='32' className='text-primary mx-auto mb-2' />
                  <p className='text-sm'>Star</p>
                </div>
                <div className='text-center'>
                  <Icon icon='mdi:heart' width='32' height='32' className='text-primary mx-auto mb-2' />
                  <p className='text-sm'>Heart</p>
                </div>
                <div className='text-center'>
                  <Icon icon='mdi:magnify' width='32' height='32' className='text-primary mx-auto mb-2' />
                  <p className='text-sm'>Search</p>
                </div>
                <div className='text-center'>
                  <Icon icon='mdi:account-circle' width='32' height='32' className='text-primary mx-auto mb-2' />
                  <p className='text-sm'>User</p>
                </div>
                <div className='text-center'>
                  <Icon icon='tabler:chevron-right' width='32' height='32' className='text-primary mx-auto mb-2' />
                  <p className='text-sm'>Arrow</p>
                </div>
              </div>
            </div>

            {/* Spacing Section */}
            <div>
              <h2 className='text-3xl font-bold mb-6'>Spacing & Borders</h2>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 bg-primary rounded-lg'></div>
                  <p className='text-sm text-gray-600'>rounded-lg (8px)</p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 bg-primary rounded-2xl'></div>
                  <p className='text-sm text-gray-600'>rounded-2xl (16px)</p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 bg-primary rounded-3xl'></div>
                  <p className='text-sm text-gray-600'>rounded-3xl (24px)</p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 bg-primary rounded-full'></div>
                  <p className='text-sm text-gray-600'>rounded-full (999px)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            <h2 className='text-3xl font-bold mb-6'>Design Principles</h2>
            <div className='grid md:grid-cols-2 gap-8'>
              <div>
                <h3 className='text-xl font-bold mb-3 flex items-center gap-2'>
                  <Icon icon='mdi:check-circle' width='24' height='24' className='text-primary' />
                  Consistency
                </h3>
                <p className='text-gray-700'>
                  Maintain consistent styling across all pages using rounded corners (rounded-3xl), shadows (shadow-xl), and hover effects (hover:-translate-y-2).
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-3 flex items-center gap-2'>
                  <Icon icon='mdi:check-circle' width='24' height='24' className='text-primary' />
                  Clarity
                </h3>
                <p className='text-gray-700'>
                  Use clear typography hierarchy with bold headings and readable body text. Ensure proper contrast between text and backgrounds.
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-3 flex items-center gap-2'>
                  <Icon icon='mdi:check-circle' width='24' height='24' className='text-primary' />
                  Whitespace
                </h3>
                <p className='text-gray-700'>
                  Generous spacing between elements improves readability and visual hierarchy. Use padding and margins liberally.
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-3 flex items-center gap-2'>
                  <Icon icon='mdi:check-circle' width='24' height='24' className='text-primary' />
                  Interaction
                </h3>
                <p className='text-gray-700'>
                  All interactive elements have hover states with smooth transitions. Cards lift on hover with transform and shadow changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default StyleguidePage
