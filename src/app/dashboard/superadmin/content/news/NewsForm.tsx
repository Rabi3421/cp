'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import RichTextEditor from '@/app/components/Common/RichTextEditor'
import axios from 'axios'

interface NewsFormProps {
  news: any
  onSave: (data: any) => void
  onCancel: () => void
  isEdit: boolean
}

export default function NewsForm({
  news,
  onSave,
  onCancel,
  isEdit,
}: NewsFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [celebrities, setCelebrities] = useState([])
  const [loadingCelebrities, setLoadingCelebrities] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('')
  const [deletingThumbnail, setDeletingThumbnail] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    thumbnail: '',
    author: '',
    tags: [],
    category: '',
    celebrity: '',
    publishDate: new Date().toISOString().split('T')[0],
    featured: false,
    status: 'draft',
    publishAt: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      focusKeyword: '',
    },
  })

  // Initialize Firebase
  const initFirebase = () => {
    if (getApps().length === 0) {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }
      initializeApp(firebaseConfig)
    }
  }

  useEffect(() => {
    fetchCelebrities()
  }, [])

  useEffect(() => {
    if (news) {
      setFormData({
        ...formData,
        ...news,
        celebrity: typeof news.celebrity === 'object' ? news.celebrity?._id : news.celebrity || '',
        publishDate: news.publishDate
          ? new Date(news.publishDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        content: news.content || '',
        tags: news.tags || [],
        seo: {
          metaTitle: news.seo?.metaTitle || '',
          metaDescription: news.seo?.metaDescription || '',
          metaKeywords: news.seo?.metaKeywords || [],
          focusKeyword: news.seo?.focusKeyword || '',
        },
      })
      if (news.thumbnail) {
        setPreviewThumbnail(news.thumbnail)
      }
    }
  }, [news])

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

  // Firebase upload helper
  const uploadToFirebase = async (
    file: File,
    folder: string,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    initFirebase()
    const storage = getStorage()
    const timestamp = Date.now()
    const filename = `${folder}_${timestamp}.${file.name.split('.').pop()}`
    const storageReference = storageRef(storage, `news/${filename}`)

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageReference, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress(progress)
        },
        (error) => {
          console.error('Upload error:', error)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadProgress(0)
      const url = await uploadToFirebase(file, 'news', setUploadProgress)
      setFormData({ ...formData, thumbnail: url })
      setPreviewThumbnail(url)
      setUploadProgress(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload image. Please try again.')
      setUploadProgress(null)
    }
  }

  const deleteFromFirebaseByUrl = async (url: string) => {
    try {
      initFirebase()
      const storage = getStorage()
      // Extract path from Firebase Storage URL
      const urlObj = new URL(url)
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/)
      if (pathMatch && pathMatch[1]) {
        const path = decodeURIComponent(pathMatch[1])
        const fileRef = storageRef(storage, path)
        await deleteObject(fileRef)
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting from Firebase:', error)
      return false
    }
  }

  const handleRemoveImage = async () => {
    if (!formData.thumbnail) return

    const confirmDelete = confirm('Are you sure you want to remove this image?')
    if (!confirmDelete) return

    setDeletingThumbnail(true)
    try {
      await deleteFromFirebaseByUrl(formData.thumbnail)
      setFormData({ ...formData, thumbnail: '' })
      setPreviewThumbnail('')
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to remove image')
    } finally {
      setDeletingThumbnail(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'mdi:information' },
    { id: 'content', label: 'Content', icon: 'mdi:text-box' },
    { id: 'thumbnail', label: 'Thumbnail', icon: 'mdi:image' },
    { id: 'seo', label: 'SEO', icon: 'mdi:search-web' },
    { id: 'publish', label: 'Publish', icon: 'mdi:send' },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-1 sm:space-y-2 mt-0 -mt-4 sm:-mt-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 py-0'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
            {isEdit ? 'Edit News' : 'Add New News'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
            {isEdit ? 'Update news article' : 'Create a new news article'}
          </p>
        </div>
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm sm:text-base'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base'
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
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

        <div className='p-2 sm:p-4 max-h-[80vh] overflow-y-auto'>
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
                  placeholder='Enter news title'
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
                  placeholder='news-slug'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Excerpt <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  required
                  rows={3}
                  maxLength={500}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Brief summary of the news article...'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {formData.excerpt.length}/500 characters
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Author <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Author name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Publish Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='date'
                    value={formData.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Category
                  </label>
                  <input
                    type='text'
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='News category'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Related Celebrity
                  </label>
                  <select
                    value={formData.celebrity}
                    onChange={(e) => handleChange('celebrity', e.target.value)}
                    disabled={loadingCelebrities}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>
                      {loadingCelebrities ? 'Loading celebrities...' : 'Select a celebrity (optional)'}
                    </option>
                    {celebrities.map((celeb: any) => (
                      <option key={celeb._id} value={celeb._id}>
                        {celeb.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  placeholder='tag1, tag2, tag3'
                />
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className='space-y-6'>
              <RichTextEditor
                label='Article Content'
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                placeholder='Write the full news article content...'
                height='500px'
              />
            </div>
          )}

          {/* Thumbnail Tab */}
          {activeTab === 'thumbnail' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Thumbnail Image <span className='text-red-500'>*</span>
                </label>
                
                {/* Upload Area */}
                {!previewThumbnail && (
                  <div className='space-y-3'>
                    {/* Drag & Drop / File Select */}
                    <div
                      className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-blue-500')
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-blue-500')
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-blue-500')
                        const file = e.dataTransfer.files[0]
                        if (file) handleFileUpload(file)
                      }}
                    >
                      <Icon
                        icon='mdi:cloud-upload'
                        width='48'
                        height='48'
                        className='mx-auto mb-4 text-gray-400'
                      />
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        Drag and drop an image here, or click to select
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-500'>
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <input
                        id='thumbnail-upload'
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                        className='hidden'
                      />
                    </div>

                    {/* OR divider */}
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>OR</span>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <input
                        type='url'
                        placeholder='Enter image URL'
                        onChange={(e) => {
                          const url = e.target.value
                          if (url) {
                            setFormData({ ...formData, thumbnail: url })
                            setPreviewThumbnail(url)
                          }
                        }}
                        className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress !== null && uploadProgress < 100 && (
                  <div className='mt-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        Uploading...
                      </span>
                      <span className='text-sm font-medium text-blue-600'>
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className='w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-blue-600 transition-all duration-300'
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Preview */}
                {previewThumbnail && (
                  <div className='mt-4 relative'>
                    <img
                      src={previewThumbnail}
                      alt='Thumbnail preview'
                      className='w-full h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={handleRemoveImage}
                      disabled={deletingThumbnail}
                      className='absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
                    >
                      <Icon icon='mdi:delete' width='20' height='20' />
                    </button>
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
                  maxLength={60}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='SEO title'
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
                  placeholder='SEO description'
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
                  placeholder='Primary keyword'
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
                  placeholder='keyword1, keyword2, keyword3'
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
                  id='featured'
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <label
                  htmlFor='featured'
                  className='text-sm font-medium text-black dark:text-white'
                >
                  Featured Article
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
