'use client'
import { useEffect, useState } from 'react'
import { aboutdata } from '@/app/types/aboutdata'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import AboutSkeleton from '../../Skeleton/AboutUs'

const Aboutus = () => {
  // fetch about data
  const [about, setAbout] = useState<aboutdata[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setAbout(data.Aboutdata)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Static features content (keeps original design but updates the content)
  const features = [
    {
      heading: 'Celebrity Profiles',
      imgSrc: '/images/aboutus/imgOne.svg',
      paragraph:
        'Detailed bios, filmography, awards, and curated galleries for each celebrity.',
      link: 'Explore profiles',
    },
    {
      heading: 'Outfit Decode',
      imgSrc: '/images/aboutus/imgTwo.svg',
      paragraph:
        'Breakdowns of iconic looks, outfit sources, and styling tips to recreate the look.',
      link: 'See outfit decodes',
    },
    {
      heading: 'News & Updates',
      imgSrc: '/images/aboutus/imgThree.svg',
      paragraph:
        'Latest celebrity news, movie announcements, red carpet highlights and trending stories.',
      link: 'Read news',
    },
    {
      heading: 'Blogs & Reviews',
      imgSrc: '/images/aboutus/imgOne.svg',
      paragraph:
        'In-depth articles, opinion pieces, and reviews covering celebrity culture and style.',
      link: 'Read blogs',
    },
    {
      heading: 'Movies & Shows',
      imgSrc: '/images/aboutus/imgTwo.svg',
      paragraph:
        'Curated movie and show guides, cast info, and recommendations from our editors.',
      link: 'Explore movies',
    },
  ]

  return (
    <section id='About' className=' bg-cover bg-center overflow-hidden'>
      <div className='container mx-auto max-w-7xl px-4 relative z-1'>
        <div className='p-12 bg-grey rounded-3xl'>
          <Image
            src='/images/aboutus/dots.svg'
            width={100}
            height={100}
            alt='dots-image'
            className='absolute bottom-1 -left-20'
          />
          <p className='text-center text-primary text-lg tracking-widest uppercase mt-10'>
            features
          </p>
          <h2 className='text-center pb-12'>What we offer</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-10'>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <AboutSkeleton key={index} />
                ))
              : features.map((item, i) => (
                  <div
                    key={i}
                    className='hover:bg-darkmode bg-white rounded-3xl p-8 shadow-xl group'>
                    <h5 className='group-hover:text-white mb-5'>
                      {item.heading}
                    </h5>
                    <Image
                      src={item.imgSrc}
                      alt={item.heading}
                      width={100}
                      height={100}
                      className='mb-5'
                    />
                    <p className='text-lg font-normal text-black group-hover:text-white mb-5'>
                      {item.paragraph}
                    </p>
                    <Link
                      href='#'
                      className='text-18 font-semibold text-primary hover-underline flex items-center'>
                      {item.link}
                      <Icon
                        icon='tabler:chevron-right'
                        width='20'
                        height='20'
                      />
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Aboutus
