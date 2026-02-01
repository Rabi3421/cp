import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { generateTokens } from '@/lib/jwt'
import { createAuthResponse } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { name, email, password, role = 'user' } = body

    // Validation
    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Prevent direct superadmin creation (must be done manually)
    if (role === 'superadmin') {
      return Response.json(
        { error: 'Cannot create superadmin through signup' },
        { status: 403 }
      )
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'user' : role, // Default admin signup to user
    })

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
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      {
        status: 201,
        accessToken,
        refreshToken,
      }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      return Response.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    return Response.json(
      { error: error.message || 'Error creating user' },
      { status: 500 }
    )
  }
}
