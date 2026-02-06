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

interface CastMember {
  name: string
  role: string
  character: string
  image: string
}

interface TicketLink {
  platform: string
  url: string
  available: boolean
}

interface MovieFormProps {
  movie: any
  onSave: (data: any) => void
  onCancel: () => void
  isEdit: boolean
}

const movieStatuses = ['Announced', 'In Production', 'Post-Production', 'Released', 'Cancelled']
const mpaaRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U/A', 'A']

export default function MovieForm({
  movie,
  onSave,
  onCancel,
  isEdit,
}: MovieFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [uploadProgressPoster, setUploadProgressPoster] = useState<number | null>(null)
  const [uploadProgressBackdrop, setUploadProgressBackdrop] = useState<number | null>(null)
  const [previewPoster, setPreviewPoster] = useState<string>('')
  const [previewBackdrop, setPreviewBackdrop] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    releaseDate: '',
    poster: '',
    backdrop: '',
    language: '',
    originalLanguage: '',
    worldwide: false,
    genre: [] as string[],
    director: '',
    cast: [] as CastMember[],
    synopsis: '',
    plotSummary: '',
    status: 'Announced',
    anticipationScore: 0,
    duration: 0,
    mpaaRating: '',
    regions: [] as string[],
    subtitles: [] as string[],
    boxOfficeProjection: 0,
    budget: 0,
    featured: false,
    images: [] as string[],
    preOrderAvailable: false,
    producers: [] as string[],
    productionNotes: '',
    studio: '',
    ticketLinks: [] as TicketLink[],
    trailer: '',
    writers: [] as string[],
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[],
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
    if (movie) {
      setFormData({
        ...formData,
        ...movie,
        releaseDate: movie.releaseDate
          ? new Date(movie.releaseDate).toISOString().split('T')[0]
          : '',
        genre: movie.genre || [],
        cast: movie.cast || [],
        regions: movie.regions || [],
        subtitles: movie.subtitles || [],
        producers: movie.producers || [],
        writers: movie.writers || [],
        ticketLinks: movie.ticketLinks || [],
        images: movie.images || [],
        seoData: {
          metaTitle: movie.seoData?.metaTitle || '',
          metaDescription: movie.seoData?.metaDescription || '',
          keywords: movie.seoData?.keywords || [],
        },
      })
      if (movie.poster) setPreviewPoster(movie.poster)
      if (movie.backdrop) setPreviewBackdrop(movie.backdrop)
    }
  }, [movie])

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
    const movieSlug = formData.slug || 'movie'
    const filename = `${folder}-${timestamp}.${file.name.split('.').pop()}`
    const storageReference = storageRef(storage, `movies/${movieSlug}/${folder}/${filename}`)

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

  const handleFileUpload = async (file: File, type: 'poster' | 'backdrop') => {
    if (!file) return

    if (!formData.title || !formData.slug) {
      alert('Please enter a title first')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      const setProgress = type === 'poster' ? setUploadProgressPoster : setUploadProgressBackdrop
      setProgress(0)
      const url = await uploadToFirebase(file, type, setProgress)
      setFormData({ ...formData, [type]: url })
      if (type === 'poster') setPreviewPoster(url)
      else setPreviewBackdrop(url)
      setProgress(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload image. Please try again.')
      if (type === 'poster') setUploadProgressPoster(null)
      else setUploadProgressBackdrop(null)
    }
  }

  const deleteFromFirebaseByUrl = async (url: string) => {
    try {
      initFirebase()
      const storage = getStorage()
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

  const handleRemoveImage = async (type: 'poster' | 'backdrop') => {
    const url = type === 'poster' ? formData.poster : formData.backdrop
    if (!url) return

    const confirmDelete = confirm('Are you sure you want to remove this image?')
    if (!confirmDelete) return

    try {
      await deleteFromFirebaseByUrl(url)
      setFormData({ ...formData, [type]: '' })
      if (type === 'poster') setPreviewPoster('')
      else setPreviewBackdrop('')
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to remove image')
    }
  }

  // Cast management
  const addCastMember = () => {
    setFormData({
      ...formData,
      cast: [...formData.cast, { name: '', role: '', character: '', image: '' }],
    })
  }

  const updateCastMember = (index: number, field: string, value: string) => {
    const newCast = [...formData.cast]
    newCast[index] = { ...newCast[index], [field]: value }
    setFormData({ ...formData, cast: newCast })
  }

  const removeCastMember = (index: number) => {
    const newCast = formData.cast.filter((_, i) => i !== index)
    setFormData({ ...formData, cast: newCast })
  }

  // Ticket Links management
  const addTicketLink = () => {
    setFormData({
      ...formData,
      ticketLinks: [...formData.ticketLinks, { platform: '', url: '', available: true }],
    })
  }

  const updateTicketLink = (index: number, field: string, value: any) => {
    const newLinks = [...formData.ticketLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setFormData({ ...formData, ticketLinks: newLinks })
  }

  const removeTicketLink = (index: number) => {
    const newLinks = formData.ticketLinks.filter((_, i) => i !== index)
    setFormData({ ...formData, ticketLinks: newLinks })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'mdi:information' },
    { id: 'media', label: 'Media', icon: 'mdi:image' },
    { id: 'cast', label: 'Cast & Crew', icon: 'mdi:account-group' },
    { id: 'details', label: 'Details', icon: 'mdi:text-box' },
    { id: 'tickets', label: 'Tickets', icon: 'mdi:ticket' },
    { id: 'seo', label: 'SEO', icon: 'mdi:search-web' },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-1 sm:space-y-2 mt-0 -mt-4 sm:-mt-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 py-0'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
            {isEdit ? 'Edit Movie' : 'Add New Movie'}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base sm:ml-3'>
            {isEdit ? 'Update movie details' : 'Add a new upcoming movie'}
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
                  placeholder='Enter movie title'
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
                  placeholder='movie-slug'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Release Date <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='date'
                    value={formData.releaseDate}
                    onChange={(e) => handleChange('releaseDate', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Status <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    {movieStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Language <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='English'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Duration (min)
                  </label>
                  <input
                    type='number'
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                    min='0'
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='120'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    MPAA Rating
                  </label>
                  <select
                    value={formData.mpaaRating}
                    onChange={(e) => handleChange('mpaaRating', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>Select Rating</option>
                    {mpaaRatings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Genre (comma separated) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.genre.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'genre',
                      e.target.value.split(',').map((g) => g.trim()).filter(Boolean)
                    )
                  }
                  required
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Action, Drama, Thriller'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Anticipation Score (0-10)
                  </label>
                  <input
                    type='number'
                    value={formData.anticipationScore}
                    onChange={(e) => handleChange('anticipationScore', parseFloat(e.target.value) || 0)}
                    min='0'
                    max='10'
                    step='0.1'
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='flex items-center gap-4 pt-7'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.worldwide}
                      onChange={(e) => handleChange('worldwide', e.target.checked)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-black dark:text-white'>
                      Worldwide Release
                    </span>
                  </label>

                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-black dark:text-white'>
                      Featured
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className='space-y-6'>
              {/* Poster */}
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Poster Image <span className='text-red-500'>*</span>
                </label>
                {!previewPoster && (
                  <div className='space-y-3'>
                    <div
                      className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'
                      onClick={() => document.getElementById('poster-upload')?.click()}
                    >
                      <Icon
                        icon='mdi:cloud-upload'
                        width='48'
                        height='48'
                        className='mx-auto mb-4 text-gray-400'
                      />
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        Click to upload poster image
                      </p>
                      <input
                        id='poster-upload'
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'poster')
                        }}
                        className='hidden'
                      />
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>OR</span>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                    </div>
                    <input
                      type='url'
                      placeholder='Enter poster image URL'
                      onChange={(e) => {
                        const url = e.target.value
                        if (url) {
                          setFormData({ ...formData, poster: url })
                          setPreviewPoster(url)
                        }
                      }}
                      className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                )}
                {uploadProgressPoster !== null && uploadProgressPoster < 100 && (
                  <div className='mt-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>Uploading...</span>
                      <span className='text-sm font-medium text-blue-600'>{Math.round(uploadProgressPoster)}%</span>
                    </div>
                    <div className='w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-blue-600 transition-all duration-300'
                        style={{ width: `${uploadProgressPoster}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {previewPoster && (
                  <div className='mt-4 relative'>
                    <img
                      src={previewPoster}
                      alt='Poster preview'
                      className='w-full h-96 object-cover rounded-xl border border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage('poster')}
                      className='absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                      <Icon icon='mdi:delete' width='20' height='20' />
                    </button>
                  </div>
                )}
              </div>

              {/* Backdrop */}
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Backdrop Image <span className='text-red-500'>*</span>
                </label>
                {!previewBackdrop && (
                  <div className='space-y-3'>
                    <div
                      className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'
                      onClick={() => document.getElementById('backdrop-upload')?.click()}
                    >
                      <Icon
                        icon='mdi:cloud-upload'
                        width='48'
                        height='48'
                        className='mx-auto mb-4 text-gray-400'
                      />
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        Click to upload backdrop image
                      </p>
                      <input
                        id='backdrop-upload'
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'backdrop')
                        }}
                        className='hidden'
                      />
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>OR</span>
                      <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800'></div>
                    </div>
                    <input
                      type='url'
                      placeholder='Enter backdrop image URL'
                      onChange={(e) => {
                        const url = e.target.value
                        if (url) {
                          setFormData({ ...formData, backdrop: url })
                          setPreviewBackdrop(url)
                        }
                      }}
                      className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                )}
                {uploadProgressBackdrop !== null && uploadProgressBackdrop < 100 && (
                  <div className='mt-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>Uploading...</span>
                      <span className='text-sm font-medium text-blue-600'>{Math.round(uploadProgressBackdrop)}%</span>
                    </div>
                    <div className='w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-blue-600 transition-all duration-300'
                        style={{ width: `${uploadProgressBackdrop}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {previewBackdrop && (
                  <div className='mt-4 relative'>
                    <img
                      src={previewBackdrop}
                      alt='Backdrop preview'
                      className='w-full h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage('backdrop')}
                      className='absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                      <Icon icon='mdi:delete' width='20' height='20' />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Trailer URL
                </label>
                <input
                  type='url'
                  value={formData.trailer}
                  onChange={(e) => handleChange('trailer', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='https://youtube.com/watch?v=...'
                />
              </div>
            </div>
          )}

          {/* Cast & Crew Tab */}
          {activeTab === 'cast' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Director <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.director}
                  onChange={(e) => handleChange('director', e.target.value)}
                  required
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Director name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Writers (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.writers.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'writers',
                      e.target.value.split(',').map((w) => w.trim()).filter(Boolean)
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Writer 1, Writer 2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Producers (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.producers.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'producers',
                      e.target.value.split(',').map((p) => p.trim()).filter(Boolean)
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Producer 1, Producer 2'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Studio
                </label>
                <input
                  type='text'
                  value={formData.studio}
                  onChange={(e) => handleChange('studio', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Production studio'
                />
              </div>

              {/* Cast Members */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-medium text-black dark:text-white'>
                    Cast Members
                  </label>
                  <button
                    type='button'
                    onClick={addCastMember}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Cast
                  </button>
                </div>

                {formData.cast.map((member: any, index: number) => (
                  <div key={index} className='border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                      <input
                        type='text'
                        value={member.name}
                        onChange={(e) => updateCastMember(index, 'name', e.target.value)}
                        placeholder='Actor name'
                        className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <input
                        type='text'
                        value={member.character || ''}
                        onChange={(e) => updateCastMember(index, 'character', e.target.value)}
                        placeholder='Character name'
                        className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <input
                        type='text'
                        value={member.role || ''}
                        onChange={(e) => updateCastMember(index, 'role', e.target.value)}
                        placeholder='Role (Lead, Supporting, etc.)'
                        className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <div className='flex gap-2'>
                        <input
                          type='url'
                          value={member.image || ''}
                          onChange={(e) => updateCastMember(index, 'image', e.target.value)}
                          placeholder='Image URL'
                          className='flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                        />
                        <button
                          type='button'
                          onClick={() => removeCastMember(index)}
                          className='px-3 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'
                        >
                          <Icon icon='mdi:delete' width='18' height='18' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Synopsis <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={formData.synopsis}
                  onChange={(e) => handleChange('synopsis', e.target.value)}
                  required
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Brief synopsis of the movie'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Plot Summary
                </label>
                <textarea
                  value={formData.plotSummary}
                  onChange={(e) => handleChange('plotSummary', e.target.value)}
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Detailed plot summary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Production Notes
                </label>
                <textarea
                  value={formData.productionNotes}
                  onChange={(e) => handleChange('productionNotes', e.target.value)}
                  rows={3}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Behind the scenes info, production details'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Budget (₹)
                  </label>
                  <input
                    type='number'
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
                    min='0'
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Box Office Projection (₹)
                  </label>
                  <input
                    type='number'
                    value={formData.boxOfficeProjection}
                    onChange={(e) => handleChange('boxOfficeProjection', parseInt(e.target.value) || 0)}
                    min='0'
                    className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='0'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Regions (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.regions.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'regions',
                      e.target.value.split(',').map((r) => r.trim()).filter(Boolean)
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='India, USA, UK'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Subtitles (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.subtitles.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'subtitles',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='English, Hindi, Tamil'
                />
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={formData.preOrderAvailable}
                    onChange={(e) => handleChange('preOrderAvailable', e.target.checked)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm font-medium text-black dark:text-white'>
                    Pre-order Available
                  </span>
                </label>
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-medium text-black dark:text-white'>
                    Ticket Links
                  </label>
                  <button
                    type='button'
                    onClick={addTicketLink}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Link
                  </button>
                </div>

                {formData.ticketLinks.map((link: any, index: number) => (
                  <div key={index} className='border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-3'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-2'>
                      <input
                        type='text'
                        value={link.platform}
                        onChange={(e) => updateTicketLink(index, 'platform', e.target.value)}
                        placeholder='Platform name (BookMyShow, etc.)'
                        className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <input
                        type='url'
                        value={link.url}
                        onChange={(e) => updateTicketLink(index, 'url', e.target.value)}
                        placeholder='https://...'
                        className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <div className='flex gap-2'>
                        <label className='flex items-center gap-2 flex-1'>
                          <input
                            type='checkbox'
                            checked={link.available}
                            onChange={(e) => updateTicketLink(index, 'available', e.target.checked)}
                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                          />
                          <span className='text-sm text-gray-600 dark:text-gray-400'>Available</span>
                        </label>
                        <button
                          type='button'
                          onClick={() => removeTicketLink(index)}
                          className='px-3 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'
                        >
                          <Icon icon='mdi:delete' width='18' height='18' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  value={formData.seoData.metaTitle}
                  onChange={(e) => handleChange('seoData.metaTitle', e.target.value)}
                  maxLength={60}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='SEO title'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {formData.seoData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Meta Description
                </label>
                <textarea
                  value={formData.seoData.metaDescription}
                  onChange={(e) => handleChange('seoData.metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='SEO description'
                />
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {formData.seoData.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                  Keywords (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.seoData.keywords.join(', ')}
                  onChange={(e) =>
                    handleChange(
                      'seoData.keywords',
                      e.target.value.split(',').map((k) => k.trim()).filter(Boolean)
                    )
                  }
                  className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='keyword1, keyword2, keyword3'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
