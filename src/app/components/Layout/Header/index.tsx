'use client'

import { Key, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderItem } from '@/app/types/menu'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // 🔥 Local Header Navigation (CelebrityPersona)
  const headerData: HeaderItem[] = [
    { label: 'Celebrities', href: '/celebrities' },
    { label: 'Outfit Decode', href: '/outfits' },
    { label: 'News', href: '/news' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Movies', href: '/movies' },
  ]

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen])

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? 'hidden' : ''
  }, [navbarOpen])

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 border-b border-black/10 ${
        sticky ? 'bg-white shadow-lg' : ''
      }`}
    >
      <div className='lg:py-0 py-2'>
        <div className='container mx-auto max-w-7xl flex items-center justify-between px-4'>
          {/* Logo */}
          <div
            className={`pr-16 lg:border-r border-black/10 duration-300 ${
              sticky ? 'py-3' : 'py-7'
            }`}
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex grow items-center gap-8 justify-center'>
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div
            className={`flex items-center gap-4 pl-16 lg:border-l border-black/10 duration-300 ${
              sticky ? 'py-3' : 'py-7'
            }`}
          >
            <div className='flex items-center gap-3'>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='inline-flex items-center text-darkmode'
              >
                <Image
                  src='/images/insta/instagram.svg'
                  alt='Instagram'
                  width={28}
                  height={28}
                />
              </a>

              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='inline-flex items-center text-darkmode'
              >
                <Image
                  src='/images/insta/facebook.svg'
                  alt='Facebook'
                  width={28}
                  height={28}
                />
              </a>
            </div>

            <Link href='/login' className='hidden lg:block'>
              <button className='bg-transparent text-darkmode border border-darkmode px-4 py-2 rounded-lg hover:bg-darkmode hover:text-white transition'>
                Sign In
              </button>
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'
            >
              <span className='block w-6 h-0.5 bg-darkmode'></span>
              <span className='block w-6 h-0.5 bg-darkmode mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-darkmode mt-1.5'></span>
            </button>
          </div>
        </div>

        {/* Overlay */}
        {navbarOpen && (
          <div className='fixed inset-0 bg-black/50 z-40' />
        )}

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-darkmode shadow-lg transform transition-transform duration-300 z-50 ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex items-center justify-between p-4'>
            <Logo />
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5"
              aria-label='Close menu'
            />
          </div>

          <nav className='flex flex-col p-4 gap-4'>
            {headerData.map(
              (item: HeaderItem, index: Key | null | undefined) => (
                <MobileHeaderLink key={index} item={item} />
              )
            )}

            <div className='flex gap-4'>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='inline-flex items-center text-white'
                onClick={() => setNavbarOpen(false)}
              >
                <Image
                  src='/images/insta/instagram.svg'
                  alt='Instagram'
                  width={28}
                  height={28}
                />
              </a>

              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='inline-flex items-center text-white'
                onClick={() => setNavbarOpen(false)}
              >
                <Image
                  src='/images/insta/facebook.svg'
                  alt='Facebook'
                  width={28}
                  height={28}
                />
              </a>
            </div>

            <Link
              href='/login'
              className='border border-primary text-primary px-4 py-2 rounded-lg text-center'
              onClick={() => setNavbarOpen(false)}
            >
              Sign In
            </Link>

            <Link
              href='/register'
              className='bg-primary text-white px-4 py-2 rounded-lg text-center'
              onClick={() => setNavbarOpen(false)}
            >
              Create Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
