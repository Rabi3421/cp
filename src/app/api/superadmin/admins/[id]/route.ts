import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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

// GET - Get single admin by ID
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
    const admin = await User.findById(id).select('-password -refreshToken')

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    if (admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'User is not an admin' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { admin },
    })
  } catch (error: any) {
    console.error('Get admin error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin' },
      { status: 500 }
    )
  }
}

// PUT - Update admin
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
    const { name, email, password, isActive, avatar } = body

    // Find admin
    const admin = await User.findById(id)

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    if (admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'User is not an admin' },
        { status: 400 }
      )
    }

    // Update fields
    if (name) admin.name = name
    if (email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: id } })
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 400 }
        )
      }
      admin.email = email
    }
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      // Password will be hashed by the pre-save hook
      admin.password = password
    }
    if (typeof isActive === 'boolean') admin.isActive = isActive
    if (avatar) admin.avatar = avatar

    await admin.save()

    const updatedAdmin = await User.findById(id).select('-password -refreshToken')

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      data: { admin: updatedAdmin },
    })
  } catch (error: any) {
    console.error('Update admin error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update admin' },
      { status: 500 }
    )
  }
}

// DELETE - Delete admin
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

    // Find admin
    const { id } = await params
    const admin = await User.findById(id)

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    if (admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'User is not an admin' },
        { status: 400 }
      )
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete admin' },
      { status: 500 }
    )
  }
}
