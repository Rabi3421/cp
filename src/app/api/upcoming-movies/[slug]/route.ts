import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Movie from '@/models/Movie'

// GET /api/upcoming-movies/[slug] - Get a single upcoming movie by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const movie = await Movie.findOne({
      slug: params.slug,
    }).lean()

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Get related movies (same genre, exclude current)
    const relatedMovies = await Movie.find({
      _id: { $ne: movie._id },
      genre: { $in: movie.genre || [] },
      status: { $in: ['Announced', 'In Production', 'Post-Production', 'Released'] },
    })
      .sort({ releaseDate: -1 })
      .limit(4)
      .select('title slug poster releaseDate genre status anticipationScore')
      .lean()

    return NextResponse.json({
      success: true,
      data: movie,
      related: relatedMovies,
    })
  } catch (error: any) {
    console.error('Error fetching movie:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movie' },
      { status: 500 }
    )
  }
}
