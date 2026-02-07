import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Movie from '@/models/Movie'

// GET /api/upcoming-movies - Get upcoming and recently released movies
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const genre = searchParams.get('genre') || ''
    const featured = searchParams.get('featured') || ''
    const sortBy = searchParams.get('sortBy') || 'releaseDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build query - Only show movies that are upcoming or recently released
    const query: any = {
      status: { $in: ['Announced', 'In Production', 'Post-Production', 'Released'] },
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { 'cast.name': { $regex: search, $options: 'i' } },
      ]
    }

    if (status) {
      query.status = status
    }

    if (genre) {
      query.genre = genre
    }

    if (featured === 'true') {
      query.featured = true
    }

    // Build sort
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Execute queries
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-seoData -__v') // Exclude unnecessary fields
        .lean(),
      Movie.countDocuments(query),
    ])

    // Get unique genres for filtering
    const genres = await Movie.distinct('genre')

    // Get unique statuses for filtering
    const statuses = await Movie.distinct('status', {
      status: { $in: ['Announced', 'In Production', 'Post-Production', 'Released'] },
    })

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        genres: genres.sort(),
        statuses: statuses.sort(),
      },
    })
  } catch (error: any) {
    console.error('Error fetching upcoming movies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upcoming movies' },
      { status: 500 }
    )
  }
}
