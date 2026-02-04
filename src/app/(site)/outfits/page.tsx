'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Outfit } from '@/app/types/outfit'
import { Icon } from '@iconify/react'

const OutfitsPage = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [featured, setFeatured] = useState<Outfit[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [stats, setStats] = useState({ total: 0, totalViews: 0, totalLikes: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchOutfits()
  }, [searchQuery, selectedCategory, pagination.page])

  const fetchOutfits = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
      })

      const res = await fetch(`/api/outfits?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
    console.log('Fetched outfits data:', data)
      
      if (data.success) {
        setOutfits(data.data || [])
        setFeatured(data.featured || [])
        setCategories(data.categories || [])
        setStats(data.stats || { total: 0, totalViews: 0, totalLikes: 0 })
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching outfits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setPagination({ ...pagination, page: 1 })
  }

  const filteredOutfits = outfits

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4 font-bold'>
              outfit decode
            </p>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
              Decode Celebrity Style
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Get the exact breakdown of your favorite celebrity outfits. Shop similar styles and recreate iconic looks.
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
                className='w-full pl-14 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-white text-lg shadow-lg'
                placeholder='Search by celebrity, event, designer, or style...'
                aria-label='Search outfits'
              />
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{stats.total}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>Total Outfits</p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{categories.length}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>Categories</p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{stats.totalViews}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>Total Views</p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{stats.totalLikes}</p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>Total Likes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Outfits Section */}
      {featured.length > 0 && (
        <section className='py-16 bg-white dark:bg-gray-900'>
          <div className='container mx-auto max-w-7xl px-4'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-3xl font-bold mb-2'>Featured Outfits</h2>
                <p className='text-gray-600 dark:text-gray-400'>Most iconic celebrity looks</p>
              </div>
              <Icon icon='mdi:hanger' className='text-primary' width='40' height='40' />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {featured.map((outfit) => (
                <Link
                  key={outfit._id}
                  href={`/outfits/${outfit.slug}`}
                  className='group'
                >
                  <div className='relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300'>
                    <Image
                      src={outfit.images[0] || '/images/placeholder.jpg'}
                      alt={outfit.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-3'>
                      <p className='text-white font-bold text-sm line-clamp-2'>{outfit.title}</p>
                      {typeof outfit.celebrity === 'object' && (
                        <p className='text-white/80 text-xs'>{outfit.celebrity.name}</p>
                      )}
                    </div>
                    <div className='absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs'>
                      {outfit.event}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter Section */}
      {categories.length > 0 && (
        <section className='py-8 bg-grey dark:bg-gray-800'>
          <div className='container mx-auto max-w-7xl px-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Icon icon='mdi:filter' width='24' height='24' className='text-primary' />
              <h3 className='text-xl font-bold'>Filter by Category</h3>
            </div>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  !selectedCategory
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                All ({pagination.total})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryFilter(cat.name)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outfits Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>
                {selectedCategory ? `${selectedCategory} Outfits` : 'All Outfits'}
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Showing {filteredOutfits.length} of {pagination.total} outfits
              </p>
            </div>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : filteredOutfits.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:hanger' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No outfits found</h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                }}
                className='px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-darkmode transition'
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredOutfits.map((outfit) => (
                  <Link
                    key={outfit._id}
                    href={`/outfits/${outfit.slug}`}
                    className='group'>
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                      <div className='relative w-full h-80 mb-6 overflow-hidden rounded-2xl'>
                        <Image
                          src={outfit.images[0] || '/images/placeholder.jpg'}
                          alt={outfit.title}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        <div className='absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold'>
                          {outfit.event}
                        </div>
                        {outfit.price && (
                          <div className='absolute top-4 right-4 bg-white/90 backdrop-blur text-darkmode px-3 py-1 rounded-full text-sm font-bold'>
                            {outfit.price}
                          </div>
                        )}
                        {outfit.isFeatured && (
                          <div className='absolute bottom-4 right-4 bg-yellow-500 text-white p-2 rounded-full'>
                            <Icon icon='mdi:star' width='20' height='20' />
                          </div>
                        )}
                        {outfit.category && (
                          <div className='absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-xs'>
                            {outfit.category}
                          </div>
                        )}
                      </div>
                      
                      <h3 className='text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-2'>
                        {outfit.title}
                      </h3>
                      
                      {typeof outfit.celebrity === 'object' && outfit.celebrity && (
                        <Link
                          href={`/celebrities/${outfit.celebrity.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className='flex items-center gap-2 mb-3 hover:text-primary transition'
                        >
                          <Icon icon='mdi:account' width='20' height='20' className='text-gray-500' />
                          <span className='text-gray-600 dark:text-gray-400 font-semibold line-clamp-1'>
                            {outfit.celebrity.name}
                          </span>
                        </Link>
                      )}
                      
                      {outfit.designer && (
                        <div className='flex items-center gap-2 mb-3'>
                          <Icon icon='mdi:pencil-ruler' width='18' height='18' className='text-gray-400' />
                          <span className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                            {outfit.designer}
                          </span>
                        </div>
                      )}
                      
                      <div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700'>
                        <span className='text-primary font-semibold flex items-center gap-1'>
                          View Details
                          <Icon icon='tabler:chevron-right' width='20' height='20' />
                        </span>
                        
                        <div className='flex items-center gap-3'>
                          {outfit.images.length > 1 && (
                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                              <Icon icon='mdi:image-multiple' width='16' height='16' />
                              <span>{outfit.images.length}</span>
                            </div>
                          )}
                          {outfit.likesCount > 0 && (
                            <div className='flex items-center gap-1 text-sm text-gray-500'>
                              <Icon icon='mdi:heart' width='16' height='16' />
                              <span>{outfit.likesCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className='flex items-center justify-center gap-2 mt-12'>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey dark:hover:bg-gray-700 transition'
                  >
                    <Icon icon='tabler:chevron-left' width='20' height='20' />
                  </button>
                  
                  <div className='flex gap-2'>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = pagination.page - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({ ...pagination, page: pageNum })}
                          className={`w-10 h-10 rounded-lg font-semibold transition ${
                            pagination.page === pageNum
                              ? 'bg-primary text-white'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-grey dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey dark:hover:bg-gray-700 transition'
                  >
                    <Icon icon='tabler:chevron-right' width='20' height='20' />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className='py-20 bg-grey dark:bg-gray-800'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <Icon icon='mdi:trending-up' width='48' height='48' className='mx-auto text-primary mb-4' />
            <h2 className='text-3xl font-bold mb-4'>Trending Now</h2>
            <p className='text-gray-600 dark:text-gray-400'>
              What's hot in celebrity fashion this season
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-lg'>
              <Icon icon='mdi:tshirt-crew' width='40' height='40' className='mx-auto text-primary mb-3' />
              <p className='font-bold text-lg mb-1'>Red Carpet</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Most viewed</p>
            </div>
            <div className='bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-lg'>
              <Icon icon='mdi:sunglasses' width='40' height='40' className='mx-auto text-primary mb-3' />
              <p className='font-bold text-lg mb-1'>Street Style</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Trending up</p>
            </div>
            <div className='bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-lg'>
              <Icon icon='mdi:party-popper' width='40' height='40' className='mx-auto text-primary mb-3' />
              <p className='font-bold text-lg mb-1'>Events</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Most liked</p>
            </div>
            <div className='bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-lg'>
              <Icon icon='mdi:camera' width='40' height='40' className='mx-auto text-primary mb-3' />
              <p className='font-bold text-lg mb-1'>Photoshoot</p>
              <p className='text-sm text-gray-600 dark:text-gray-400'>New arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white'>
        <div className='container mx-auto max-w-4xl px-4 text-center'>
          <Icon icon='mdi:hanger' width='60' height='60' className='mx-auto mb-6' />
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Get Inspired by Celebrity Style
          </h2>
          <p className='text-lg mb-8 text-white/90'>
            Discover how to recreate your favorite celebrity looks. Shop similar items and get styling tips from fashion experts.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/celebrities'
              className='px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-grey transition'
            >
              Browse Celebrities
            </Link>
            <Link
              href='/contact'
              className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition'
            >
              Request an Outfit
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default OutfitsPage
