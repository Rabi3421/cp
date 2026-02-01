import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

/**
 * PUT /api/superadmin/credential/update-password
 * Update superadmin password
 */
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const { email, currentPassword, newPassword } = await request.json()

    // Validation
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Email, current password, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find superadmin (explicitly select password field)
    const superadmin = await User.findOne({ email, role: 'superadmin' }).select('+password')
    if (!superadmin) {
      return NextResponse.json(
        { error: 'Superadmin not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await superadmin.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Update password
    superadmin.password = newPassword // Will be hashed by pre-save hook
    await superadmin.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Superadmin password updated successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update superadmin password error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update superadmin password' },
      { status: 500 }
    )
  }
}
