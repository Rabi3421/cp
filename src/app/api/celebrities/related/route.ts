import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'

// GET - return related celebrities for a given celebrity (by slug or id)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug') || ''
    const id = searchParams.get('id') || ''
    const limit = parseInt(searchParams.get('limit') || '6')

    let baseCelebrity: any = null
    if (slug) {
      baseCelebrity = await Celebrity.findOne({ slug, status: 'published' }).lean()
    } else if (id) {
      baseCelebrity = await Celebrity.findById(id).lean()
    }

    if (!baseCelebrity) {
      return NextResponse.json({ success: false, data: [], message: 'Celebrity not found' })
    }

    // If explicit relatedCelebrities provided on the document, fetch those
    if (Array.isArray(baseCelebrity.relatedCelebrities) && baseCelebrity.relatedCelebrities.length > 0) {
      const related = await Celebrity.find({ slug: { $in: baseCelebrity.relatedCelebrities }, status: 'published' })
        .limit(limit)
        .select('name slug profileImage occupation profession categories')
        .lean()

      if (related.length > 0) {
        return NextResponse.json({ success: true, data: related })
      }
    }

    // Build a fallback query using tags, categories, profession, occupation
    const orClauses: any[] = []
    if (Array.isArray(baseCelebrity.tags) && baseCelebrity.tags.length > 0) {
      orClauses.push({ tags: { $in: baseCelebrity.tags } })
    }
    if (Array.isArray(baseCelebrity.categories) && baseCelebrity.categories.length > 0) {
      orClauses.push({ categories: { $in: baseCelebrity.categories } })
    }
    if (Array.isArray(baseCelebrity.profession) && baseCelebrity.profession.length > 0) {
      orClauses.push({ profession: { $in: baseCelebrity.profession } })
    }
    if (Array.isArray(baseCelebrity.occupation) && baseCelebrity.occupation.length > 0) {
      orClauses.push({ occupation: { $in: baseCelebrity.occupation } })
    }

    const query: any = { status: 'published', _id: { $ne: baseCelebrity._id } }
    if (orClauses.length > 0) query.$or = orClauses

    const related = await Celebrity.find(query)
      .sort({ popularityScore: -1, viewCount: -1, createdAt: -1 })
      .limit(limit)
      .select('name slug profileImage occupation profession categories')
      .lean()

    return NextResponse.json({ success: true, data: related })
  } catch (error: any) {
    console.error('Error fetching related celebrities:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
