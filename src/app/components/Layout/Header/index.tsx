'use client'

import { Key, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { HeaderItem } from '@/app/types/menu'
import { useAuth } from '@/context/AuthContext'
import Logo from './Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useAuth()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // 🔥 Local Header Navigation (CelebrityPersona)
  const headerData: HeaderItem[] = [
    { label: 'Celebrities', href: '/celebrities' },
    { label: 'Outfit Decode', href: '/outfits' },
    { label: 'News', href: '/news' },
    {
      label: 'Movies',
      href: '/movies',
      submenu: [
        { label: 'Movies', href: '/movies' },
        { label: 'Upcoming Movies', href: '/upcoming-movies' },
        { label: 'Movie Reviews', href: '/movie-reviews' },
      ],
    },
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
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node) &&
      showProfileMenu
    ) {
      setShowProfileMenu(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, showProfileMenu])

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
            className={`pr-8 lg:border-r border-black/10 duration-300 ${
              sticky ? 'py-2 lg:py-3' : 'py-2 lg:py-6'
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
            className={`flex items-center gap-4 pl-8 lg:border-l border-black/10 duration-300 ${
              sticky ? 'py-2 lg:py-3' : 'py-2 lg:py-6'
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
                  className='w-10 h-10 lg:w-7 lg:h-7'
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
                  className='w-10 h-10 lg:w-7 lg:h-7'
                />
              </a>
            </div>

            {user ? (
              <div className='hidden lg:block relative' ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className='flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-grey transition'>
                  <Image
                    src={user.avatar || '/images/team/user1.svg'}
                    alt={user.name}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                  <span className='font-semibold'>{user.name}</span>
                  <Icon icon='tabler:chevron-down' width='16' height='16' />
                </button>

                {showProfileMenu && (
                  <div className='absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50'>
                    <div className='px-4 py-3 border-b border-gray-100'>
                      <p className='text-sm font-semibold'>{user.name}</p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                      <p className='text-xs text-primary mt-1 capitalize'>{user.role}</p>
                    </div>
                    <Link
                      href={`/dashboard/${user.role === 'superadmin' ? 'superadmin' : user.role}`}
                      className='flex items-center gap-2 px-4 py-2 hover:bg-grey transition'
                      onClick={() => setShowProfileMenu(false)}>
                      <Icon icon='mdi:view-dashboard' width='18' height='18' />
                      <span className='text-sm'>Dashboard</span>
                    </Link>
                    <Link
                      href='/dashboard/profile'
                      className='flex items-center gap-2 px-4 py-2 hover:bg-grey transition'
                      onClick={() => setShowProfileMenu(false)}>
                      <Icon icon='mdi:account' width='18' height='18' />
                      <span className='text-sm'>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowProfileMenu(false)
                      }}
                      className='w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition'>
                      <Icon icon='mdi:logout' width='18' height='18' />
                      <span className='text-sm'>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/signin' className='hidden lg:block'>
                <button className='bg-transparent text-darkmode border border-darkmode px-4 py-2 rounded-lg hover:bg-darkmode hover:text-white transition'>
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-3 rounded-md focus:outline-none'
              aria-label='Toggle mobile menu'
            >
              <span className='block w-7 h-0.5 bg-darkmode rounded'></span>
              <span className='block w-7 h-0.5 bg-darkmode mt-1.5 rounded'></span>
              <span className='block w-7 h-0.5 bg-darkmode mt-1.5 rounded'></span>
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
                  className='w-9 h-9 lg:w-7 lg:h-7'
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
                  className='w-9 h-9 lg:w-7 lg:h-7'
                />
              </a>
            </div>

            {user ? (
              <>
                <div className='border-t border-white/20 pt-4 mt-4'>
                  <div className='flex items-center gap-3 px-2 py-3'>
                    <Image
                      src={user.avatar || '/images/team/user1.svg'}
                      alt={user.name}
                      width={40}
                      height={40}
                      className='rounded-full'
                    />
                    <div>
                      <p className='text-white font-semibold'>{user.name}</p>
                      <p className='text-xs text-gray-300 capitalize'>{user.role}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/${user.role === 'superadmin' ? 'superadmin' : user.role}`}
                  className='flex items-center gap-2 justify-center bg-primary text-white px-4 py-3 rounded-lg text-center'
                  onClick={() => setNavbarOpen(false)}>
                  <Icon icon='mdi:view-dashboard' width='20' height='20' />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    logout()
                    setNavbarOpen(false)
                  }}
                  className='flex items-center gap-2 justify-center border border-red-500 text-red-500 px-4 py-3 rounded-lg'>
                  <Icon icon='mdi:logout' width='20' height='20' />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/signin'
                  className='border border-primary text-primary px-4 py-2 rounded-lg text-center'
                  onClick={() => setNavbarOpen(false)}>
                  Sign In
                </Link>

                <Link
                  href='/signup'
                  className='bg-primary text-white px-4 py-2 rounded-lg text-center'
                  onClick={() => setNavbarOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
