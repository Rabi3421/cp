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

// GET - Get API configuration
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

    // Mask the API key
    const apiConfig = { ...settings.apiConfig }
    if (apiConfig.apiKey) {
      apiConfig.apiKey = '••••••••••••••••'
    }

    return NextResponse.json(
      { apiConfig },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching API configuration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API configuration', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update API configuration
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

    const { apiConfig } = await request.json()

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({ apiConfig })
    } else {
      // Don't update API key if it's the masked value
      if (apiConfig.apiKey === '••••••••••••••••') {
        delete apiConfig.apiKey
      }
      
      settings.apiConfig = { ...settings.apiConfig, ...apiConfig }
      await settings.save()
    }

    // Mask the API key in response
    const responseConfig = { ...settings.apiConfig }
    if (responseConfig.apiKey) {
      responseConfig.apiKey = '••••••••••••••••'
    }

    return NextResponse.json(
      { 
        message: 'API configuration updated successfully',
        apiConfig: responseConfig
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating API configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update API configuration', details: error.message },
      { status: 500 }
    )
  }
}
