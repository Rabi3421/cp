import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key'

// Verify superadmin token
async function verifySuperadminToken(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value

    console.log('Verifying token - accessToken present:', !!accessToken)

    if (!accessToken) {
      return null
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as {
      userId: string
      role: string
    }

    console.log('Decoded token role:', decoded.role)

    if (decoded.role !== 'superadmin') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// GET - Get all admins
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifySuperadminToken(request)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')

    // Build query - only get admins
    const query: any = {
      role: 'admin',
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true'
    }

    const skip = (page - 1) * limit

    const [admins, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: {
        admins,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error: any) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// POST - Create new admin
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifySuperadminToken(request)

    console.log('Admin creation - decoded token:', decoded)

    if (!decoded) {
      console.log('Admin creation - no valid token found')
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    const body = await request.json()
    const { name, email, password, avatar, isActive } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create admin
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      avatar: avatar || '/images/team/user1.svg',
      isActive: typeof isActive === 'boolean' ? isActive : true,
    })

    const createdAdmin = await User.findById(admin._id).select('-password -refreshToken')

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: { admin: createdAdmin },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create admin' },
      { status: 500 }
    )
  }
}
