'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/app/types/news'
import { Icon } from '@iconify/react'

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setNews(data.NewsData || [])
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categories = ['All', ...new Set(news.map(n => n.category))]

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              celebrity news
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Latest Celebrity News & Updates
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Stay updated with the latest celebrity news, red carpet events, movie announcements, and trending stories.
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-8'>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon icon='mdi:magnify' width='24' height='24' />
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-14 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white text-lg'
                placeholder='Search news articles...'
                aria-label='Search news'
              />
            </div>
          </div>

          {/* Categories */}
          <div className='flex flex-wrap justify-center gap-3'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-64 bg-gray-200 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:newspaper-variant-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No news found</h3>
              <p className='text-gray-600'>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full h-64 overflow-hidden'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {item.category}
                      </div>
                    </div>
                    
                    <div className='p-6'>
                      <h3 className='text-xl font-bold mb-3 group-hover:text-primary transition line-clamp-2'>
                        {item.title}
                      </h3>
                      
                      <p className='text-gray-600 mb-4 line-clamp-3'>
                        {item.excerpt}
                      </p>
                      
                      <div className='flex items-center justify-between text-sm text-gray-500'>
                        <div className='flex items-center gap-2'>
                          <Icon icon='mdi:account-circle' width='20' height='20' />
                          <span>{item.author}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Icon icon='mdi:clock-outline' width='16' height='16' />
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                      
                      <div className='mt-4 pt-4 border-t border-gray-100'>
                        <span className='text-primary font-semibold flex items-center gap-1'>
                          Read More
                          <Icon icon='tabler:chevron-right' width='20' height='20' />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default NewsPage
