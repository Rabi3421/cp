import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'

/**
 * POST /api/superadmin/login
 * Separate login endpoint for superadmin
 * Returns access token and refresh token
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find superadmin (explicitly select password field)
    const superadmin = await User.findOne({ email, role: 'superadmin' }).select('+password')
    if (!superadmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await superadmin.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: superadmin._id.toString(),
      email: superadmin.email,
      role: superadmin.role,
    })

    const refreshToken = generateRefreshToken({
      userId: superadmin._id.toString(),
      email: superadmin.email,
      role: superadmin.role,
    })

    // Set tokens in HTTP-only cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Superadmin logged in successfully',
        user: {
          id: superadmin._id,
          name: superadmin.name,
          email: superadmin.email,
          role: superadmin.role,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    )

    // Set cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Superadmin login error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to login as superadmin' },
      { status: 500 }
    )
  }
}
