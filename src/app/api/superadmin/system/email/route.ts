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

// GET - Get email configuration
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

    // Don't send password in response
    const emailConfig = { ...settings.emailConfig }
    if (emailConfig.password) {
      emailConfig.password = '••••••••••••••••'
    }

    return NextResponse.json(
      { emailConfig },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error fetching email configuration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email configuration', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update email configuration
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

    const { emailConfig } = await request.json()

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({ emailConfig })
    } else {
      // Don't update password if it's the masked value
      if (emailConfig.password === '••••••••••••••••') {
        delete emailConfig.password
      }
      
      settings.emailConfig = { ...settings.emailConfig, ...emailConfig }
      await settings.save()
    }

    // Don't send password in response
    const responseConfig = { ...settings.emailConfig }
    if (responseConfig.password) {
      responseConfig.password = '••••••••••••••••'
    }

    return NextResponse.json(
      { 
        message: 'Email configuration updated successfully',
        emailConfig: responseConfig
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating email configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update email configuration', details: error.message },
      { status: 500 }
    )
  }
}
