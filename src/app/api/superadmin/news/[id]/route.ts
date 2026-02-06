import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import News from '@/models/News'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch single news by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const news = await News.findById(id).populate(
      'celebrity',
      'name slug profileImage'
    )

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: news,
    })
  } catch (error: any) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update news article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const body = await request.json()

    // If slug is being updated, check for duplicates
    if (body.slug) {
      const existingNews = await News.findOne({
        slug: body.slug,
        _id: { $ne: id },
      })
      if (existingNews) {
        return NextResponse.json(
          { success: false, error: 'News article with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const news = await News.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: news,
      message: 'News article updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const news = await News.findByIdAndDelete(id)

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
