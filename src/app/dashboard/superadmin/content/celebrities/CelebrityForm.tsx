'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import RichTextEditor from '@/app/components/Common/RichTextEditor'

interface CelebrityFormProps {
  celebrity: any
  onSave: (data: any) => void
  onCancel: () => void
  isEdit: boolean
}

export default function CelebrityForm({
  celebrity,
  onSave,
  onCancel,
  isEdit,
}: CelebrityFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    born: '',
    birthPlace: '',
    age: 0,
    nationality: '',
    profession: [],
    yearsActive: '',
    height: '',
    weight: '',
    introduction: '',
    earlyLife: '',
    career: '',
    personalLife: '',
    profileImage: '',
    coverImage: '',
    categories: [],
    tags: [],
    status: 'draft',
    isFeatured: false,
    isVerified: false,
    publishAt: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      focusKeyword: '',
    },
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
    },
  })

  useEffect(() => {
    if (celebrity) {
      setFormData({
        ...formData,
        ...celebrity,
        // Ensure content fields are strings, not undefined
        introduction: celebrity.introduction || '',
        earlyLife: celebrity.earlyLife || '',
        career: celebrity.career || '',
        personalLife: celebrity.personalLife || '',
      })
    }
  }, [celebrity])

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

    // Auto-generate slug from name
    if (field === 'name' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'mdi:account' },
    { id: 'content', label: 'Content', icon: 'mdi:text-box' },
    { id: 'media', label: 'Media', icon: 'mdi:image' },
    { id: 'seo', label: 'SEO', icon: 'mdi:search-web' },
    { id: 'social', label: 'Social', icon: 'mdi:share-variant' },
    { id: 'publish', label: 'Publish', icon: 'mdi:send' },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
            {isEdit ? 'Edit Celebrity' : 'Add New Celebrity'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base'>
            {isEdit ? 'Update celebrity profile' : 'Create a new celebrity profile'}
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
              <Icon icon={tab.icon} width='18' height='18' />
              <span className='hidden sm:inline'>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className='p-4 sm:p-6 max-h-[60vh] overflow-y-auto'>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter full name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Slug *
                  </label>
                  <input
                    type='text'
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='celebrity-name'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Date of Birth
                  </label>
                  <input
                    type='text'
                    value={formData.born}
                    onChange={(e) => handleChange('born', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='12 February 1990'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Birth Place
                  </label>
                  <input
                    type='text'
                    value={formData.birthPlace}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Delhi, India'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Age
                  </label>
                  <input
                    type='number'
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='35'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Nationality
                  </label>
                  <input
                    type='text'
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Indian'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Years Active
                  </label>
                  <input
                    type='text'
                    value={formData.yearsActive}
                    onChange={(e) => handleChange('yearsActive', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='2011–Present'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Height
                  </label>
                  <input
                    type='text'
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder="5'4&quot; (163 cm)"
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Weight
                  </label>
                  <input
                    type='text'
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='52 kg'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Profession (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.profession.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'profession',
                      e.target.value.split(',').map((p) => p.trim())
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Actress, Model'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Categories (comma separated)
                  </label>
                  <input
                    type='text'
                    value={formData.categories.join(', ')}
                    onChange={(e) =>
                      handleChange(
                        'categories',
                        e.target.value.split(',').map((c) => c.trim())
                      )
                    }
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Actress, Bollywood'
                  />
                </div>
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
                    placeholder='Bollywood, Youth Icon'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className='space-y-6'>
              <RichTextEditor
                label='Introduction'
                value={formData.introduction}
                onChange={(value) => handleChange('introduction', value)}
                placeholder='Write an engaging introduction about the celebrity...'
                height='250px'
              />

              <RichTextEditor
                label='Early Life'
                value={formData.earlyLife}
                onChange={(value) => handleChange('earlyLife', value)}
                placeholder='Write about their early life, childhood, education...'
                height='250px'
              />

              <RichTextEditor
                label='Career'
                value={formData.career}
                onChange={(value) => handleChange('career', value)}
                placeholder='Write about their career journey, achievements, milestones...'
                height='250px'
              />

              <RichTextEditor
                label='Personal Life'
                value={formData.personalLife}
                onChange={(value) => handleChange('personalLife', value)}
                placeholder='Write about their personal life, family, relationships...'
                height='250px'
              />
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Profile Image URL
                </label>
                <input
                  type='url'
                  value={formData.profileImage}
                  onChange={(e) => handleChange('profileImage', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://example.com/image.jpg'
                />
                {formData.profileImage && (
                  <div className='mt-4'>
                    <img
                      src={formData.profileImage}
                      alt='Profile preview'
                      className='w-32 h-32 rounded-xl object-cover border border-gray-200 dark:border-gray-800'
                    />
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Cover Image URL
                </label>
                <input
                  type='url'
                  value={formData.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://example.com/cover.jpg'
                />
                {formData.coverImage && (
                  <div className='mt-4'>
                    <img
                      src={formData.coverImage}
                      alt='Cover preview'
                      className='w-full h-48 rounded-xl object-cover border border-gray-200 dark:border-gray-800'
                    />
                  </div>
                )}
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
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Celebrity Name Biography & Profile'
                  maxLength={60}
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
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Discover complete biography including age, height, career, movies...'
                  maxLength={160}
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
                  placeholder='Celebrity Name Biography'
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
                  placeholder='celebrity name, biography, age, movies'
                />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Instagram
                </label>
                <input
                  type='url'
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleChange('socialMedia.instagram', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://instagram.com/username'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Twitter
                </label>
                <input
                  type='url'
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleChange('socialMedia.twitter', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://twitter.com/username'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Facebook
                </label>
                <input
                  type='url'
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleChange('socialMedia.facebook', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://facebook.com/username'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  YouTube
                </label>
                <input
                  type='url'
                  value={formData.socialMedia.youtube}
                  onChange={(e) => handleChange('socialMedia.youtube', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://youtube.com/@username'
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
                    Publish Date & Time
                  </label>
                  <input
                    type='datetime-local'
                    value={formData.publishAt || ''}
                    onChange={(e) => handleChange('publishAt', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              )}

              <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                <input
                  type='checkbox'
                  id='isFeatured'
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                />
                <label
                  htmlFor='isFeatured'
                  className='text-sm font-medium text-black dark:text-white cursor-pointer'
                >
                  Mark as Featured
                </label>
              </div>

              <div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                <input
                  type='checkbox'
                  id='isVerified'
                  checked={formData.isVerified}
                  onChange={(e) => handleChange('isVerified', e.target.checked)}
                  className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                />
                <label
                  htmlFor='isVerified'
                  className='text-sm font-medium text-black dark:text-white cursor-pointer'
                >
                  Mark as Verified
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
