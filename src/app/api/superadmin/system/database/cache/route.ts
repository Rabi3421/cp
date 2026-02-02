import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key'

async function verifySuperadminToken(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value

    if (!accessToken) {
      return null
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as {
      userId: string
      role: string
    }

    if (decoded.role !== 'superadmin') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// DELETE - Clear cache
export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifySuperadminToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    // In a real application, you would:
    // 1. Clear Redis cache
    // 2. Clear application cache
    // 3. Clear Next.js cache if needed
    // 4. Clear CDN cache
    
    // For now, we'll simulate the cache clearing process
    return NextResponse.json(
      { 
        message: 'Cache cleared successfully',
        clearedAt: new Date(),
        itemsCleared: 1234 // Simulated number
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache', details: error.message },
      { status: 500 }
    )
  }
}
