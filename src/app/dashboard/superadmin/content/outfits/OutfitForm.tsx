'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import RichTextEditor from '@/app/components/Common/RichTextEditor'
import axios from 'axios'

interface OutfitFormProps {
  outfit: any
  onSave: (data: any) => void
  onCancel: () => void
  isEdit: boolean
}

const categories = [
  'Casual Wear',
  'Formal Wear',
  'Party Wear',
  'Traditional Wear',
  'Sportswear',
  'Beachwear',
  'Streetwear',
  'Red Carpet',
  'Airport Look',
  'Ethnic Wear',
  'Western Wear',
  'Fusion Wear',
  'Other',
]

export default function OutfitForm({
  outfit,
  onSave,
  onCancel,
  isEdit,
}: OutfitFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [celebrities, setCelebrities] = useState([])
  const [loadingCelebrities, setLoadingCelebrities] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    celebrity: '',
    images: [''],
    event: '',
    designer: '',
    year: new Date().getFullYear(),
    description: '',
    tags: [],
    purchaseLink: '',
    price: '',
    brand: '',
    category: 'Casual Wear',
    color: '',
    size: '',
    isActive: true,
    isFeatured: false,
    status: 'draft',
    publishAt: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      focusKeyword: '',
    },
  })

  useEffect(() => {
    fetchCelebrities()
  }, [])

  useEffect(() => {
    if (outfit) {
      setFormData({
        ...formData,
        ...outfit,
        celebrity: typeof outfit.celebrity === 'object' ? outfit.celebrity._id : outfit.celebrity,
        description: outfit.description || '',
        images: outfit.images && outfit.images.length > 0 ? outfit.images : [''],
      })
    }
  }, [outfit])

  const fetchCelebrities = async () => {
    try {
      const response = await axios.get('/api/superadmin/celebrities?status=published&limit=1000')
      if (response.data.success) {
        setCelebrities(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching celebrities:', error)
    } finally {
      setLoadingCelebrities(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }

    // Auto-generate slug from title
    if (field === 'title' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData({ ...formData, images: newImages })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter out empty image URLs
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
    }
    onSave(cleanedData)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'mdi:information' },
    { id: 'content', label: 'Description', icon: 'mdi:text-box' },
    { id: 'images', label: 'Images', icon: 'mdi:image' },
    { id: 'details', label: 'Details', icon: 'mdi:tag' },
    { id: 'seo', label: 'SEO', icon: 'mdi:search-web' },
    { id: 'publish', label: 'Publish', icon: 'mdi:send' },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
            {isEdit ? 'Edit Outfit' : 'Add New Outfit'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base'>
            {isEdit ? 'Update outfit details' : 'Create a new celebrity outfit'}
          </p>
        </div>
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm sm:text-base'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
          >
            <Icon icon='mdi:content-save' width='20' height='20' />
            <span>{isEdit ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
        <div className='flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 scrollbar-hide'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon icon={tab.icon} width='20' height='20' />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className='p-4 sm:p-6'>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Tropical Paradise Maxi Dress – Celebrity-Inspired Vacation Look'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Slug <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='tropical-paradise-maxi-dress'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Celebrity <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.celebrity}
                  onChange={(e) => handleChange('celebrity', e.target.value)}
                  required
                  disabled={loadingCelebrities}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>
                    {loadingCelebrities ? 'Loading celebrities...' : 'Select a celebrity'}
                  </option>
                  {celebrities.map((celeb: any) => (
                    <option key={celeb._id} value={celeb._id}>
                      {celeb.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Event <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.event}
                    onChange={(e) => handleChange('event', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Vacation, Red Carpet, etc.'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Year <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.year}
                    onChange={(e) => handleChange('year', parseInt(e.target.value))}
                    required
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Designer <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.designer}
                    onChange={(e) => handleChange('designer', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Sonia Wishlist'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Brand
                  </label>
                  <input
                    type='text'
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Sonia Wishlist'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Category <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className='space-y-6'>
              <RichTextEditor
                label='Description'
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                placeholder='Write detailed description about the outfit...'
                height='400px'
              />

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Tags (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.tags.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'tags',
                      e.target.value.split(',').map((t) => t.trim())
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='summer fashion, beachwear, resort wear'
                />
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-black dark:text-white'>
                  Outfit Images <span className='text-red-500'>*</span>
                </label>
                <button
                  type='button'
                  onClick={addImageField}
                  className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <Icon icon='mdi:plus' width='16' height='16' />
                  Add Image
                </button>
              </div>

              {formData.images.map((image, index) => (
                <div key={index} className='flex gap-2'>
                  <input
                    type='url'
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className='flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='https://example.com/image.jpg'
                  />
                  {formData.images.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeImageField(index)}
                      className='px-3 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'
                    >
                      <Icon icon='mdi:delete' width='20' height='20' />
                    </button>
                  )}
                </div>
              ))}

              {/* Image Preview */}
              {formData.images.filter(img => img).length > 0 && (
                <div className='mt-4'>
                  <p className='text-sm font-medium text-black dark:text-white mb-2'>
                    Preview:
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {formData.images
                      .filter(img => img)
                      .map((image, index) => (
                        <div key={index} className='relative aspect-square'>
                          <img
                            src={image}
                            alt={`Outfit ${index + 1}`}
                            className='w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-800'
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Price
                  </label>
                  <input
                    type='text'
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='₹999.00'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Color
                  </label>
                  <input
                    type='text'
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Green'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Size
                </label>
                <textarea
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                  rows={3}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='XS-S- Chest: 32-34 inches, Length : 44 inches'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Purchase Link
                </label>
                <input
                  type='url'
                  value={formData.purchaseLink}
                  onChange={(e) => handleChange('purchaseLink', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://store.com/product'
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Meta Title
                </label>
                <input
                  type='text'
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleChange('seo.metaTitle', e.target.value)}
                  maxLength={60}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Outfit Title - Celebrity Name'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {formData.seo.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Meta Description
                </label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleChange('seo.metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Brief description of the outfit...'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {formData.seo.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Focus Keyword
                </label>
                <input
                  type='text'
                  value={formData.seo.focusKeyword}
                  onChange={(e) => handleChange('seo.focusKeyword', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='celebrity outfit'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Meta Keywords (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.seo.metaKeywords.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'seo.metaKeywords',
                      e.target.value.split(',').map((k) => k.trim())
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='outfit, fashion, celebrity'
                />
              </div>
            </div>
          )}

          {/* Publish Tab */}
          {activeTab === 'publish' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
                  <option value='scheduled'>Scheduled</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Publish At
                  </label>
                  <input
                    type='datetime-local'
                    value={formData.publishAt || ''}
                    onChange={(e) => handleChange('publishAt', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              )}

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='isActive'
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <label
                  htmlFor='isActive'
                  className='text-sm font-medium text-black dark:text-white'
                >
                  Active
                </label>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='isFeatured'
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <label
                  htmlFor='isFeatured'
                  className='text-sm font-medium text-black dark:text-white'
                >
                  Featured
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
