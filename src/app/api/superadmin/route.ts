import { NextRequest } from 'next/server'
import { authenticate, authorizeRole } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Only superadmin can access
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Authenticate user
    const { authenticated, user, error } = authenticate(req)

    if (!authenticated || !user) {
      return Response.json({ error: error || 'Not authenticated' }, { status: 401 })
    }

    // Check if user is superadmin
    const { authorized, error: authError } = authorizeRole(['superadmin'], user)

    if (!authorized) {
      return Response.json({ error: authError || 'Access denied. Superadmin only.' }, { status: 403 })
    }

    const body = await req.json()
    const { userId, role } = body

    if (!userId || !role) {
      return Response.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      )
    }

    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return Response.json(
        { error: 'Invalid role. Must be user, admin, or superadmin' },
        { status: 400 }
      )
    }

    // Prevent changing superadmin role
    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.role === 'superadmin' && role !== 'superadmin') {
      return Response.json(
        { error: 'Cannot change superadmin role' },
        { status: 403 }
      )
    }

    // Update user role
    targetUser.role = role
    await targetUser.save()

    return Response.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    })
  } catch (error: any) {
    console.error('Update role error:', error)
    return Response.json(
      { error: error.message || 'Error updating user role' },
      { status: 500 }
    )
  }
}

// Get system stats - superadmin only
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Authenticate user
    const { authenticated, user, error } = authenticate(req)

    if (!authenticated || !user) {
      return Response.json({ error: error || 'Not authenticated' }, { status: 401 })
    }

    // Check if user is superadmin
    const { authorized, error: authError } = authorizeRole(['superadmin'], user)

    if (!authorized) {
      return Response.json({ error: authError || 'Access denied. Superadmin only.' }, { status: 403 })
    }

    // Get system statistics
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ])

    return Response.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
      },
    })
  } catch (error: any) {
    console.error('Get stats error:', error)
    return Response.json(
      { error: error.message || 'Error fetching stats' },
      { status: 500 }
    )
  }
}
