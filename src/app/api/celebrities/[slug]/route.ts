import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'

// GET - Fetch single celebrity by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const celebrity = await Celebrity.findOne({
      slug: slug,
      status: 'published',
      isActive: true,
    })
      .select('-__v')
      .lean()

    if (!celebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await Celebrity.updateOne(
      { _id: celebrity._id },
      { $inc: { viewCount: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: celebrity,
    })
  } catch (error: any) {
    console.error('Error fetching celebrity:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
