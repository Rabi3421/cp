export type Celebrity = {
  _id?: string
  id?: string
  name: string
  slug?: string
  image?: string
  profileImage?: string
  coverImage?: string
  galleryImages?: string[]
  category?: string
  categories?: string[]
  occupation?: string
  profession?: string | string[]
  born?: string
  birthDate?: string
  birthPlace?: string
  died?: string
  age?: number
  height?: string
  weight?: string
  bodyMeasurements?: string
  eyeColor?: string
  hairColor?: string
  nationality?: string
  citizenship?: string[]
  yearsActive?: string
  netWorth?: string
  spouse?: string
  children?: string[]
  parents?: string[]
  siblings?: string[]
  relatives?: string[]
  education?: string | string[]
  biography?: string
  introduction?: string
  earlyLife?: string
  career?: string
  personalLife?: string
  achievements?: any[]
  awards?: Award[]
  filmography?: Film[]
  works?: any[]
  movies?: any[]
  quotes?: string[]
  trivia?: string[]
  controversies?: any[]
  philanthropy?: any[]
  relatedCelebrities?: string[]
  newsArticles?: string[]
  socialMedia?: SocialMedia
  seo?: any
  tags?: string[]
  language?: string
  status?: string
  isActive?: boolean
  isFeatured?: boolean
  isVerified?: boolean
  contentQuality?: string
  popularity?: number
  popularityScore?: number
  viewCount?: number
  shareCount?: number
  searchRank?: number
  trendingScore?: number
  createdAt?: string
  updatedAt?: string
}

export type Award = {
  year: string
  title: string
  category: string
  work?: string
}

export type Film = {
  year: string
  title: string
  role: string
  type: 'Movie' | 'TV Show' | 'Web Series'
}

export type SocialMedia = {
  instagram?: string
  twitter?: string
  facebook?: string
  youtube?: string
  tiktok?: string
  website?: string
}
