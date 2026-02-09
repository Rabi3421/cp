import mongoose, { Schema, Document } from 'mongoose'

export interface IOutfit extends Document {
  title: string
  slug: string
  celebrity: mongoose.Types.ObjectId
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
  publishAt?: Date
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    focusKeyword: string
  }
  createdAt: Date
  updatedAt: Date
}

const OutfitSchema = new Schema<IOutfit>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    celebrity: {
      type: Schema.Types.ObjectId,
      ref: 'Celebrity',
      required: [true, 'Celebrity reference is required'],
      index: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: 'At least one image is required',
      },
    },
    event: {
      type: String,
      required: [true, 'Event is required'],
      trim: true,
    },
    designer: {
      type: String,
      required: [true, 'Designer is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the distant future'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    purchaseLink: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
      index: true,
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
      index: true,
    },
    publishAt: {
      type: Date,
    },
    seo: {
      metaTitle: { type: String, trim: true, maxlength: [60, 'Meta title cannot exceed 60 characters'] },
      metaDescription: { type: String, trim: true, maxlength: [160, 'Meta description cannot exceed 160 characters'] },
      metaKeywords: { type: [String], default: [] },
      canonicalUrl: { type: String, default: '' },
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      robots: { type: String, default: 'index, follow' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogType: { type: String, default: 'product' },
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
      schemaType: { type: String, default: 'Product' },
      schemaJson: { type: Schema.Types.Mixed, default: null },
      publishedTime: { type: String, default: '' },
      modifiedTime: { type: String, default: '' },
      authorName: { type: String, default: '' },
      tags: [{ type: String }],
      section: { type: String, default: 'Celebrity Outfits' },
      alternateLangs: [{ type: String }],
      prevUrl: { type: String, default: '' },
      nextUrl: { type: String, default: '' },
      canonicalAlternates: [{ type: String }],
      focusKeyword: { type: String, default: '' },
      structuredDataDepth: { type: String, default: 'minimal' },
      contentScore: { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 0 },
      relatedTopics: [{ type: String }],
      searchVolume: { type: Number, default: 0 },
      authorUrl: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
OutfitSchema.index({ title: 'text', description: 'text', tags: 'text' })
OutfitSchema.index({ celebrity: 1, status: 1 })
OutfitSchema.index({ category: 1, status: 1 })
OutfitSchema.index({ createdAt: -1 })
OutfitSchema.index({ isFeatured: 1, status: 1 })

// Pre-save middleware to generate slug if not provided
OutfitSchema.pre('save', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

const Outfit = mongoose.models.Outfit || mongoose.model<IOutfit>('Outfit', OutfitSchema)

export default Outfit
