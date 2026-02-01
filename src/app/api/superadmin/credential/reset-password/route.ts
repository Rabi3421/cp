import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Import the same resetTokens store (in production, use Redis)
// For now, we'll recreate the Map - in production this should be shared
const resetTokens = new Map<string, { email: string; expires: number }>()

/**
 * POST /api/superadmin/credential/reset-password
 * Reset superadmin password using token
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { token, newPassword } = await request.json()

    // Validation
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify token
    const tokenData = resetTokens.get(token)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    if (Date.now() > tokenData.expires) {
      resetTokens.delete(token)
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Find superadmin
    const superadmin = await User.findOne({
      email: tokenData.email,
      role: 'superadmin',
    })
    if (!superadmin) {
      return NextResponse.json(
        { error: 'Superadmin not found' },
        { status: 404 }
      )
    }

    // Update password
    superadmin.password = newPassword // Will be hashed by pre-save hook
    await superadmin.save()

    // Delete used token
    resetTokens.delete(token)

    return NextResponse.json(
      {
        success: true,
        message: 'Superadmin password reset successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    )
  }
}
