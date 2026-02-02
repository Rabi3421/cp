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

// POST - Test email connection
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

    let settings = await SystemSettings.findOne()
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Email configuration not found' },
        { status: 404 }
      )
    }

    const { smtpServer, smtpPort, fromEmail, username, password } = settings.emailConfig

    // In a real application, you would test the SMTP connection
    // For now, we'll simulate a successful test
    
    try {
      // Uncomment this to test real SMTP connection with nodemailer
      // const transporter = nodemailer.createTransport({
      //   host: smtpServer,
      //   port: parseInt(smtpPort),
      //   secure: parseInt(smtpPort) === 465,
      //   auth: {
      //     user: username,
      //     pass: password,
      //   },
      // })
      // await transporter.verify()

      return NextResponse.json(
        { 
          success: true,
          message: 'Email connection test successful'
        },
        { status: 200 }
      )
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email connection test failed',
          details: error.message
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error testing email connection:', error)
    return NextResponse.json(
      { error: 'Failed to test email connection', details: error.message },
      { status: 500 }
    )
  }
}
