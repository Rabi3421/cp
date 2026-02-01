import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { authenticate } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Get user from token
    const { authenticated, user } = authenticate(req)

    if (!authenticated || !user) {
      const response = NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
      return clearAuthCookies(response)
    }

    // Clear refresh token from database
    await User.findByIdAndUpdate(user.userId, { refreshToken: null })

    // Clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    })

    return clearAuthCookies(response)
  } catch (error: any) {
    console.error('Logout error:', error)
    return Response.json(
      { error: error.message || 'Error logging out' },
      { status: 500 }
    )
  }
}
