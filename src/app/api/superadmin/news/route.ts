import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import News from '@/models/News'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch all news with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured') || ''
    const celebrity = searchParams.get('celebrity') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ]
    }

    if (status) query.status = status
    if (category) query.category = category
    if (featured) query.featured = featured === 'true'
    if (celebrity) query.celebrity = celebrity

    const skip = (page - 1) * limit
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [news, total] = await Promise.all([
      News.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('celebrity', 'name slug profileImage')
        .select('-__v')
        .lean(),
      News.countDocuments(query),
    ])

    // Get stats
    const stats = await News.aggregate([
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
          featured: { $sum: { $cond: ['$featured', 1, 0] } },
          totalViews: { $sum: '$viewCount' },
          totalShares: { $sum: '$shareCount' },
          totalLikes: { $sum: '$likesCount' },
          totalComments: { $sum: '$commentsCount' },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: news,
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
        totalViews: 0,
        totalShares: 0,
        totalLikes: 0,
        totalComments: 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new news article
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
    const existingNews = await News.findOne({ slug: body.slug })
    if (existingNews) {
      return NextResponse.json(
        { success: false, error: 'News article with this slug already exists' },
        { status: 400 }
      )
    }

    const news = await News.create(body)

    return NextResponse.json(
      {
        success: true,
        data: news,
        message: 'News article created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
