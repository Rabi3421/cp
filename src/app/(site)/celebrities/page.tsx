'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Celebrity } from '@/app/types/celebrity'
import { Icon } from '@iconify/react'

const CelebritiesPage = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([])
  const [featured, setFeatured] = useState<Celebrity[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
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
    fetchCelebrities()
  }, [searchQuery, selectedCategory, pagination.page])

  const fetchCelebrities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
      })

      const res = await fetch(`/api/celebrities?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      
      if (data.success) {
        setCelebrities(data.data || [])
        setFeatured(data.featured || [])
        setCategories(data.categories || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching celebrities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setPagination({ ...pagination, page: 1 })
  }

  const filteredCelebrities = celebrities

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-grey to-primary/5 pt-32 pb-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary text-lg tracking-widest uppercase mb-4 font-bold'>
              celebrity profiles
            </p>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-darkmode bg-clip-text text-transparent'>
              Discover Your Favorite Celebrities
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Explore in-depth profiles, filmography, awards, and exclusive insights about the world's most famous personalities.
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
                placeholder='Search celebrities by name or occupation...'
                aria-label='Search celebrities'
              />
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto'>
            <div className='bg-white rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{pagination.total}</p>
              <p className='text-sm text-gray-600'>Total Celebrities</p>
            </div>
            <div className='bg-white rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{categories.length}</p>
              <p className='text-sm text-gray-600'>Categories</p>
            </div>
            <div className='bg-white rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>{featured.length}</p>
              <p className='text-sm text-gray-600'>Featured Stars</p>
            </div>
            <div className='bg-white rounded-2xl p-4 shadow-lg text-center'>
              <p className='text-3xl font-bold text-primary'>50+</p>
              <p className='text-sm text-gray-600'>Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Celebrities Section */}
      {featured.length > 0 && (
        <section className='py-16 bg-white'>
          <div className='container mx-auto max-w-7xl px-4'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-3xl font-bold mb-2'>Featured Celebrities</h2>
                <p className='text-gray-600'>Most popular stars of the moment</p>
              </div>
              <Icon icon='mdi:star' className='text-yellow-500' width='40' height='40' />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {featured.map((celebrity) => (
                <Link
                  key={celebrity._id}
                  href={`/celebrities/${celebrity.slug}`}
                  className='group'
                >
                  <div className='relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300'>
                    <Image
                      src={celebrity.profileImage || '/images/placeholder.jpg'}
                      alt={celebrity.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-3'>
                      <p className='text-white font-bold text-sm'>{celebrity.name}</p>
                      <p className='text-white/80 text-xs'>{celebrity.occupation}</p>
                    </div>
                    <div className='absolute top-2 right-2'>
                      <Icon icon='mdi:star' className='text-yellow-400' width='20' height='20' />
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
        <section className='py-8 bg-grey'>
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
                    : 'bg-white text-gray-700 hover:bg-gray-100'
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
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Celebrities Grid */}
      <section className='py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>
                {selectedCategory ? `${selectedCategory} Celebrities` : 'All Celebrities'}
              </h2>
              <p className='text-gray-600'>
                Showing {filteredCelebrities.length} of {pagination.total} celebrities
              </p>
            </div>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='bg-white rounded-3xl p-6 shadow-xl animate-pulse'>
                  <div className='w-full h-80 bg-gray-200 rounded-2xl mb-6'></div>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : filteredCelebrities.length === 0 ? (
            <div className='text-center py-20'>
              <Icon icon='mdi:account-search' width='80' height='80' className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-2xl font-semibold mb-2'>No celebrities found</h3>
              <p className='text-gray-600 mb-6'>Try adjusting your search or filters</p>
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
                {filteredCelebrities.map((celebrity) => (
                  <Link
                    key={celebrity._id}
                    href={`/celebrities/${celebrity.slug}`}
                    className='group'>
                    <div className='bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                      <div className='relative w-full h-80 mb-6 overflow-hidden rounded-2xl'>
                        <Image
                          src={celebrity.profileImage || '/images/placeholder.jpg'}
                          alt={celebrity.name}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        {celebrity.isFeatured && (
                          <div className='absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full'>
                            <Icon icon='mdi:star' width='20' height='20' />
                          </div>
                        )}
                        {celebrity.isVerified && (
                          <div className='absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full'>
                            <Icon icon='mdi:check-decagram' width='20' height='20' />
                          </div>
                        )}
                        {celebrity.categories && celebrity.categories.length > 0 && (
                          <div className='absolute bottom-4 left-4 bg-primary/90 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold'>
                            {celebrity.categories[0]}
                          </div>
                        )}
                      </div>
                      
                      <h3 className='text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-1'>
                        {celebrity.name}
                      </h3>
                      
                      <p className='text-gray-600 mb-3 line-clamp-1'>
                        {celebrity.occupation}
                      </p>
                      
                      <div className='flex items-center justify-between mb-4'>
                        {celebrity.birthPlace && (
                          <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <Icon icon='mdi:map-marker' width='16' height='16' />
                            <span className='line-clamp-1'>{celebrity.birthPlace}</span>
                          </div>
                        )}
                        {celebrity.viewCount > 0 && (
                          <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <Icon icon='mdi:eye' width='16' height='16' />
                            <span>{celebrity.viewCount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                        <span className='text-primary font-semibold flex items-center gap-1'>
                          View Profile
                          <Icon icon='tabler:chevron-right' width='20' height='20' />
                        </span>
                        
                        {celebrity.socialMedia && (
                          <div className='flex gap-2'>
                            {celebrity.socialMedia.instagram && (
                              <a
                                href={celebrity.socialMedia.instagram}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={(e) => e.stopPropagation()}
                                className='w-8 h-8 bg-grey rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition'
                              >
                                <Icon icon='mdi:instagram' width='16' height='16' />
                              </a>
                            )}
                            {celebrity.socialMedia.twitter && (
                              <a
                                href={celebrity.socialMedia.twitter}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={(e) => e.stopPropagation()}
                                className='w-8 h-8 bg-grey rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition'
                              >
                                <Icon icon='mdi:twitter' width='16' height='16' />
                              </a>
                            )}
                          </div>
                        )}
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
                    className='px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey transition'
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
                              : 'border border-gray-300 hover:bg-grey'
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
                    className='px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey transition'
                  >
                    <Icon icon='tabler:chevron-right' width='20' height='20' />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-br from-primary to-darkmode text-white'>
        <div className='container mx-auto max-w-4xl px-4 text-center'>
          <Icon icon='mdi:star-circle' width='60' height='60' className='mx-auto mb-6' />
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Want to See Your Favorite Celebrity?
          </h2>
          <p className='text-lg mb-8 text-white/90'>
            Can't find who you're looking for? Let us know and we'll add them to our growing collection of celebrity profiles.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/contact'
              className='px-8 py-4 bg-white text-primary rounded-full font-bold hover:bg-grey transition'
            >
              Request a Celebrity
            </Link>
            <Link
              href='/outfits'
              className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition'
            >
              Browse Outfits
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CelebritiesPage
