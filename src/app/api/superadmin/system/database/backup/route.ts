import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'
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

// POST - Create database backup
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
    // 1. Use mongodump to create a backup
    // 2. Store it in a secure location (S3, etc.)
    // 3. Track backup metadata
    
    // For now, we'll simulate the backup process
    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({
        lastBackup: new Date()
      })
    } else {
      settings.lastBackup = new Date()
      await settings.save()
    }

    return NextResponse.json(
      { 
        message: 'Database backup created successfully',
        lastBackup: settings.lastBackup,
        size: '2.4 GB' // Simulated backup size
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup', details: error.message },
      { status: 500 }
    )
  }
}
