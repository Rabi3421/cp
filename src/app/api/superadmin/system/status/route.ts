import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'
import jwt from 'jsonwebtoken'
import os from 'os'

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

function calculateSystemStats() {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const memPercentage = Math.round((usedMem / totalMem) * 100)
  
  const uptime = os.uptime()
  const uptimePercentage = 99.9 // Simulated uptime percentage
  
  return {
    serverStatus: {
      status: 'online' as const,
      uptime: uptimePercentage
    },
    memoryUsage: {
      percentage: memPercentage,
      used: `${(usedMem / 1024 / 1024 / 1024).toFixed(1)} GB`,
      total: `${(totalMem / 1024 / 1024 / 1024).toFixed(1)} GB`
    }
  }
}

// GET - Get system status
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

    // Get or create system settings
    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create({})
    }

    // Calculate real-time system stats
    const systemStats = calculateSystemStats()
    
    // Update with real-time data
    const response = {
      ...settings.toObject(),
      serverStatus: systemStats.serverStatus,
      memoryUsage: systemStats.memoryUsage
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching system status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system status', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update system status settings
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

    const body = await request.json()
    
    // Get or create system settings
    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      settings = await SystemSettings.create(body)
    } else {
      // Update settings
      Object.assign(settings, body)
      await settings.save()
    }

    return NextResponse.json(
      { message: 'System status updated successfully', settings },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating system status:', error)
    return NextResponse.json(
      { error: 'Failed to update system status', details: error.message },
      { status: 500 }
    )
  }
}
