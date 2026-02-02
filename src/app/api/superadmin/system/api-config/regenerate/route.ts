import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

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

// POST - Regenerate API key
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

    // Generate a new API key
    const newApiKey = crypto.randomBytes(32).toString('hex')

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({
        apiConfig: { apiKey: newApiKey }
      })
    } else {
      settings.apiConfig.apiKey = newApiKey
      await settings.save()
    }

    return NextResponse.json(
      { 
        message: 'API key regenerated successfully',
        apiKey: newApiKey
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error regenerating API key:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate API key', details: error.message },
      { status: 500 }
    )
  }
}
