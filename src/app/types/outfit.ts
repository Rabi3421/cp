export type Outfit = {
  _id: string
  title: string
  slug: string
  celebrity: {
    _id: string
    name: string
    slug: string
    profileImage?: string
  } | string
  images: string[]
  event: string
  designer: string
  year: number
  description: string
  tags: string[]
  purchaseLink?: string
  price?: string
  brand?: string
  category: string
  color?: string
  size?: string
  isActive: boolean
  isFeatured: boolean
  likesCount: number
  commentsCount: number
  viewCount: number
  shareCount: number
  status: 'draft' | 'published' | 'scheduled'
  publishAt?: string
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    focusKeyword: string
  }
  createdAt: string
  updatedAt: string
}

export type OutfitFormData = {
  title: string
  slug: string
  celebrity: string
  images: string[]
  event: string
  designer: string
  year: number
  description: string
  tags: string[]
  purchaseLink: string
  price: string
  brand: string
  category: string
  color: string
  size: string
  isActive: boolean
  isFeatured: boolean
  status: 'draft' | 'published' | 'scheduled'
  publishAt: string | null
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    focusKeyword: string
  }
}

export type OutfitItem = {
  name: string
  brand: string
  category: string
  price: string
  link?: string
  image?: string
}

