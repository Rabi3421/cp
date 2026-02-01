import { NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Authenticate user
    const { authenticated, user, error } = authenticate(req)

    if (!authenticated || !user) {
      return Response.json({ error: error || 'Not authenticated' }, { status: 401 })
    }

    // Get user details from database
    const userData = await User.findById(user.userId)

    if (!userData) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({
      success: true,
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        isActive: userData.isActive,
        createdAt: userData.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return Response.json(
      { error: error.message || 'Error fetching user' },
      { status: 500 }
    )
  }
}
