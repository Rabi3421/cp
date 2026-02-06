import { NextRequest, NextResponse } from 'next/server'
import { authenticate, authorizeRole } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import MovieReview from '@/models/MovieReview'

// GET /api/superadmin/reviews - Get all movie reviews with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured')
    const genre = searchParams.get('genre')
    const minRating = searchParams.get('minRating')
    const sortBy = searchParams.get('sortBy') || 'publishDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { movieTitle: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ]
    }

    if (featured !== null && featured !== undefined && featured !== '') {
      query.featured = featured === 'true'
    }

    if (genre) {
      query['movieDetails.genre'] = genre
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) }
    }

    // Build sort
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Execute queries
    const [reviews, total] = await Promise.all([
      MovieReview.find(query).sort(sort).skip(skip).limit(limit).lean(),
      MovieReview.countDocuments(query),
    ])

    // Calculate stats
    const stats = await MovieReview.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          featured: [{ $match: { featured: true } }, { $count: 'count' }],
          avgRating: [
            { $group: { _id: null, avg: { $avg: '$rating' } } },
          ],
          totalViews: [
            { $group: { _id: null, sum: { $sum: '$stats.views' } } },
          ],
          byGenre: [
            { $unwind: '$movieDetails.genre' },
            {
              $group: {
                _id: '$movieDetails.genre',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ])

    const response = {
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: stats[0]?.total[0]?.count || 0,
        featured: stats[0]?.featured[0]?.count || 0,
        avgRating: stats[0]?.avgRating[0]?.avg || 0,
        totalViews: stats[0]?.totalViews[0]?.sum || 0,
        topGenres: stats[0]?.byGenre || [],
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching movie reviews:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/superadmin/reviews - Create a new movie review
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error },
        { status: 403 }
      )
    }

    await connectDB()

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'title',
      'movieTitle',
      'poster',
      'rating',
      'content',
      'excerpt',
      'author',
      'movieDetails',
      'scores',
      'verdict',
      'seoData',
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if slug already exists
    if (data.slug) {
      const existingReview = await MovieReview.findOne({ slug: data.slug })
      if (existingReview) {
        return NextResponse.json(
          { success: false, error: 'Review with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const review = await MovieReview.create(data)

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: 'Movie review created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating movie review:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
