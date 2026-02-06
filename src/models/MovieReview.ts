import mongoose, { Schema, Document } from 'mongoose'

interface ICastMember {
  name: string
  character: string
  image?: string
}

interface IAuthor {
  name: string
  avatar: string
  bio: string
  credentials: string
  reviewCount: number
  socialMedia: {
    twitter?: string
    instagram?: string
    website?: string
  }
}

interface IMovieDetails {
  releaseYear: number
  director: string
  writers: string[]
  cast: ICastMember[]
  genre: string[]
  runtime: number
  budget?: string
  boxOffice?: string
  studio: string
  mpaaRating?: string
}

interface IScores {
  criticsScore: number
  audienceScore: number
  imdbRating?: number
  rottenTomatoesScore?: number
}

interface IStats {
  views: number
  likes: number
  comments: number
  shares: number
  helpful: number
  notHelpful: number
}

interface ISeoData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export interface IMovieReview extends Document {
  title: string
  slug: string
  movieTitle: string
  poster: string
  backdropImage?: string
  trailer?: string
  rating: number
  content: string
  excerpt: string
  author: IAuthor
  movieDetails: IMovieDetails
  scores: IScores
  publishDate: Date
  featured: boolean
  stats: IStats
  pros: string[]
  cons: string[]
  verdict: string
  seoData: ISeoData
  createdAt: Date
  updatedAt: Date
}

const CastMemberSchema = new Schema({
  name: { type: String, required: true },
  character: { type: String, required: true },
  image: { type: String },
})

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  bio: { type: String, required: true },
  credentials: { type: String, required: true },
  reviewCount: { type: Number, default: 0 },
  socialMedia: {
    twitter: { type: String },
    instagram: { type: String },
    website: { type: String },
  },
})

const MovieDetailsSchema = new Schema({
  releaseYear: { type: Number, required: true },
  director: { type: String, required: true },
  writers: [{ type: String }],
  cast: [CastMemberSchema],
  genre: [{ type: String, required: true }],
  runtime: { type: Number, required: true },
  budget: { type: String },
  boxOffice: { type: String },
  studio: { type: String, required: true },
  mpaaRating: { type: String },
})

const ScoresSchema = new Schema({
  criticsScore: { type: Number, min: 0, max: 100, required: true },
  audienceScore: { type: Number, min: 0, max: 100, required: true },
  imdbRating: { type: Number, min: 0, max: 10 },
  rottenTomatoesScore: { type: Number, min: 0, max: 100 },
})

const StatsSchema = new Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
})

const SeoDataSchema = new Schema({
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keywords: [{ type: String }],
})

const MovieReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    movieTitle: {
      type: String,
      required: true,
      trim: true,
    },
    poster: {
      type: String,
      required: true,
    },
    backdropImage: {
      type: String,
    },
    trailer: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 500,
    },
    author: {
      type: AuthorSchema,
      required: true,
    },
    movieDetails: {
      type: MovieDetailsSchema,
      required: true,
    },
    scores: {
      type: ScoresSchema,
      required: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    stats: {
      type: StatsSchema,
      default: () => ({}),
    },
    pros: [{ type: String }],
    cons: [{ type: String }],
    verdict: {
      type: String,
      required: true,
    },
    seoData: {
      type: SeoDataSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate slug from title
MovieReviewSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

// Indexes for better query performance
MovieReviewSchema.index({ slug: 1 })
MovieReviewSchema.index({ publishDate: -1 })
MovieReviewSchema.index({ featured: 1 })
MovieReviewSchema.index({ rating: -1 })
MovieReviewSchema.index({ 'movieDetails.releaseYear': -1 })
MovieReviewSchema.index({ 'movieDetails.genre': 1 })
MovieReviewSchema.index({ title: 'text', movieTitle: 'text', excerpt: 'text' })

export default mongoose.models.MovieReview ||
  mongoose.model<IMovieReview>('MovieReview', MovieReviewSchema)
