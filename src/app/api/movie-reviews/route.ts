import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MovieReview from '@/models/MovieReview'

// GET /api/movie-reviews - Get all published movie reviews
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const featured = searchParams.get('featured') || ''
    const sortBy = searchParams.get('sortBy') || 'publishDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build query
    const query: any = {
      status: 'published', // Only show published reviews
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { movieTitle: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { 'movieDetails.director': { $regex: search, $options: 'i' } },
      ]
    }

    if (genre) {
      query['movieDetails.genre'] = genre
    }

    if (featured === 'true') {
      query.featured = true
    }

    // Build sort
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Execute queries
    const [reviews, total] = await Promise.all([
      MovieReview.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-seoData -__v') // Exclude unnecessary fields
        .lean(),
      MovieReview.countDocuments(query),
    ])

    // Get unique genres for filtering
    const genres = await MovieReview.distinct('movieDetails.genre', { status: 'published' })

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      genres: genres.sort(),
    })
  } catch (error: any) {
    console.error('Error fetching movie reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movie reviews' },
      { status: 500 }
    )
  }
}
