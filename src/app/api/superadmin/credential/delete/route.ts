import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

/**
 * DELETE /api/superadmin/credential/delete
 * Delete superadmin credential
 */
export async function DELETE(request: NextRequest) {
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
        { error: 'Superadmin not found' },
        { status: 404 }
      )
    }

    // Verify password
    const isPasswordValid = await superadmin.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 401 }
      )
    }

    // Delete superadmin
    await User.findByIdAndDelete(superadmin._id)

    return NextResponse.json(
      {
        success: true,
        message: 'Superadmin credential deleted successfully',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete superadmin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete superadmin credential' },
      { status: 500 }
    )
  }
}
