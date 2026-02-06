import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  thumbnail: string
  author: string
  tags: string[]
  category?: string
  celebrity?: mongoose.Types.ObjectId
  publishDate: Date
  featured: boolean
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

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    celebrity: {
      type: Schema.Types.ObjectId,
      ref: 'Celebrity',
      index: true,
    },
    publishDate: {
      type: Date,
      required: [true, 'Publish date is required'],
      default: Date.now,
    },
    featured: {
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
      metaTitle: {
        type: String,
        default: '',
        maxlength: [60, 'Meta title cannot exceed 60 characters'],
      },
      metaDescription: {
        type: String,
        default: '',
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
      focusKeyword: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for better query performance
NewsSchema.index({ title: 'text', content: 'text', excerpt: 'text' })
NewsSchema.index({ publishDate: -1, status: 1 })
NewsSchema.index({ featured: 1, status: 1, publishDate: -1 })
NewsSchema.index({ celebrity: 1, status: 1, publishDate: -1 })
NewsSchema.index({ category: 1, status: 1, publishDate: -1 })

// Pre-save middleware to auto-generate slug if not provided
NewsSchema.pre('save', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema)

export default News
