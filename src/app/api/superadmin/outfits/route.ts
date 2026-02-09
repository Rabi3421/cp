import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Outfit from '@/models/Outfit'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch all outfits with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const celebrity = searchParams.get('celebrity') || ''
    const isFeatured = searchParams.get('isFeatured') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { designer: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }

    if (status) query.status = status
    if (category) query.category = category
    if (celebrity) query.celebrity = celebrity
    if (isFeatured) query.isFeatured = isFeatured === 'true'

    const skip = (page - 1) * limit
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const [outfits, total] = await Promise.all([
      Outfit.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('celebrity', 'name slug profileImage')
        .select('-__v')
        .lean(),
      Outfit.countDocuments(query),
    ])

    // Get stats
    const stats = await Outfit.aggregate([
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
          totalViews: { $sum: '$viewCount' },
          totalLikes: { $sum: '$likesCount' },
          totalShares: { $sum: '$shareCount' },
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: outfits,
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
        totalLikes: 0,
        totalShares: 0,
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

// POST - Create new outfit
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

    // Ensure seo has expected structure with defaults
    const defaultSeo = {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      canonicalUrl: '',
      noindex: false,
      nofollow: false,
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogType: 'product',
      ogSiteName: 'Celebrity Persona',
      ogUrl: '',
      ogImages: [],
      ogLocale: 'en_US',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterSite: '@celebritypersona',
      twitterCreator: '@celebritypersona',
      schemaType: 'Product',
      schemaJson: null,
      publishedTime: '',
      modifiedTime: '',
      authorName: '',
      tags: [],
      section: 'Celebrity Outfits',
      alternateLangs: [],
      prevUrl: '',
      nextUrl: '',
      canonicalAlternates: [],
      focusKeyword: '',
      structuredDataDepth: 'minimal',
      contentScore: 0,
      readabilityScore: 0,
      relatedTopics: [],
      searchVolume: 0,
      authorUrl: '',
    }

    body.seo = { ...(body.seo || {}), ...defaultSeo }

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Check for duplicate slug
    const existingOutfit = await Outfit.findOne({ slug: body.slug })
    if (existingOutfit) {
      return NextResponse.json(
        { success: false, error: 'Outfit with this slug already exists' },
        { status: 400 }
      )
    }

    // Handle scheduled publishing
    if (body.status === 'scheduled' && body.publishAt) {
      body.isScheduled = true
    }

    // Create outfit
    const outfit = await Outfit.create(body)

    // Populate celebrity data
    await outfit.populate('celebrity', 'name slug profileImage')

    return NextResponse.json(
      {
        success: true,
        data: outfit,
        message: 'Outfit created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating outfit:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
