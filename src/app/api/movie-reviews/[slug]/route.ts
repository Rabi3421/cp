import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MovieReview from '@/models/MovieReview'

// GET /api/movie-reviews/[slug] - Get a single movie review by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const review = await MovieReview.findOne({
      slug: params.slug,
      status: 'published',
    }).lean()

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Movie review not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await MovieReview.findByIdAndUpdate(review._id, {
      $inc: { 'stats.views': 1 },
    })

    // Get related reviews (same genre, exclude current)
    const relatedReviews = await MovieReview.find({
      _id: { $ne: review._id },
      'movieDetails.genre': { $in: review.movieDetails?.genre || [] },
      status: 'published',
    })
      .sort({ publishDate: -1 })
      .limit(3)
      .select('title slug movieTitle poster excerpt rating publishDate movieDetails')
      .lean()

    return NextResponse.json({
      success: true,
      data: review,
      related: relatedReviews,
    })
  } catch (error: any) {
    console.error('Error fetching movie review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movie review' },
      { status: 500 }
    )
  }
}
