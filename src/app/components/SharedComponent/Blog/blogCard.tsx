import React, { FC } from 'react'
import Image from 'next/image'
import { Blog } from '@/app/types/blog'
import Link from 'next/link'

const BlogCard = ({ blog }: { blog: Blog }) => {
  const { id, title, image, excerpt, publishDate } = blog
  return (
    <>
      <Link
        href={`/blogs/${id}`}
        className='group mb-10 flex items-center gap-9'>
        <div className='overflow-hidden rounded-lg'>
          <Image
            src={image}
            alt='image'
            width={300}
            height={250}
            className='group-hover:scale-110 duration-300'
          />
        </div>
        <div className=''>
          <span className='text-16 text-dark_grey mb-1'>
            {publishDate}
          </span>
          <h5 className='text-22 font-medium mb-9 group-hover:text-primary'>
            {title}
          </h5>
          <p className='text-primary text-17 font-medium '>Read More</p>
        </div>
      </Link>
    </>
  )
}

export default BlogCard
