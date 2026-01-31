'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'

const Hero = () => {
  const leftAnimation = {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.6 },
  }

  const rightAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <section className='relative overflow-hidden z-1'>
      <div className='container mx-auto pt-24 max-w-7xl px-4'>
        <div className='grid grid-cols-12 justify-center items-center'>
          <div className='col-span-12 xl:col-span-5 lg:col-span-6 md:col-span-12 sm:col-span-12'>
            <div className='py-2 px-5 bg-primary/15 rounded-full w-fit'>
              <p className='text-primary text-lg font-bold'>
                CELEBRITY PERSONA
              </p>
            </div>

            <h1 className='mt-6 text-3xl md:text-4xl xl:text-5xl font-bold leading-tight'>
              Discover Celebrities Beyond the Spotlight
            </h1>


            <p className='mt-6 text-lg text-gray-600 max-w-xl'>
              Explore in-depth celebrity profiles, latest news, movie reviews, and
              decode iconic celebrity outfits — all in one trusted destination.
            </p>

            {/* Search form (Hero) */}
            <SearchBlock />

            <div className='flex flex-col sm:flex-row gap-4 mt-6'>
              <Link href='/celebrities'>
                <button className='bg-primary text-white text-xl font-semibold py-5 px-8 rounded-full hover:bg-darkmode transition'>
                  Explore Celebrities
                </button>
              </Link>

              <Link href='/blogs'>
                <button className='border-2 border-primary text-primary text-xl font-semibold py-5 px-8 rounded-full hover:bg-primary hover:text-white transition'>
                  Celebrity Outfits
                </button>
              </Link>
            </div>

          </div>
          <div className='xl:col-span-7 lg:col-span-6 lg:block hidden'>
            <Image
              src='/images/hero/banner-image.png'
              alt='banner image'
              width={600}
              height={600}
              className='w-full'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

function SearchBlock() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = q.trim()
    if (trimmed.length === 0) {
      router.push('/celebrities')
    } else {
      router.push(`/celebrities?search=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mt-8'>
      <div className='flex flex-col sm:flex-row items-center gap-3'>
        <div className='relative w-full sm:w-[520px]'>
          <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
            <Icon icon='mdi:magnify' width='20' height='20' />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className='w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white'
            placeholder='Search celebrities, articles or outfits...'
            aria-label='Search celebrities'
          />
        </div>

        <button
          type='submit'
          className='bg-primary text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-darkmode transition'
        >
          Search
        </button>
      </div>
    </form>
  )
}
