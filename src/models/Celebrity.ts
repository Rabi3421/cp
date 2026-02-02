import mongoose, { Schema, Document } from 'mongoose'

export interface ICelebrity extends Document {
  name: string
  slug: string
  born: string
  birthPlace: string
  died: string
  age: number
  nationality: string
  citizenship: string[]
  occupation: string[]
  profession: string[]
  yearsActive: string
  height: string
  weight: string
  bodyMeasurements: string
  eyeColor: string
  hairColor: string
  spouse: string
  children: string[]
  parents: string[]
  siblings: string[]
  relatives: string[]
  education: string[]
  netWorth: string
  introduction: string
  earlyLife: string
  career: string
  personalLife: string
  achievements: string[]
  controversies: string[]
  philanthropy: string[]
  trivia: string[]
  works: string[]
  movies: Array<{
    name: string
    role: string
    year: string
    director: string
    genre: string
    description: string
  }>
  awards: Array<{
    title: string
    category: string
    year: string
    organization: string
    work: string
    description: string
  }>
  quotes: string[]
  relatedCelebrities: string[]
  newsArticles: string[]
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
    youtube: string
    tiktok: string
    website: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    canonicalUrl: string
    noindex: boolean
    nofollow: boolean
    robots: string
    ogTitle: string
    ogDescription: string
    ogType: string
    ogSiteName: string
    ogUrl: string
    ogImages: string[]
    ogLocale: string
    twitterCard: string
    twitterTitle: string
    twitterDescription: string
    twitterImage: string
    twitterSite: string
    twitterCreator: string
    schemaType: string
    schemaJson: any
    publishedTime: string
    modifiedTime: string
    authorName: string
    tags: string[]
    section: string
    alternateLangs: string[]
    prevUrl: string
    nextUrl: string
    canonicalAlternates: string[]
    focusKeyword: string
    structuredDataDepth: string
    contentScore: number
    readabilityScore: number
    relatedTopics: string[]
    searchVolume: number
    authorUrl: string
  }
  popularity: number
  popularityScore: number
  viewCount: number
  shareCount: number
  searchRank: number
  trendingScore: number
  isActive: boolean
  isFeatured: boolean
  isVerified: boolean
  contentQuality: string
  tags: string[]
  categories: string[]
  language: string
  profileImage: string
  coverImage: string
  galleryImages: string[]
  status: 'draft' | 'published' | 'scheduled'
  isScheduled: boolean
  publishAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const CelebritySchema = new Schema<ICelebrity>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    born: { type: String, default: '' },
    birthPlace: { type: String, default: '' },
    died: { type: String, default: '' },
    age: { type: Number, default: 0 },
    nationality: { type: String, default: '' },
    citizenship: [{ type: String }],
    occupation: [{ type: String }],
    profession: [{ type: String }],
    yearsActive: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    bodyMeasurements: { type: String, default: '' },
    eyeColor: { type: String, default: '' },
    hairColor: { type: String, default: '' },
    spouse: { type: String, default: '' },
    children: [{ type: String }],
    parents: [{ type: String }],
    siblings: [{ type: String }],
    relatives: [{ type: String }],
    education: [{ type: String }],
    netWorth: { type: String, default: '' },
    introduction: { type: String, default: '' },
    earlyLife: { type: String, default: '' },
    career: { type: String, default: '' },
    personalLife: { type: String, default: '' },
    achievements: [{ type: String }],
    controversies: [{ type: String }],
    philanthropy: [{ type: String }],
    trivia: [{ type: String }],
    works: [{ type: String }],
    movies: [
      {
        name: { type: String, required: true },
        role: { type: String, default: '' },
        year: { type: String, default: '' },
        director: { type: String, default: '' },
        genre: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    awards: [
      {
        title: { type: String, required: true },
        category: { type: String, default: '' },
        year: { type: String, default: '' },
        organization: { type: String, default: '' },
        work: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    quotes: [{ type: String }],
    relatedCelebrities: [{ type: String }],
    newsArticles: [{ type: String }],
    socialMedia: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
      canonicalUrl: { type: String, default: '' },
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      robots: { type: String, default: 'index, follow' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogType: { type: String, default: 'profile' },
      ogSiteName: { type: String, default: 'Celebrity Persona' },
      ogUrl: { type: String, default: '' },
      ogImages: [{ type: String }],
      ogLocale: { type: String, default: 'en_US' },
      twitterCard: { type: String, default: 'summary_large_image' },
      twitterTitle: { type: String, default: '' },
      twitterDescription: { type: String, default: '' },
      twitterImage: { type: String, default: '' },
      twitterSite: { type: String, default: '@celebritypersona' },
      twitterCreator: { type: String, default: '@celebritypersona' },
      schemaType: { type: String, default: 'Person' },
      schemaJson: { type: Schema.Types.Mixed, default: null },
      publishedTime: { type: String, default: '' },
      modifiedTime: { type: String, default: '' },
      authorName: { type: String, default: '' },
      tags: [{ type: String }],
      section: { type: String, default: 'Celebrity Profile' },
      alternateLangs: [{ type: String }],
      prevUrl: { type: String, default: '' },
      nextUrl: { type: String, default: '' },
      canonicalAlternates: [{ type: String }],
      focusKeyword: { type: String, default: '' },
      structuredDataDepth: { type: String, default: 'full' },
      contentScore: { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 0 },
      relatedTopics: [{ type: String }],
      searchVolume: { type: Number, default: 0 },
      authorUrl: { type: String, default: '' },
    },
    popularity: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    searchRank: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    contentQuality: {
      type: String,
      enum: ['draft', 'incomplete', 'complete', 'excellent'],
      default: 'draft',
    },
    tags: [{ type: String }],
    categories: [{ type: String }],
    language: { type: String, default: 'en' },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    isScheduled: { type: Boolean, default: false },
    publishAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
CelebritySchema.index({ slug: 1 })
CelebritySchema.index({ status: 1 })
CelebritySchema.index({ name: 'text', slug: 'text' })
CelebritySchema.index({ categories: 1 })
CelebritySchema.index({ tags: 1 })
CelebritySchema.index({ popularity: -1 })
CelebritySchema.index({ createdAt: -1 })

export default mongoose.models.Celebrity ||
  mongoose.model<ICelebrity>('Celebrity', CelebritySchema)
