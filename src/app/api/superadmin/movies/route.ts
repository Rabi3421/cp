import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Movie from '@/models/Movie'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch all movies with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const genre = searchParams.get('genre') || ''
    const language = searchParams.get('language') || ''
    const featured = searchParams.get('featured') || ''
    const sortBy = searchParams.get('sortBy') || 'releaseDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
      ]
    }

    if (status) query.status = status
    if (genre) query.genre = genre
    if (language) query.language = language
    if (featured) query.featured = featured === 'true'

    const skip = (page - 1) * limit
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Movie.countDocuments(query),
    ])

    // Get stats
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          announced: {
            $sum: { $cond: [{ $eq: ['$status', 'Announced'] }, 1, 0] },
          },
          inProduction: {
            $sum: { $cond: [{ $eq: ['$status', 'In Production'] }, 1, 0] },
          },
          postProduction: {
            $sum: { $cond: [{ $eq: ['$status', 'Post-Production'] }, 1, 0] },
          },
          released: {
            $sum: { $cond: [{ $eq: ['$status', 'Released'] }, 1, 0] },
          },
          featured: { $sum: { $cond: ['$featured', 1, 0] } },
          avgAnticipation: { $avg: '$anticipationScore' },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        total: 0,
        announced: 0,
        inProduction: 0,
        postProduction: 0,
        released: 0,
        featured: 0,
        avgAnticipation: 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching movies:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new movie
export async function POST(request: NextRequest) {
  try {
    // Verify superadmin authentication
    const auth = authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check superadmin role
    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error || 'Forbidden' },
        { status: 403 }
      )
    }

    await dbConnect()

    const body = await request.json()

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Check if slug already exists
    const existingMovie = await Movie.findOne({ slug: body.slug })
    if (existingMovie) {
      return NextResponse.json(
        { success: false, error: 'Movie with this slug already exists' },
        { status: 400 }
      )
    }

    const movie = await Movie.create(body)

    return NextResponse.json(
      {
        success: true,
        data: movie,
        message: 'Movie created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating movie:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
