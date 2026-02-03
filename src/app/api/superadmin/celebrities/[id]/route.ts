import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'
import { authenticate, authorizeRole } from '@/lib/auth'

// GET - Fetch single celebrity by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const celebrity = await Celebrity.findById(params.id)

    if (!celebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity not found' },
        { status: 404 }
      )
    }

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

// PUT - Update celebrity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json()

    // If slug is being updated, check for duplicates
    if (body.slug) {
      const existingCelebrity = await Celebrity.findOne({
        slug: body.slug,
        _id: { $ne: params.id },
      })
      if (existingCelebrity) {
        return NextResponse.json(
          { success: false, error: 'Celebrity with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Handle scheduled publishing
    if (body.status === 'scheduled' && body.publishAt) {
      body.isScheduled = true
    } else if (body.status !== 'scheduled') {
      body.isScheduled = false
      body.publishAt = null
    }

    const celebrity = await Celebrity.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!celebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: celebrity,
      message: 'Celebrity updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating celebrity:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete celebrity
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const celebrity = await Celebrity.findByIdAndDelete(params.id)

    if (!celebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Celebrity deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting celebrity:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
