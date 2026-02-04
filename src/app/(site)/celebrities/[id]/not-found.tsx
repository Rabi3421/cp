import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function NotFound() {
  return (
    <main className='pt-32 pb-20'>
      <div className='container mx-auto max-w-7xl px-4 text-center'>
        <Icon icon='mdi:account-off' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
        <h1 className='text-3xl font-bold mb-4'>Celebrity Not Found</h1>
        <p className='text-gray-600 mb-8'>
          The celebrity profile you are looking for does not exist or has been removed.
        </p>
        <Link 
          href='/celebrities' 
          className='inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-darkmode transition'>
          <Icon icon='tabler:chevron-left' width='20' height='20' />
          Back to Celebrities
        </Link>
      </div>
    </main>
  )
}
