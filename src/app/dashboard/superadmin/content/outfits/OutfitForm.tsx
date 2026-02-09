'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect, useRef } from 'react'
import RichTextEditor from '@/app/components/Common/RichTextEditor'
import axios from 'axios'
import { getApps, initializeApp } from 'firebase/app'
import { getStorage, ref as storageRef, uploadBytesResumable, deleteObject, getDownloadURL } from 'firebase/storage'

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
    likesCount: 0,
    commentsCount: 0,
    viewCount: 0,
    shareCount: 0,
    status: 'draft',
    publishAt: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      canonicalUrl: '',
      noindex: false,
      nofollow: false,
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogType: 'product',
      ogSiteName: 'Celebrity Persona',
      ogUrl: '',
      ogImages: [],
      ogLocale: 'en_US',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterSite: '@celebritypersona',
      twitterCreator: '@celebritypersona',
      schemaType: 'Product',
      schemaJson: null,
      publishedTime: '',
      modifiedTime: '',
      authorName: '',
      tags: [],
      section: 'Celebrity Outfits',
      alternateLangs: [],
      prevUrl: '',
      nextUrl: '',
      canonicalAlternates: [],
      focusKeyword: '',
      structuredDataDepth: 'minimal',
      contentScore: 0,
      readabilityScore: 0,
      relatedTopics: [],
      searchVolume: 0,
      authorUrl: '',
    },
  })

  // Firebase upload state for images
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: number }>({})
  const [deletingImages, setDeletingImages] = useState<{ [key: string]: boolean }>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // map previewUrl -> uploadKey for in-progress uploads
  const [previewToKey, setPreviewToKey] = useState<{ [previewUrl: string]: string }>({})

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

  const initFirebase = () => {
    try {
      if (typeof window === 'undefined') return null
      if (!getApps().length) {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        }
        initializeApp(firebaseConfig)
      }
      return getStorage()
    } catch (err) {
      console.error('Firebase init error', err)
      return null
    }
  }

  const uploadToFirebase = (file: File, folder: string, onProgress?: (pct: number) => void) => {
    return new Promise<string>((resolve, reject) => {
      try {
        const storage = initFirebase()
        if (!storage) return reject(new Error('Firebase Storage not initialized'))
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `${folder}/${timestamp}_${safeName}`
        const fbRef = storageRef(storage, path)
        const task = uploadBytesResumable(fbRef, file)
        task.on(
          'state_changed',
          (snapshot) => {
            if (onProgress && snapshot.totalBytes) {
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              onProgress(pct)
            }
          },
          (err) => reject(err),
          async () => {
            try {
              const url = await getDownloadURL(fbRef)
              resolve(url)
            } catch (err) {
              reject(err)
            }
          }
        )
      } catch (err) {
        reject(err)
      }
    })
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

  const getFolderName = () => {
    // require a selected celebrity and a title/slug
    const celebId = formData.celebrity
    if (!celebId) return ''
    const celeb = celebrities.find((c: any) => c._id === celebId) as any
    const celebSlug = (celeb && (celeb.slug || celeb.name)) || ''
    const titleSlug = formData.slug || formData.title || ''
    const slugify = (value: string) =>
      value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    if (!celebSlug || !titleSlug) return ''
    return `${slugify(celebSlug)}/${slugify(titleSlug)}`
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const folder = getFolderName()
    if (!folder) {
      window.alert('Please select a celebrity and provide a title/slug before uploading images.')
      return
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const uploadKey = `${Date.now()}_${Math.random()}`
      // create preview object URL so user sees image immediately
      const previewUrl = URL.createObjectURL(file)
      // register mapping so UI can show progress for this preview
      setPreviewToKey((prev) => ({ ...prev, [previewUrl]: uploadKey }))
      // add preview to images array immediately
      setFormData((prev) => ({ ...prev, images: [...(prev.images || []), previewUrl] }))

      try {
        setUploadingImages((prev) => ({ ...prev, [uploadKey]: 0 }))
        const url = await uploadToFirebase(file, folder, (pct) => {
          setUploadingImages((prev) => ({ ...prev, [uploadKey]: pct }))
        })

        // replace previewUrl with final download URL in images array
        setFormData((prev) => {
          const imgs = Array.isArray(prev.images) ? [...prev.images] : []
          const idx = imgs.indexOf(previewUrl)
          if (idx !== -1) imgs[idx] = url
          else imgs.push(url)
          return { ...prev, images: imgs }
        })
      } catch (err) {
        console.error('Outfit image upload error', err)
        // remove preview on failure
        setFormData((prev) => ({ ...prev, images: (prev.images || []).filter((i: string) => i !== previewUrl) }))
      } finally {
        // clean preview mapping and uploading state
        setUploadingImages((prev) => {
          const u = { ...prev }
          delete u[uploadKey]
          return u
        })
        setPreviewToKey((prev) => {
          const p = { ...prev }
          delete p[previewUrl]
          return p
        })
        // revoke object URL
        try { URL.revokeObjectURL(previewUrl) } catch (e) { /* ignore */ }
      }
    })

    await Promise.all(uploadPromises)
  }

  const handleRemoveUploadedImage = async (url: string, index: number) => {
    const confirm = window.confirm('Remove this image? This will also delete it from Firebase if it was uploaded.')
    if (!confirm) return

    try {
      setDeletingImages((prev) => ({ ...prev, [url]: true }))
      // if this is a preview URL (object URL), just remove it locally
      if (/^blob:/.test(url)) {
        const updated = (formData.images || []).filter((_, i) => i !== index)
        setFormData((prev) => ({ ...prev, images: updated }))
        try { URL.revokeObjectURL(url) } catch (e) { /* ignore */ }
        return
      }
      if (/\/o\//.test(url)) {
        try {
          // attempt to extract path and delete
          const m = url.match(/\/o\/(.+)\?/) 
          if (m && m[1]) {
            const path = decodeURIComponent(m[1])
            const storage = initFirebase()
            if (storage) {
              const fbRef = storageRef(storage, path)
              await deleteObject(fbRef)
            }
          }
        } catch (err) {
          console.warn('Failed to delete from Firebase', err)
        }
      }

      const updated = (formData.images || []).filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, images: updated }))
    } finally {
      setDeletingImages((prev) => {
        const d = { ...prev }
        delete d[url]
        return d
      })
    }
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
    <form onSubmit={handleSubmit} className='space-y-1 sm:space-y-2 mt-0 -mt-4 sm:-mt-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 py-0'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
            {isEdit ? 'Edit Outfit' : 'Add New Outfit'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
            {isEdit ? 'Update outfit details' : 'Create a new celebrity outfit'}
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
                <div className='flex items-center gap-2'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                  >
                    <Icon icon='mdi:upload' width='16' height='16' />
                    Upload Images
                  </button>
                  <button
                    type='button'
                    onClick={addImageField}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Image
                  </button>
                </div>
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
                      .map((image, index) => {
                                const uploadKey = previewToKey[image]
                                const progress = uploadKey ? uploadingImages[uploadKey] : undefined
                                return (
                                  <div key={index} className='relative aspect-square'>
                                    <img
                                      src={image}
                                      alt={`Outfit ${index + 1}`}
                                      className='w-full h-full object-cover rounded-xl border border-gray-200 dark:border-gray-800'
                                      onError={(e) => {
                                        ;(e.target as HTMLImageElement).style.display = 'none'
                                      }}
                                    />

                                    {progress !== undefined && (
                                      <div className='absolute inset-0 bg-black/30 rounded-xl flex items-end p-3'>
                                        <div className='w-full'>
                                          <div className='w-full h-2 bg-white/40 rounded overflow-hidden'>
                                            <div className='h-2 bg-green-500 rounded' style={{ width: `${progress}%` }} />
                                          </div>
                                          <p className='text-xs text-white mt-2 text-center'>{progress}%</p>
                                        </div>
                                      </div>
                                    )}

                                    <div className='absolute top-2 right-2 flex gap-2'>
                                      <button
                                        type='button'
                                        onClick={() => handleRemoveUploadedImage(image, index)}
                                        disabled={!!deletingImages[image]}
                                        className='px-2 py-1 bg-white/80 dark:bg-gray-900/80 text-red-600 rounded-lg border border-red-200 dark:border-red-800 hover:bg-white dark:hover:bg-gray-900 transition-colors'
                                      >
                                        <Icon icon='mdi:delete' width='16' height='16' />
                                      </button>
                                    </div>
                                  </div>
                                )
                        })}
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Likes Count
                  </label>
                  <input
                    type='number'
                    value={formData.likesCount}
                    onChange={(e) => handleChange('likesCount', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Comments Count
                  </label>
                  <input
                    type='number'
                    value={formData.commentsCount}
                    onChange={(e) => handleChange('commentsCount', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    View Count
                  </label>
                  <input
                    type='number'
                    value={formData.viewCount}
                    onChange={(e) => handleChange('viewCount', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Share Count
                  </label>
                  <input
                    type='number'
                    value={formData.shareCount}
                    onChange={(e) => handleChange('shareCount', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Canonical URL
                  </label>
                  <input
                    type='url'
                    value={formData.seo.canonicalUrl}
                    onChange={(e) => handleChange('seo.canonicalUrl', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='https://celebritypersona.com/outfits/slug'
                  />
                </div>

                <div className='flex items-center gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={!!formData.seo.noindex}
                      onChange={(e) => handleChange('seo.noindex', e.target.checked)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm text-black dark:text-white'>Noindex</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={!!formData.seo.nofollow}
                      onChange={(e) => handleChange('seo.nofollow', e.target.checked)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm text-black dark:text-white'>Nofollow</span>
                  </label>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>OG Title</label>
                  <input
                    type='text'
                    value={formData.seo.ogTitle}
                    onChange={(e) => handleChange('seo.ogTitle', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>OG Description</label>
                  <input
                    type='text'
                    value={formData.seo.ogDescription}
                    onChange={(e) => handleChange('seo.ogDescription', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>OG URL</label>
                  <input
                    type='url'
                    value={formData.seo.ogUrl}
                    onChange={(e) => handleChange('seo.ogUrl', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>OG Images (comma separated)</label>
                  <input
                    type='text'
                    value={(formData.seo.ogImages || []).join(', ')}
                    onChange={(e) => handleChange('seo.ogImages', e.target.value.split(',').map((s: string) => s.trim()))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='https://...jpg, https://...jpg'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Twitter Title</label>
                  <input
                    type='text'
                    value={formData.seo.twitterTitle}
                    onChange={(e) => handleChange('seo.twitterTitle', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Twitter Description</label>
                  <input
                    type='text'
                    value={formData.seo.twitterDescription}
                    onChange={(e) => handleChange('seo.twitterDescription', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Schema Type</label>
                  <input
                    type='text'
                    value={formData.seo.schemaType}
                    onChange={(e) => handleChange('seo.schemaType', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Author Name</label>
                  <input
                    type='text'
                    value={formData.seo.authorName}
                    onChange={(e) => handleChange('seo.authorName', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Content Score</label>
                  <input
                    type='number'
                    value={formData.seo.contentScore}
                    onChange={(e) => handleChange('seo.contentScore', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>Readability Score</label>
                  <input
                    type='number'
                    value={formData.seo.readabilityScore}
                    onChange={(e) => handleChange('seo.readabilityScore', parseInt(e.target.value || '0'))}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>Related Topics (comma separated)</label>
                <input
                  type='text'
                  value={(formData.seo.relatedTopics || []).join(', ')}
                  onChange={(e) => handleChange('seo.relatedTopics', e.target.value.split(',').map((s: string) => s.trim()))}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
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
