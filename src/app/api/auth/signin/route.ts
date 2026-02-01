import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateTokens } from '@/lib/jwt'
import { createAuthResponse } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return Response.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Save refresh token to database
    user.refreshToken = refreshToken
    await user.save()

    // Return user data with tokens
    return createAuthResponse(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      {
        status: 200,
        accessToken,
        refreshToken,
      }
    )
  } catch (error: any) {
    console.error('Login error:', error)
    return Response.json(
      { error: error.message || 'Error logging in' },
      { status: 500 }
    )
  }
}
