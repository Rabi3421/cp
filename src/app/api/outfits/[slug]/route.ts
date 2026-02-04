import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Outfit from '@/models/Outfit'
import '@/models/Celebrity'

// GET - Fetch single outfit by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const outfit = await Outfit.findOne({
      slug: slug,
      status: 'published',
      isActive: true,
    })
      .populate('celebrity', 'name slug profileImage')
      .select('-__v')
      .lean()

    if (!outfit) {
      return NextResponse.json(
        { success: false, error: 'Outfit not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await Outfit.updateOne(
      { _id: outfit._id },
      { $inc: { viewCount: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: outfit,
    })
  } catch (error: any) {
    console.error('Error fetching outfit:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
