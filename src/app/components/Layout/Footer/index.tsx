'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { footerlinks } from '@/app/types/footerlinks'

const footer = () => {
  // fetch data

  const [footerlinks, setFooterLinks] = useState<footerlinks[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setFooterLinks(data.FooterLinksData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='bg-gray-50' id='first-section'>
      <div className='container mx-auto max-w-2xl pt-16 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8'>
          {/* COLUMN-1 */}
          <div className='col-span-4'>
            <div className='mb-3'>
              <Image src='/images/logo/logo.png' alt='CelebrityPersona' width={180} height={36} />
            </div>
            <p className='text-gray-600 text-sm max-w-md mb-4'>
              Discover celebrity looks, outfit breakdowns, and style inspiration from
              film, TV and social media. Browse curated outfits, read biographies,
              and get outfit-decode tips to recreate the looks you love.
            </p>
            <div className='flex items-center gap-4'>
              <div className='footer-icons'>
                <Link href='https://facebook.com'>
                  <Image
                    src={'/images/footer/vec.svg'}
                    alt='facebook'
                    width={15}
                    height={20}
                  />
                </Link>
              </div>
              <div className='footer-icons'>
                <Link href='https://twitter.com'>
                  <Image
                    src={'/images/footer/twitter.svg'}
                    alt='twitter'
                    width={25}
                    height={20}
                  />
                </Link>
              </div>
              <div className='footer-icons'>
                <Link href='https://instagram.com'>
                  <Image
                    src={'/images/footer/instagram.svg'}
                    alt='instagram'
                    width={25}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* CLOUMN-2/3 */}
          {footerlinks.length > 0 ? (
            footerlinks.map((item, i) => (
              <div key={i} className='group relative col-span-2'>
                <p className='text-gray-900 text-sm font-bold mb-4'>{item.section}</p>
                <ul>
                  {item.links.map((item, i) => (
                    <li key={i} className='mb-3'>
                      <Link
                        href={`${item.href}`}
                        className='text-gray-600 text-sm font-normal hover:text-gray-900 transition-colors'>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className='group relative col-span-2'>
                <p className='text-gray-900 text-sm font-bold mb-4'>Menu</p>
                <ul>
                  <li className='mb-3'>
                    <Link href='/celebrities' className='text-gray-600 text-sm hover:text-gray-900'>Celebrities</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/outfits' className='text-gray-600 text-sm hover:text-gray-900'>Outfits</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/news' className='text-gray-600 text-sm hover:text-gray-900'>News</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/movie-reviews' className='text-gray-600 text-sm hover:text-gray-900'>Movie Reviews</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/upcoming-movies' className='text-gray-600 text-sm hover:text-gray-900'>Upcoming Movies</Link>
                  </li>
                </ul>
              </div>
              <div className='group relative col-span-2'>
                <p className='text-gray-900 text-sm font-bold mb-4'>Categories</p>
                <ul>
                  <li className='mb-3'>
                    <Link href='/category/design' className='text-gray-600 text-sm hover:text-gray-900'>Design</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/category/mockup' className='text-gray-600 text-sm hover:text-gray-900'>Mockup</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/category/view-all' className='text-gray-600 text-sm hover:text-gray-900'>View all</Link>
                  </li>
                </ul>
              </div>
              <div className='group relative col-span-2'>
                <p className='text-gray-900 text-sm font-bold mb-4'>Support</p>
                <ul>
                  <li className='mb-3'>
                    <Link href='/about' className='text-gray-600 text-sm hover:text-gray-900'>About us</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/faq' className='text-gray-600 text-sm hover:text-gray-900'>FAQ</Link>
                  </li>
                  <li className='mb-3'>
                    <Link href='/contact' className='text-gray-600 text-sm hover:text-gray-900'>Contact</Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      {/* All Rights Reserved */}
      <div className='mx-auto max-w-2xl lg:max-w-7xl'>
        <div className='pt-6 pb-6 px-4 sm:px-6 lg:px-4 border-t border-gray-200'>
            <div className='mt-4 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2 xl:gap-x-8'>
            <div>
              <p className='text-center md:text-start text-gray-600 text-sm'>
                ©{new Date().getFullYear()} - All Rights Reserved by{' '}
                <Link
                  href='https://celebritypersona.example/'
                  target='_blank'
                  className='text-primary hover:underline'>
                  CelebrityPersona
                </Link>
              </p>
            </div>
            <div className='flex justify-center md:justify-end items-center gap-6'>
              <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
                Privacy policy
              </Link>
              <span className='h-4 w-px bg-gray-200' />
              <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
                Terms & conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default footer
