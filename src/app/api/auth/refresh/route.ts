import { NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt'
import { createAuthResponse } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Get refresh token from cookies or body
    const refreshToken =
      req.cookies.get('refreshToken')?.value ||
      (await req.json()).refreshToken

    if (!refreshToken) {
      return Response.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      return Response.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken')
    if (!user || user.refreshToken !== refreshToken) {
      return Response.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return Response.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Return new access token
    return createAuthResponse(
      {
        success: true,
        message: 'Token refreshed successfully',
      },
      {
        status: 200,
        accessToken: newAccessToken,
      }
    )
  } catch (error: any) {
    console.error('Refresh token error:', error)
    return Response.json(
      { error: error.message || 'Error refreshing token' },
      { status: 500 }
    )
  }
}
