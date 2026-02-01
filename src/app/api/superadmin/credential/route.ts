import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

/**
 * POST /api/superadmin/credential
 * Create superadmin credential
 * Only one superadmin can exist in the system
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if superadmin already exists
    const existingSuperadmin = await User.findOne({ role: 'superadmin' })
    if (existingSuperadmin) {
      return NextResponse.json(
        { error: 'Superadmin credential already exists. Only one superadmin is allowed.' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create superadmin
    const superadmin = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: 'superadmin',
    })

    await superadmin.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Superadmin credential created successfully',
        superadmin: {
          id: superadmin._id,
          name: superadmin.name,
          email: superadmin.email,
          role: superadmin.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create superadmin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create superadmin credential' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/superadmin/credential
 * Check if superadmin credential exists
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const superadmin = await User.findOne({ role: 'superadmin' }).select('-password')

    if (!superadmin) {
      return NextResponse.json(
        { exists: false, message: 'No superadmin credential found' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        exists: true,
        superadmin: {
          id: superadmin._id,
          name: superadmin.name,
          email: superadmin.email,
          role: superadmin.role,
          createdAt: superadmin.createdAt,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Get superadmin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check superadmin credential' },
      { status: 500 }
    )
  }
}
