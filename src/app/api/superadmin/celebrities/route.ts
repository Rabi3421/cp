import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'
import { verifyToken } from '@/lib/auth'

// GET - Fetch all celebrities with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const isFeatured = searchParams.get('isFeatured') || ''
    const isVerified = searchParams.get('isVerified') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
      ]
    }

    if (status) query.status = status
    if (category) query.categories = category
    if (isFeatured) query.isFeatured = isFeatured === 'true'
    if (isVerified) query.isVerified = isVerified === 'true'

    const skip = (page - 1) * limit
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [celebrities, total] = await Promise.all([
      Celebrity.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Celebrity.countDocuments(query),
    ])

    // Get stats
    const stats = await Celebrity.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
          draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] },
          },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          totalViews: { $sum: '$viewCount' },
          totalShares: { $sum: '$shareCount' },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: celebrities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        total: 0,
        published: 0,
        draft: 0,
        scheduled: 0,
        featured: 0,
        verified: 0,
        totalViews: 0,
        totalShares: 0,
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

// POST - Create new celebrity
export async function POST(request: NextRequest) {
  try {
    // Verify superadmin token
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    await dbConnect()

    const body = await request.json()

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Check if slug already exists
    const existingCelebrity = await Celebrity.findOne({ slug: body.slug })
    if (existingCelebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity with this slug already exists' },
        { status: 400 }
      )
    }

    // Handle scheduled publishing
    if (body.status === 'scheduled' && body.publishAt) {
      body.isScheduled = true
    }

    const celebrity = await Celebrity.create(body)

    return NextResponse.json(
      {
        success: true,
        data: celebrity,
        message: 'Celebrity created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating celebrity:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
