'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Blog } from '@/app/types/blog'
import { Icon } from '@iconify/react'

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setBlogs(data.BlogsData || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categories = ['All', ...new Set(blogs.map(b => b.category))]
  const featuredBlog = blogs.find(b => b.featured)

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-grey pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4'>
              celebrity blogs
            </p>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Fashion Insights & Celebrity Style
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Expert analysis, style guides, and in-depth articles about celebrity fashion, trends, and the entertainment industry.
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
                placeholder='Search blog articles...'
                aria-label='Search blogs'
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

      {/* Featured Blog */}
      {featuredBlog && !searchQuery && selectedCategory === 'All' && (
        <section className='py-12 bg-white'>
          <div className='container mx-auto max-w-7xl px-4'>
            <div className='flex items-center gap-2 mb-6'>
              <Icon icon='mdi:star' width='24' height='24' className='text-primary' />
              <h2 className='text-2xl font-bold'>Featured Article</h2>
            </div>
            <Link href={`/blogs/${featuredBlog.id}`} className='group'>
              <div className='bg-grey rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                <div className='grid md:grid-cols-2 gap-0'>
                  <div className='relative h-80 md:h-full overflow-hidden'>
                    <Image
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-8 md:p-12 flex flex-col justify-center'>
                    <div className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4 w-fit'>
                      {featuredBlog.category}
                    </div>
                    <h3 className='text-3xl font-bold mb-4 group-hover:text-primary transition'>
                      {featuredBlog.title}
                    </h3>
                    <p className='text-gray-600 mb-6 text-lg'>
                      {featuredBlog.excerpt}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-500 mb-6'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src={featuredBlog.authorAvatar}
                          alt={featuredBlog.author}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />
                        <span className='font-semibold'>{featuredBlog.author}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Icon icon='mdi:clock-outline' width='16' height='16' />
                        <span>{featuredBlog.readTime}</span>
                      </div>
                    </div>
                    <span className='text-primary font-semibold flex items-center gap-1'>
                      Read Full Article
                      <Icon icon='tabler:chevron-right' width='20' height='20' />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blogs Grid */}
      <section className='py-20 bg-grey'>
        <div className='container mx-auto max-w-7xl px-4'>
          <h2 className='text-3xl font-bold mb-8'>All Articles</h2>
          
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
          ) : filteredBlogs.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:post-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No blogs found</h3>
              <p className='text-gray-600'>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className='group'>
                  <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col'>
                    <div className='relative w-full h-64 overflow-hidden'>
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                      />
                      <div className='absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold'>
                        {blog.category}
                      </div>
                    </div>
                    
                    <div className='p-6 flex flex-col flex-grow'>
                      <h3 className='text-xl font-bold mb-3 group-hover:text-primary transition line-clamp-2'>
                        {blog.title}
                      </h3>
                      
                      <p className='text-gray-600 mb-4 line-clamp-3 flex-grow'>
                        {blog.excerpt}
                      </p>
                      
                      <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                        <div className='flex items-center gap-2'>
                          <Image
                            src={blog.authorAvatar}
                            alt={blog.author}
                            width={24}
                            height={24}
                            className='rounded-full'
                          />
                          <span>{blog.author}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Icon icon='mdi:clock-outline' width='16' height='16' />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                      
                      <div className='pt-4 border-t border-gray-100'>
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

export default BlogsPage
