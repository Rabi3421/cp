import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import crypto from 'crypto'

// In-memory store for reset tokens (use Redis in production)
const resetTokens = new Map<string, { email: string; expires: number }>()

/**
 * POST /api/superadmin/credential/forgot-password
 * Generate password reset token for superadmin
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find superadmin
    const superadmin = await User.findOne({ email, role: 'superadmin' })
    if (!superadmin) {
      // For security, don't reveal if email exists
      return NextResponse.json(
        {
          success: true,
          message: 'If this email is registered as superadmin, a reset token will be generated',
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000 // 1 hour

    // Store token
    resetTokens.set(resetToken, { email, expires })

    // In production, send this token via email
    // For now, return it in response
    return NextResponse.json(
      {
        success: true,
        message: 'Password reset token generated successfully',
        resetToken, // In production, this should be sent via email only
        expiresIn: '1 hour',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process forgot password request' },
      { status: 500 }
    )
  }
}
