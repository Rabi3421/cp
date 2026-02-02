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

// GET - Get security settings
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifySuperadminToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({})
    }

    return NextResponse.json(
      { security: settings.security },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching security settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security settings', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update security settings
export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifySuperadminToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized. Superadmin access required.' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { security } = await request.json()

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({ security })
    } else {
      settings.security = { ...settings.security, ...security }
      await settings.save()
    }

    return NextResponse.json(
      { 
        message: 'Security settings updated successfully',
        security: settings.security
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating security settings:', error)
    return NextResponse.json(
      { error: 'Failed to update security settings', details: error.message },
      { status: 500 }
    )
  }
}
