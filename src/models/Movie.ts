import mongoose, { Schema, Document } from 'mongoose'

export interface ICast {
  name: string
  role?: string
  character?: string
  image?: string
}

export interface ITicketLink {
  platform: string
  url: string
  available: boolean
}

export interface IMovie extends Document {
  title: string
  slug: string
  releaseDate: Date
  poster: string
  backdrop: string
  language: string
  originalLanguage?: string
  worldwide: boolean
  genre: string[]
  director: string
  cast: ICast[]
  synopsis: string
  plotSummary?: string
  status: 'Announced' | 'In Production' | 'Post-Production' | 'Released' | 'Cancelled'
  anticipationScore: number
  duration?: number
  mpaaRating?: string
  regions: string[]
  subtitles: string[]
  boxOfficeProjection?: number
  budget?: number
  featured: boolean
  images: string[]
  preOrderAvailable: boolean
  producers: string[]
  productionNotes?: string
  studio?: string
  ticketLinks: ITicketLink[]
  trailer?: string
  writers: string[]
  seoData: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const CastSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: String,
  character: String,
  image: String,
})

const TicketLinkSchema = new Schema({
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
})

const MovieSchema = new Schema<IMovie>(
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
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
      index: true,
    },
    poster: {
      type: String,
      required: [true, 'Poster image is required'],
    },
    backdrop: {
      type: String,
      required: [true, 'Backdrop image is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    originalLanguage: {
      type: String,
      trim: true,
    },
    worldwide: {
      type: Boolean,
      default: false,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: 'At least one genre is required',
      },
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
      trim: true,
    },
    cast: {
      type: [CastSchema],
      default: [],
    },
    synopsis: {
      type: String,
      required: [true, 'Synopsis is required'],
    },
    plotSummary: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Announced', 'In Production', 'Post-Production', 'Released', 'Cancelled'],
      default: 'Announced',
      index: true,
    },
    anticipationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    duration: {
      type: Number,
      min: 0,
    },
    mpaaRating: {
      type: String,
    },
    regions: {
      type: [String],
      default: [],
    },
    subtitles: {
      type: [String],
      default: [],
    },
    boxOfficeProjection: {
      type: Number,
      min: 0,
    },
    budget: {
      type: Number,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    preOrderAvailable: {
      type: Boolean,
      default: false,
    },
    producers: {
      type: [String],
      default: [],
    },
    productionNotes: {
      type: String,
    },
    studio: {
      type: String,
      trim: true,
    },
    ticketLinks: {
      type: [TicketLinkSchema],
      default: [],
    },
    trailer: {
      type: String,
    },
    writers: {
      type: [String],
      default: [],
    },
    seoData: {
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
      keywords: {
        type: [String],
        default: [],
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
MovieSchema.index({ title: 'text', synopsis: 'text', plotSummary: 'text' })
MovieSchema.index({ releaseDate: -1, status: 1 })
MovieSchema.index({ featured: 1, status: 1, releaseDate: -1 })
MovieSchema.index({ genre: 1, status: 1, releaseDate: -1 })
MovieSchema.index({ language: 1, status: 1, releaseDate: -1 })

// Pre-save middleware to auto-generate slug if not provided
MovieSchema.pre('save', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

const Movie = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema)

export default Movie
