'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { News } from '@/app/types/news'
import { Icon } from '@iconify/react'

const NewsDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [news, setNews] = useState<News | null>(null)
  const [relatedNews, setRelatedNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [newsId, setNewsId] = useState<string>('')

  useEffect(() => {
    params.then(p => setNewsId(p.id))
  }, [])

  useEffect(() => {
    if (!newsId) return
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const newsData = data.NewsData || []
        const found = newsData.find((n: News) => n.id === newsId)
        setNews(found || null)
        
        // Get related news from same category
        if (found) {
          const related = newsData
            .filter((n: News) => n.category === found.category && n.id !== found.id)
            .slice(0, 3)
          setRelatedNews(related)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [newsId])

  if (loading) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
            <div className='h-12 bg-gray-200 rounded w-3/4 mb-4'></div>
            <div className='w-full h-96 bg-gray-200 rounded-3xl mb-8'></div>
            <div className='space-y-3'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className='h-4 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!news) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4 text-center'>
          <Icon icon='mdi:newspaper-remove' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h2 className='text-3xl font-bold mb-4'>News Article Not Found</h2>
          <Link href='/news' className='text-primary hover:underline'>
            Back to News
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className='bg-grey'>
      {/* Hero Section */}
      <section className='pt-32 pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <Link 
            href='/news'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to News</span>
          </Link>

          <div className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4'>
            {news.category}
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            {news.title}
          </h1>

          <div className='flex flex-wrap items-center gap-6 text-gray-600 mb-8'>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:account-circle' width='24' height='24' />
              <span className='font-semibold'>{news.author}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:calendar' width='20' height='20' />
              <span>{news.publishDate}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Icon icon='mdi:clock-outline' width='20' height='20' />
              <span>{news.readTime}</span>
            </div>
          </div>

          <div className='relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-xl mb-8'>
            <Image
              src={news.image}
              alt={news.title}
              fill
              className='object-cover'
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='pb-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            <div className='prose prose-lg max-w-none'>
              <p className='text-xl text-gray-700 mb-6 leading-relaxed font-medium'>
                {news.excerpt}
              </p>
              <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
                {news.content}
              </div>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                  Tags
                </p>
                <div className='flex flex-wrap gap-2'>
                  {news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-grey rounded-full text-sm text-gray-700'>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className='mt-8 pt-8 border-t border-gray-200'>
              <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                Share this article
              </p>
              <div className='flex gap-4'>
                <button className='w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:bg-primary hover:text-white transition'>
                  <Icon icon='mdi:facebook' width='20' height='20' />
                </button>
                <button className='w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:bg-primary hover:text-white transition'>
                  <Icon icon='mdi:twitter' width='20' height='20' />
                </button>
                <button className='w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:bg-primary hover:text-white transition'>
                  <Icon icon='mdi:linkedin' width='20' height='20' />
                </button>
                <button className='w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:bg-primary hover:text-white transition'>
                  <Icon icon='mdi:link-variant' width='20' height='20' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className='pb-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-8'>Related News</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                    <div className='relative w-full h-48 overflow-hidden'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-6'>
                      <h3 className='text-lg font-bold mb-2 group-hover:text-primary transition line-clamp-2'>
                        {item.title}
                      </h3>
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default NewsDetailPage
