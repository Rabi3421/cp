'use client'

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { format, parse, parseISO } from 'date-fns'
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

  const [bornIso, setBornIso] = useState('')
  const [heightValue, setHeightValue] = useState('')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm')
  const [weightValue, setWeightValue] = useState('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [isPresent, setIsPresent] = useState(false)

  // conversion helpers
  const cmToInches = (cm: number) => cm / 2.54
  const inchesToCm = (inch: number) => inch * 2.54
  const inchesToFeetInches = (inch: number) => {
    const feet = Math.floor(inch / 12)
    const inches = Math.round(inch % 12)
    return { feet, inches }
  }
  const formatHeightDisplay = (value: string, unit: string) => {
    const n = parseFloat(String(value))
    if (isNaN(n)) return ''
    if (unit === 'cm') {
      const inches = cmToInches(n)
      const { feet, inches: rem } = inchesToFeetInches(inches)
      return `${feet}'${rem}\" (${Math.round(n)} cm)`
    }
    // unit === 'in'
    const cm = inchesToCm(n)
    const { feet, inches: rem } = inchesToFeetInches(n)
    return `${feet}'${rem}\" (${Math.round(cm)} cm)`
  }

  const kgToLbs = (kg: number) => kg * 2.2046226218
  const lbsToKg = (lb: number) => lb / 2.2046226218
  const formatWeightDisplay = (value: string, unit: string) => {
    const n = parseFloat(String(value))
    if (isNaN(n)) return ''
    if (unit === 'kg') {
      const lbs = kgToLbs(n)
      return `${n.toFixed(1)} kg (${lbs.toFixed(2)} lbs)`
    }
    // unit === 'lb'
    const kg = lbsToKg(n)
    return `${n.toFixed(2)} lbs (${kg.toFixed(1)} kg)`
  }

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
      // try to populate ISO date input from existing stored value
      const toIso = (born: any) => {
        if (!born) return ''
        // If it's already an ISO-like yyyy-mm-dd or full ISO
        try {
          if (typeof born === 'string') {
            // direct ISO date
            const isoCandidate = /^\d{4}-\d{2}-\d{2}/.test(born) ? born.slice(0, 10) : ''
            if (isoCandidate) return isoCandidate

            // try parsing common human format like '12 February 1990'
            const parsed = parse(born, 'd MMMM yyyy', new Date())
            if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)

            // fallback: try Date.parse
            const fallback = new Date(born)
            if (!isNaN(fallback.getTime())) return fallback.toISOString().slice(0, 10)
          }
        } catch (err) {
          return ''
        }
        return ''
      }

      setBornIso(toIso(celebrity.born))
      // initialize height and weight controls from existing celebrity values
      try {
        if (celebrity.height) {
          const h = String(celebrity.height)
          // if cm exists in string
          const cmMatch = h.match(/(\d+(?:\.\d+)?)\s*cm/i)
          const inMatch = h.match(/(\d+(?:\.\d+)?)\s*(in|lbs|lb|')/i)
          if (cmMatch) {
            const cm = parseFloat(cmMatch[1])
            setHeightUnit('cm')
            setHeightValue(String(Math.round(cm)))
            handleChange('height', formatHeightDisplay(String(Math.round(cm)), 'cm'))
          } else if (inMatch) {
            const inch = parseFloat(inMatch[1])
            setHeightUnit('in')
            setHeightValue(String(inch))
            handleChange('height', formatHeightDisplay(String(inch), 'in'))
          }
        }

        if (celebrity.weight) {
          const w = String(celebrity.weight)
          const kgMatch = w.match(/(\d+(?:\.\d+)?)\s*kg/i)
          const lbMatch = w.match(/(\d+(?:\.\d+)?)\s*lb/i)
          if (kgMatch) {
            const kg = parseFloat(kgMatch[1])
            setWeightUnit('kg')
            setWeightValue(String(kg))
            handleChange('weight', formatWeightDisplay(String(kg), 'kg'))
          } else if (lbMatch) {
            const lb = parseFloat(lbMatch[1])
            setWeightUnit('lb')
            setWeightValue(String(lb))
            handleChange('weight', formatWeightDisplay(String(lb), 'lb'))
          }
        }
      } catch (err) {
        // ignore parse errors during init
      }
      // parse yearsActive like '2011–Present' or '2011-2015' or '2011–2015'
      try {
        if (celebrity.yearsActive) {
          const ya = String(celebrity.yearsActive)
          const parts = ya.split(/–|-/).map((p) => p.trim())
          if (parts.length >= 1) setStartYear(parts[0])
          if (parts.length >= 2) {
            if (/present/i.test(parts[1])) {
              setIsPresent(true)
              setEndYear('')
            } else {
              setEndYear(parts[1])
              setIsPresent(false)
            }
          }
        }
      } catch (err) {
        // ignore
      }
    }
  }, [celebrity])

  // keep bornIso and formData.born in sync when user or other code updates the display value
  useEffect(() => {
    const fromDisplayToIso = (born: any) => {
      if (!born) return ''
      try {
        // try parsing 'd MMMM yyyy'
        const parsed = parse(born, 'd MMMM yyyy', new Date())
        if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
        const parsedIso = parseISO(born)
        if (!isNaN(parsedIso.getTime())) return parsedIso.toISOString().slice(0, 10)
        const fallback = new Date(born)
        if (!isNaN(fallback.getTime())) return fallback.toISOString().slice(0, 10)
      } catch (err) {
        return ''
      }
      return ''
    }

    const iso = fromDisplayToIso(formData.born)
    if (iso && iso !== bornIso) setBornIso(iso)
  }, [formData.born])

  // when startYear / endYear / isPresent change, update formData.yearsActive
  useEffect(() => {
    if (startYear) {
      const years = isPresent ? `${startYear}–Present` : endYear ? `${startYear}–${endYear}` : `${startYear}`
      setFormData((prev) => ({ ...prev, yearsActive: years }))
    } else {
      setFormData((prev) => ({ ...prev, yearsActive: '' }))
    }
  }, [startYear, endYear, isPresent])

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

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i).reverse()

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
                    type='date'
                    value={bornIso}
                    onChange={(e) => {
                      const iso = e.target.value
                      setBornIso(iso)
                      if (iso) {
                        try {
                          const formatted = format(new Date(iso), 'd MMMM yyyy')
                          handleChange('born', formatted)
                        } catch (err) {
                          handleChange('born', iso)
                        }
                      } else {
                        handleChange('born', '')
                      }
                    }}
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
                  <div className='flex items-center gap-2'>
                    <select
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className='w-36 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none'
                    >
                      <option value=''>Start year</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>

                    <span className='text-gray-500'>—</span>

                    <select
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      disabled={isPresent}
                      className='w-36 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none'
                    >
                      <option value=''>End year</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>

                    <label className='ml-3 inline-flex items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        checked={isPresent}
                        onChange={(e) => {
                          const val = e.target.checked
                          setIsPresent(val)
                          if (val) setEndYear('')
                        }}
                        className='w-4 h-4'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>Present</span>
                    </label>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>{formData.yearsActive}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Height
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='number'
                      value={heightValue}
                      onChange={(e) => {
                        const v = e.target.value
                        setHeightValue(v)
                        const display = formatHeightDisplay(v, heightUnit)
                        handleChange('height', display)
                      }}
                      className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='163'
                    />
                    <select
                      value={heightUnit}
                      onChange={(e) => {
                        const u = e.target.value as 'cm' | 'in'
                        // when unit changes, convert existing numeric value appropriately
                        let v = heightValue
                        if (v) {
                          const n = parseFloat(v)
                          if (!isNaN(n)) {
                            if (u === 'cm' && heightUnit === 'in') {
                              // convert inches -> cm
                              v = String(Math.round(inchesToCm(n)))
                            } else if (u === 'in' && heightUnit === 'cm') {
                              v = String(parseFloat((cmToInches(n)).toFixed(2)))
                            }
                          }
                        }
                        setHeightUnit(u)
                        setHeightValue(v)
                        handleChange('height', formatHeightDisplay(v, u))
                      }}
                      className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none'
                    >
                      <option value='cm'>cm</option>
                      <option value='in'>in</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-black dark:text-white mb-2'>
                    Weight
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='number'
                      value={weightValue}
                      onChange={(e) => {
                        const v = e.target.value
                        setWeightValue(v)
                        const display = formatWeightDisplay(v, weightUnit)
                        handleChange('weight', display)
                      }}
                      className='w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='52'
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => {
                        const u = e.target.value as 'kg' | 'lb'
                        let v = weightValue
                        if (v) {
                          const n = parseFloat(v)
                          if (!isNaN(n)) {
                            if (u === 'kg' && weightUnit === 'lb') {
                              v = String(parseFloat(lbsToKg(n).toFixed(1)))
                            } else if (u === 'lb' && weightUnit === 'kg') {
                              v = String(parseFloat(kgToLbs(n).toFixed(2)))
                            }
                          }
                        }
                        setWeightUnit(u)
                        setWeightValue(v)
                        handleChange('weight', formatWeightDisplay(v, u))
                      }}
                      className='px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white rounded-xl focus:outline-none'
                    >
                      <option value='kg'>kg</option>
                      <option value='lb'>lbs</option>
                    </select>
                  </div>
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
