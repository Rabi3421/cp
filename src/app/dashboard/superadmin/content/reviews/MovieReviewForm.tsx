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
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
  () => import('@/app/components/Common/RichTextEditor'),
  { ssr: false }
)

interface CastMember {
  name: string
  character: string
  image: string
}

interface MovieReviewFormProps {
  review: any
  onSave: (data: any) => void
  onCancel: () => void
  isEdit: boolean
}

const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Romance', 'Mystery', 'Adventure', 'Fantasy']
const mpaaRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U/A', 'A']

export default function MovieReviewForm({
  review,
  onSave,
  onCancel,
  isEdit,
}: MovieReviewFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [uploadProgressPoster, setUploadProgressPoster] = useState<number | null>(null)
  const [uploadProgressBackdrop, setUploadProgressBackdrop] = useState<number | null>(null)
  const [uploadProgressAuthorAvatar, setUploadProgressAuthorAvatar] = useState<number | null>(null)
  const [previewPoster, setPreviewPoster] = useState<string>('')
  const [previewBackdrop, setPreviewBackdrop] = useState<string>('')
  const [previewAuthorAvatar, setPreviewAuthorAvatar] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    movieTitle: '',
    poster: '',
    backdropImage: '',
    trailer: '',
    rating: 0,
    content: '',
    excerpt: '',
    author: {
      name: '',
      avatar: '',
      bio: '',
      credentials: '',
      reviewCount: 0,
      socialMedia: {
        twitter: '',
        instagram: '',
        website: '',
      },
    },
    movieDetails: {
      releaseYear: new Date().getFullYear(),
      director: '',
      writers: [] as string[],
      cast: [] as CastMember[],
      genre: [] as string[],
      runtime: 0,
      budget: '',
      boxOffice: '',
      studio: '',
      mpaaRating: '',
    },
    scores: {
      criticsScore: 0,
      audienceScore: 0,
      imdbRating: 0,
      rottenTomatoesScore: 0,
    },
    publishDate: new Date().toISOString().split('T')[0],
    featured: false,
    pros: [] as string[],
    cons: [] as string[],
    verdict: '',
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
    if (review) {
      setFormData({
        ...formData,
        ...review,
        publishDate: review.publishDate
          ? new Date(review.publishDate).toISOString().split('T')[0]
          : formData.publishDate,
        movieDetails: {
          ...formData.movieDetails,
          ...review.movieDetails,
          writers: review.movieDetails?.writers || [],
          cast: review.movieDetails?.cast || [],
          genre: review.movieDetails?.genre || [],
        },
        author: {
          ...formData.author,
          ...review.author,
          socialMedia: {
            ...formData.author.socialMedia,
            ...review.author?.socialMedia,
          },
        },
        scores: {
          ...formData.scores,
          ...review.scores,
        },
        pros: review.pros || [],
        cons: review.cons || [],
        seoData: {
          ...formData.seoData,
          ...review.seoData,
          keywords: review.seoData?.keywords || [],
        },
      })
      setPreviewPoster(review.poster || '')
      setPreviewBackdrop(review.backdropImage || '')
      setPreviewAuthorAvatar(review.author?.avatar || '')
    }
  }, [review])

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [parent]: {
        ...(formData as any)[parent],
        [field]: value,
      },
    })
  }

  const handleAuthorSocialMediaChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      author: {
        ...formData.author,
        socialMedia: {
          ...formData.author.socialMedia,
          [field]: value,
        },
      },
    })
  }

  const handleArrayInputChange = (parent: string, field: string, value: string) => {
    const values = value.split(',').map((v) => v.trim()).filter((v) => v)
    setFormData({
      ...formData,
      [parent]: {
        ...(formData as any)[parent],
        [field]: values,
      },
    })
  }

  const handleGenreToggle = (genre: string) => {
    const currentGenres = formData.movieDetails.genre
    if (currentGenres.includes(genre)) {
      setFormData({
        ...formData,
        movieDetails: {
          ...formData.movieDetails,
          genre: currentGenres.filter((g) => g !== genre),
        },
      })
    } else {
      setFormData({
        ...formData,
        movieDetails: {
          ...formData.movieDetails,
          genre: [...currentGenres, genre],
        },
      })
    }
  }

  const addCastMember = () => {
    setFormData({
      ...formData,
      movieDetails: {
        ...formData.movieDetails,
        cast: [...formData.movieDetails.cast, { name: '', character: '', image: '' }],
      },
    })
  }

  const updateCastMember = (index: number, field: string, value: string) => {
    const newCast = [...formData.movieDetails.cast]
    newCast[index] = { ...newCast[index], [field]: value }
    setFormData({
      ...formData,
      movieDetails: {
        ...formData.movieDetails,
        cast: newCast,
      },
    })
  }

  const removeCastMember = (index: number) => {
    setFormData({
      ...formData,
      movieDetails: {
        ...formData.movieDetails,
        cast: formData.movieDetails.cast.filter((_, i) => i !== index),
      },
    })
  }

  const addProCon = (type: 'pros' | 'cons') => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ''],
    })
  }

  const updateProCon = (type: 'pros' | 'cons', index: number, value: string) => {
    const newArray = [...formData[type]]
    newArray[index] = value
    setFormData({
      ...formData,
      [type]: newArray,
    })
  }

  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
    })
  }

  // Firebase upload handlers
  const handleFileUpload = async (
    file: File,
    type: 'poster' | 'backdrop' | 'authorAvatar'
  ) => {
    if (!file) return

    if (!formData.slug) {
      alert('Please enter a slug first')
      return
    }

    initFirebase()
    const storage = getStorage()
    const fileExt = file.name.split('.').pop()
    const fileName = `reviews/${formData.slug}/${type}/${Date.now()}.${fileExt}`
    const fileRef = storageRef(storage, fileName)

    const uploadTask = uploadBytesResumable(fileRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (type === 'poster') setUploadProgressPoster(progress)
        else if (type === 'backdrop') setUploadProgressBackdrop(progress)
        else setUploadProgressAuthorAvatar(progress)
      },
      (error) => {
        console.error('Upload error:', error)
        alert('Failed to upload image')
        if (type === 'poster') setUploadProgressPoster(null)
        else if (type === 'backdrop') setUploadProgressBackdrop(null)
        else setUploadProgressAuthorAvatar(null)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        if (type === 'poster') {
          setFormData({ ...formData, poster: downloadURL })
          setPreviewPoster(downloadURL)
          setUploadProgressPoster(null)
        } else if (type === 'backdrop') {
          setFormData({ ...formData, backdropImage: downloadURL })
          setPreviewBackdrop(downloadURL)
          setUploadProgressBackdrop(null)
        } else {
          setFormData({
            ...formData,
            author: { ...formData.author, avatar: downloadURL },
          })
          setPreviewAuthorAvatar(downloadURL)
          setUploadProgressAuthorAvatar(null)
        }
      }
    )
  }

  const handleImageRemove = (type: 'poster' | 'backdrop' | 'authorAvatar') => {
    if (type === 'poster') {
      setFormData({ ...formData, poster: '' })
      setPreviewPoster('')
    } else if (type === 'backdrop') {
      setFormData({ ...formData, backdropImage: '' })
      setPreviewBackdrop('')
    } else {
      setFormData({
        ...formData,
        author: { ...formData.author, avatar: '' },
      })
      setPreviewAuthorAvatar('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'mdi:information' },
    { id: 'movie', label: 'Movie Details', icon: 'mdi:movie-open' },
    { id: 'content', label: 'Content', icon: 'mdi:text-box' },
    { id: 'author', label: 'Author', icon: 'mdi:account-edit' },
    { id: 'scores', label: 'Scores & Rating', icon: 'mdi:star' },
    { id: 'media', label: 'Media', icon: 'mdi:image' },
    { id: 'seo', label: 'SEO', icon: 'mdi:magnify' },
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-2 -mt-4 sm:-mt-6'>
      {/* Compact Header */}
      <div className='flex items-center justify-between py-0'>
        <h1 className='text-2xl sm:text-3xl font-bold text-black dark:text-white'>
          {isEdit ? 'Edit' : 'Add'} Movie Review
        </h1>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={onCancel}
            className='px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors'
          >
            {isEdit ? 'Update' : 'Create'} Review
          </button>
        </div>
      </div>

      {/* Compact Tabs */}
      <div className='bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
        <div className='flex overflow-x-auto border-b border-gray-200 dark:border-gray-800'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon icon={tab.icon} width='16' height='16' />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className='p-3 sm:p-6'>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className='space-y-3 sm:space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Review Title *
                  </label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Slug *
                  </label>
                  <input
                    type='text'
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Movie Title *
                  </label>
                  <input
                    type='text'
                    value={formData.movieTitle}
                    onChange={(e) => handleInputChange('movieTitle', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Your Rating (0-10) *
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='10'
                    step='0.1'
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Publish Date
                  </label>
                  <input
                    type='date'
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div className='flex items-end'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Featured Review
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  required
                  rows={3}
                  maxLength={500}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
                <p className='text-xs text-gray-500 mt-1'>{formData.excerpt.length}/500 characters</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Trailer URL
                </label>
                <input
                  type='url'
                  value={formData.trailer}
                  onChange={(e) => handleInputChange('trailer', e.target.value)}
                  placeholder='https://www.youtube.com/watch?v=...'
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>
            </div>
          )}

          {/* Movie Details Tab */}
          {activeTab === 'movie' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Release Year *
                  </label>
                  <input
                    type='number'
                    value={formData.movieDetails.releaseYear}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'releaseYear', parseInt(e.target.value))}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Runtime (minutes) *
                  </label>
                  <input
                    type='number'
                    value={formData.movieDetails.runtime}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'runtime', parseInt(e.target.value))}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    MPAA Rating
                  </label>
                  <select
                    value={formData.movieDetails.mpaaRating}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'mpaaRating', e.target.value)}
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  >
                    <option value=''>Select Rating</option>
                    {mpaaRatings.map((rating) => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Director *
                  </label>
                  <input
                    type='text'
                    value={formData.movieDetails.director}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'director', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Studio *
                  </label>
                  <input
                    type='text'
                    value={formData.movieDetails.studio}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'studio', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Budget
                  </label>
                  <input
                    type='text'
                    value={formData.movieDetails.budget}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'budget', e.target.value)}
                    placeholder='₹125 crore'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Box Office
                  </label>
                  <input
                    type='text'
                    value={formData.movieDetails.boxOffice}
                    onChange={(e) => handleNestedInputChange('movieDetails', 'boxOffice', e.target.value)}
                    placeholder='₹590 crore'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Genre *
                </label>
                <div className='flex flex-wrap gap-2'>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type='button'
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.movieDetails.genre.includes(genre)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Writers (comma-separated)
                </label>
                <input
                  type='text'
                  value={formData.movieDetails.writers.join(', ')}
                  onChange={(e) => handleArrayInputChange('movieDetails', 'writers', e.target.value)}
                  placeholder='Writer 1, Writer 2'
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              {/* Cast Members */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Cast
                  </label>
                  <button
                    type='button'
                    onClick={addCastMember}
                    className='flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Cast
                  </button>
                </div>
                <div className='space-y-2'>
                  {formData.movieDetails.cast.map((member, index) => (
                    <div key={index} className='flex gap-2 items-start'>
                      <input
                        type='text'
                        value={member.name}
                        onChange={(e) => updateCastMember(index, 'name', e.target.value)}
                        placeholder='Actor Name'
                        className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <input
                        type='text'
                        value={member.character}
                        onChange={(e) => updateCastMember(index, 'character', e.target.value)}
                        placeholder='Character'
                        className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <button
                        type='button'
                        onClick={() => removeCastMember(index)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                      >
                        <Icon icon='mdi:delete' width='18' height='18' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Review Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value: string) => handleInputChange('content', value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Verdict *
                </label>
                <textarea
                  value={formData.verdict}
                  onChange={(e) => handleInputChange('verdict', e.target.value)}
                  required
                  rows={3}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              {/* Pros */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Pros
                  </label>
                  <button
                    type='button'
                    onClick={() => addProCon('pros')}
                    className='flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Pro
                  </button>
                </div>
                <div className='space-y-2'>
                  {formData.pros.map((pro, index) => (
                    <div key={index} className='flex gap-2'>
                      <input
                        type='text'
                        value={pro}
                        onChange={(e) => updateProCon('pros', index, e.target.value)}
                        placeholder='Enter a positive point'
                        className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <button
                        type='button'
                        onClick={() => removeProCon('pros', index)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                      >
                        <Icon icon='mdi:delete' width='18' height='18' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Cons
                  </label>
                  <button
                    type='button'
                    onClick={() => addProCon('cons')}
                    className='flex items-center gap-1 px-2 py-1 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700'
                  >
                    <Icon icon='mdi:plus' width='16' height='16' />
                    Add Con
                  </button>
                </div>
                <div className='space-y-2'>
                  {formData.cons.map((con, index) => (
                    <div key={index} className='flex gap-2'>
                      <input
                        type='text'
                        value={con}
                        onChange={(e) => updateProCon('cons', index, e.target.value)}
                        placeholder='Enter a negative point'
                        className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                      />
                      <button
                        type='button'
                        onClick={() => removeProCon('cons', index)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                      >
                        <Icon icon='mdi:delete' width='18' height='18' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Author Tab */}
          {activeTab === 'author' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Author Name *
                  </label>
                  <input
                    type='text'
                    value={formData.author.name}
                    onChange={(e) => handleNestedInputChange('author', 'name', e.target.value)}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Credentials *
                  </label>
                  <input
                    type='text'
                    value={formData.author.credentials}
                    onChange={(e) => handleNestedInputChange('author', 'credentials', e.target.value)}
                    required
                    placeholder='Film Critics, Movie Reviewer, etc.'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Author Bio *
                </label>
                <textarea
                  value={formData.author.bio}
                  onChange={(e) => handleNestedInputChange('author', 'bio', e.target.value)}
                  required
                  rows={3}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Twitter
                  </label>
                  <input
                    type='url'
                    value={formData.author.socialMedia.twitter}
                    onChange={(e) => handleAuthorSocialMediaChange('twitter', e.target.value)}
                    placeholder='https://twitter.com/...'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Instagram
                  </label>
                  <input
                    type='url'
                    value={formData.author.socialMedia.instagram}
                    onChange={(e) => handleAuthorSocialMediaChange('instagram', e.target.value)}
                    placeholder='https://instagram.com/...'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Website
                  </label>
                  <input
                    type='url'
                    value={formData.author.socialMedia.website}
                    onChange={(e) => handleAuthorSocialMediaChange('website', e.target.value)}
                    placeholder='https://example.com'
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              {/* Author Avatar Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Author Avatar *
                </label>
                {previewAuthorAvatar ? (
                  <div className='relative w-32 h-32'>
                    <img
                      src={previewAuthorAvatar}
                      alt='Author avatar'
                      className='w-32 h-32 object-cover rounded-full border-2 border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={() => handleImageRemove('authorAvatar')}
                      className='absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full hover:bg-red-700'
                    >
                      <Icon icon='mdi:close' width='16' height='16' />
                    </button>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'authorAvatar')
                      }}
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    <input
                      type='url'
                      value={formData.author.avatar}
                      onChange={(e) => {
                        const url = e.target.value
                        setFormData({
                          ...formData,
                          author: { ...formData.author, avatar: url },
                        })
                        setPreviewAuthorAvatar(url)
                      }}
                      placeholder='Or paste image URL'
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>
                )}
                {uploadProgressAuthorAvatar !== null && (
                  <div className='mt-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full transition-all'
                        style={{ width: `${uploadProgressAuthorAvatar}%` }}
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {uploadProgressAuthorAvatar.toFixed(0)}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scores & Rating Tab */}
          {activeTab === 'scores' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Critics Score (0-100) *
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    value={formData.scores.criticsScore}
                    onChange={(e) => handleNestedInputChange('scores', 'criticsScore', parseInt(e.target.value))}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Audience Score (0-100) *
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    value={formData.scores.audienceScore}
                    onChange={(e) => handleNestedInputChange('scores', 'audienceScore', parseInt(e.target.value))}
                    required
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    IMDB Rating (0-10)
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='10'
                    step='0.1'
                    value={formData.scores.imdbRating}
                    onChange={(e) => handleNestedInputChange('scores', 'imdbRating', parseFloat(e.target.value))}
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Rotten Tomatoes (0-100)
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    value={formData.scores.rottenTomatoesScore}
                    onChange={(e) => handleNestedInputChange('scores', 'rottenTomatoesScore', parseInt(e.target.value))}
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className='space-y-4'>
              {/* Poster Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Movie Poster *
                </label>
                {previewPoster ? (
                  <div className='relative w-48 h-72'>
                    <img
                      src={previewPoster}
                      alt='Poster preview'
                      className='w-48 h-72 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={() => handleImageRemove('poster')}
                      className='absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700'
                    >
                      <Icon icon='mdi:close' width='16' height='16' />
                    </button>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'poster')
                      }}
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    <input
                      type='url'
                      value={formData.poster}
                      onChange={(e) => {
                        const url = e.target.value
                        handleInputChange('poster', url)
                        setPreviewPoster(url)
                      }}
                      placeholder='Or paste image URL'
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>
                )}
                {uploadProgressPoster !== null && (
                  <div className='mt-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full transition-all'
                        style={{ width: `${uploadProgressPoster}%` }}
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {uploadProgressPoster.toFixed(0)}% uploaded
                    </p>
                  </div>
                )}
              </div>

              {/* Backdrop Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Backdrop Image
                </label>
                {previewBackdrop ? (
                  <div className='relative w-full h-64'>
                    <img
                      src={previewBackdrop}
                      alt='Backdrop preview'
                      className='w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-800'
                    />
                    <button
                      type='button'
                      onClick={() => handleImageRemove('backdrop')}
                      className='absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700'
                    >
                      <Icon icon='mdi:close' width='16' height='16' />
                    </button>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'backdrop')
                      }}
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    <input
                      type='url'
                      value={formData.backdropImage}
                      onChange={(e) => {
                        const url = e.target.value
                        handleInputChange('backdropImage', url)
                        setPreviewBackdrop(url)
                      }}
                      placeholder='Or paste image URL'
                      className='flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>
                )}
                {uploadProgressBackdrop !== null && (
                  <div className='mt-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full transition-all'
                        style={{ width: `${uploadProgressBackdrop}%` }}
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {uploadProgressBackdrop.toFixed(0)}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Meta Title *
                </label>
                <input
                  type='text'
                  value={formData.seoData.metaTitle}
                  onChange={(e) => handleNestedInputChange('seoData', 'metaTitle', e.target.value)}
                  required
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Meta Description *
                </label>
                <textarea
                  value={formData.seoData.metaDescription}
                  onChange={(e) => handleNestedInputChange('seoData', 'metaDescription', e.target.value)}
                  required
                  rows={3}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Keywords (comma-separated)
                </label>
                <input
                  type='text'
                  value={formData.seoData.keywords.join(', ')}
                  onChange={(e) => handleArrayInputChange('seoData', 'keywords', e.target.value)}
                  placeholder='keyword1, keyword2, keyword3'
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
