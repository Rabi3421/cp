import { NextRequest } from 'next/server'
import { authenticate, authorizeRole } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Only admins and superadmin can access
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Authenticate user
    const { authenticated, user, error } = authenticate(req)

    if (!authenticated || !user) {
      return Response.json({ error: error || 'Not authenticated' }, { status: 401 })
    }

    // Check if user has admin or superadmin role
    const { authorized, error: authError } = authorizeRole(['admin', 'superadmin'], user)

    if (!authorized) {
      return Response.json({ error: authError || 'Access denied' }, { status: 403 })
    }

    // Get all users (excluding passwords)
    const users = await User.find().select('-password -refreshToken')

    return Response.json({
      success: true,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      count: users.length,
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    return Response.json(
      { error: error.message || 'Error fetching users' },
      { status: 500 }
    )
  }
}
