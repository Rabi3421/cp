import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key'

// Verify superadmin token
async function verifySuperadminToken(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value

    if (!accessToken) {
      return null
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as {
      userId: string
      role: string
    }

    if (decoded.role !== 'superadmin') {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

// GET - Get single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifySuperadminToken(request)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { id } = await params
    const user = await User.findById(id).select('-password -refreshToken')

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent accessing superadmin details
    if (user.role === 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Cannot access superadmin details' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { user },
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifySuperadminToken(request)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }
    
    await dbConnect()

    const { id } = await params
    const body = await request.json()
    const { name, email, role, isActive, avatar } = body

    // Find user
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent modifying superadmin
    if (user.role === 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Cannot modify superadmin' },
        { status: 403 }
      )
    }

    // Prevent promoting to superadmin
    if (role === 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Cannot promote user to superadmin' },
        { status: 403 }
      )
    }

    // Update fields
    if (name) user.name = name
    if (email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: id } })
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 400 }
        )
      }
      user.email = email
    }
    if (role) user.role = role
    if (typeof isActive === 'boolean') user.isActive = isActive
    if (avatar) user.avatar = avatar

    await user.save()

    const updatedUser = await User.findById(id).select('-password -refreshToken')

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifySuperadminToken(request)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Find user
    const { id } = await params
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting superadmin
    if (user.role === 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete superadmin' },
        { status: 403 }
      )
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
