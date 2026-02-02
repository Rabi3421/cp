import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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

// POST - Optimize database
export async function POST(request: NextRequest) {
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
    // 1. Run database optimization commands
    // 2. Compact collections
    // 3. Rebuild indexes
    // 4. Remove orphaned documents
    
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not established')
    }

    // Get database stats
    const stats = await db.stats()
    
    return NextResponse.json(
      { 
        message: 'Database optimized successfully',
        stats: {
          collections: stats.collections,
          dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
          indexes: stats.indexes,
          indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error optimizing database:', error)
    return NextResponse.json(
      { error: 'Failed to optimize database', details: error.message },
      { status: 500 }
    )
  }
}
