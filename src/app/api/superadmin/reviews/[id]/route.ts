import { NextRequest, NextResponse } from 'next/server'
import { authenticate, authorizeRole } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import MovieReview from '@/models/MovieReview'

// GET /api/superadmin/reviews/[id] - Get a single movie review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const review = await MovieReview.findById(id)

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Movie review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: review,
    })
  } catch (error: any) {
    console.error('Error fetching movie review:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/superadmin/reviews/[id] - Update a movie review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error },
        { status: 403 }
      )
    }

    await connectDB()
    const { id } = await params

    const data = await request.json()

    // If slug is being updated, check for duplicates
    if (data.slug) {
      const existingReview = await MovieReview.findOne({
        slug: data.slug,
        _id: { $ne: id },
      })
      if (existingReview) {
        return NextResponse.json(
          { success: false, error: 'Review with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const review = await MovieReview.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Movie review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Movie review updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating movie review:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/superadmin/reviews/[id] - Delete a movie review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const roleCheck = authorizeRole(['superadmin'], auth.user)
    if (!roleCheck.authorized) {
      return NextResponse.json(
        { success: false, error: roleCheck.error },
        { status: 403 }
      )
    }

    await connectDB()
    const { id } = await params

    const review = await MovieReview.findByIdAndDelete(id)

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Movie review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Movie review deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting movie review:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
