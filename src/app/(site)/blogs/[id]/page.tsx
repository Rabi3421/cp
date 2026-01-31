'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Blog } from '@/app/types/blog'
import { Icon } from '@iconify/react'

const BlogDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [blogId, setBlogId] = useState<string>('')

  useEffect(() => {
    params.then(p => setBlogId(p.id))
  }, [])

  useEffect(() => {
    if (!blogId) return
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const blogsData = data.BlogsData || []
        const found = blogsData.find((b: Blog) => b.id === blogId)
        setBlog(found || null)
        
        // Get related blogs from same category
        if (found) {
          const related = blogsData
            .filter((b: Blog) => b.category === found.category && b.id !== found.id)
            .slice(0, 3)
          setRelatedBlogs(related)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [blogId])

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

  if (!blog) {
    return (
      <main className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4 text-center'>
          <Icon icon='mdi:post-remove-outline' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
          <h2 className='text-3xl font-bold mb-4'>Blog Article Not Found</h2>
          <Link href='/blogs' className='text-primary hover:underline'>
            Back to Blogs
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
            href='/blogs'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Blogs</span>
          </Link>

          <div className='bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4'>
            {blog.category}
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            {blog.title}
          </h1>

          <div className='flex flex-wrap items-center gap-6 mb-8'>
            <div className='flex items-center gap-3'>
              <Image
                src={blog.authorAvatar}
                alt={blog.author}
                width={48}
                height={48}
                className='rounded-full'
              />
              <div>
                <p className='font-semibold'>{blog.author}</p>
                <p className='text-sm text-gray-500'>{blog.publishDate}</p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-gray-600'>
              <Icon icon='mdi:clock-outline' width='20' height='20' />
              <span>{blog.readTime}</span>
            </div>
          </div>

          <div className='relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-xl mb-8'>
            <Image
              src={blog.image}
              alt={blog.title}
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
                {blog.excerpt}
              </p>
              <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                  Tags
                </p>
                <div className='flex flex-wrap gap-2'>
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-grey rounded-full text-sm text-gray-700'>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className='mt-8 pt-8 border-t border-gray-200'>
              <div className='flex items-start gap-4'>
                <Image
                  src={blog.authorAvatar}
                  alt={blog.author}
                  width={80}
                  height={80}
                  className='rounded-full'
                />
                <div>
                  <h3 className='text-xl font-bold mb-2'>About {blog.author}</h3>
                  <p className='text-gray-600'>
                    A passionate writer and fashion enthusiast covering celebrity style, trends, and the latest in entertainment industry fashion.
                  </p>
                </div>
              </div>
            </div>

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

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className='pb-20'>
          <div className='container mx-auto max-w-7xl px-4'>
            <h2 className='text-3xl font-bold mb-8'>Related Articles</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.id}`}
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

export default BlogDetailPage
