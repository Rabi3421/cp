import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'

// GET - Public endpoint to fetch published celebrities
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const isFeatured = searchParams.get('isFeatured') || ''

    // Build query - only published celebrities
    const query: any = { status: 'published' }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
      ]
    }

    if (category) query.categories = category
    if (isFeatured) query.isFeatured = isFeatured === 'true'

    const skip = (page - 1) * limit

    const [celebrities, total, featured] = await Promise.all([
      Celebrity.find(query)
        .sort({ isFeatured: -1, viewCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name slug profileImage occupation profession categories birthDate birthPlace nationality height netWorth socialMedia isFeatured isVerified viewCount shareCount')
        .lean(),
      Celebrity.countDocuments(query),
      Celebrity.find({ status: 'published', isFeatured: true })
        .sort({ viewCount: -1 })
        .limit(6)
        .select('name slug profileImage occupation categories')
        .lean(),
    ])

    // Get categories with count
    const categoriesData = await Celebrity.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    return NextResponse.json({
      success: true,
      data: celebrities,
      featured,
      categories: categoriesData.map(c => ({ name: c._id, count: c.count })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching celebrities:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
