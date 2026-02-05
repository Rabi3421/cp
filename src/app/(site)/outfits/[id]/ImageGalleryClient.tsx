"use client"

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  images: string[]
  featured?: boolean
}

export default function ImageGalleryClient({ images = [], featured = false }: Props) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div>
      <div className={`relative rounded-3xl overflow-hidden shadow-xl ${featured ? 'h-[720px] md:h-[760px] lg:h-[820px]' : 'h-96 md:h-[520px] lg:h-[600px]'}`}>
        <Image
          src={images[current]}
          alt={`Image ${current + 1}`}
          fill
          className='object-cover'
          priority={current === 0}
        />
      </div>

      {images.length > 1 && (
        <div className='mt-4'>
          <div className='flex items-center gap-3 overflow-x-auto py-2'>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Show image ${idx + 1}`}
                className={`flex-shrink-0 rounded-xl overflow-hidden border-2 ${current === idx ? 'border-primary' : 'border-transparent'} transition w-[72px] h-[72px] md:w-[96px] md:h-[96px]`}
              >
                <div className='relative w-full h-full'>
                  <Image src={img} alt={`thumb-${idx + 1}`} fill className='object-cover' />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
