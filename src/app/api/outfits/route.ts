import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Outfit from '@/models/Outfit'
import '@/models/Celebrity'

// GET - Public endpoint to fetch published outfits
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const isFeatured = searchParams.get('isFeatured') || ''

    // Build query - only published outfits
    const query: any = { status: 'published' }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { event: { $regex: search, $options: 'i' } },
        { designer: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    if (category) query.category = category
    if (isFeatured) query.isFeatured = isFeatured === 'true'
    // Filter by celebrity ObjectId (optional)
    const celebrityFilter = searchParams.get('celebrity') || ''
    if (celebrityFilter) {
      // accept either ObjectId string
      query.celebrity = celebrityFilter
    }

    const skip = (page - 1) * limit

    const [outfits, total, featured] = await Promise.all([
      Outfit.find(query)
        .sort({ isFeatured: -1, viewCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('celebrity', 'name slug profileImage')
        .select('-__v')
        .lean(),
      Outfit.countDocuments(query),
      Outfit.find({ status: 'published', isFeatured: true })
        .sort({ viewCount: -1 })
        .limit(6)
        .populate('celebrity', 'name slug profileImage')
        .select('title slug images event celebrity category')
        .lean(),
    ])

    // Get categories with count
    const categoriesData = await Outfit.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get stats
      const stats = await Outfit.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalViews: { $sum: '$viewCount' },
            totalLikes: { $sum: '$likesCount' },
            avgPrice: {
              $avg: {
                $cond: [
                  {
                    $and: [
                      { $ifNull: ['$price', false] },
                      { $ne: ['$price', ''] },
                      { $regexMatch: { input: '$price', regex: /^[\d.]+$/ } }
                    ]
                  },
                  { $toDouble: '$price' },
                  null
                ]
              }
            },
          },
        },
      ])

    return NextResponse.json({
      success: true,
      data: outfits,
      featured,
      categories: categoriesData.map(c => ({ name: c._id, count: c.count })),
      stats: stats[0] || { total: 0, totalViews: 0, totalLikes: 0 },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
