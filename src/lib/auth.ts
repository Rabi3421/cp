import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, DecodedToken } from '@/lib/jwt'
import { UserRole } from '@/models/User'

export interface AuthRequest extends NextRequest {
  user?: DecodedToken
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractToken(req: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const token = req.cookies.get('accessToken')?.value
  return token || null
}

/**
 * Middleware to verify authentication
 */
export function authenticate(req: NextRequest): {
  authenticated: boolean
  user?: DecodedToken
  error?: string
} {
  const token = extractToken(req)

  if (!token) {
    return {
      authenticated: false,
      error: 'No token provided',
    }
  }

  const decoded = verifyAccessToken(token)

  if (!decoded) {
    return {
      authenticated: false,
      error: 'Invalid or expired token',
    }
  }

  return {
    authenticated: true,
    user: decoded,
  }
}

/**
 * Middleware to check user role
 */
export function authorizeRole(
  allowedRoles: UserRole[],
  user?: DecodedToken
): {
  authorized: boolean
  error?: string
} {
  if (!user) {
    return {
      authorized: false,
      error: 'User not authenticated',
    }
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      error: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
    }
  }

  return {
    authorized: true,
  }
}

/**
 * Create authentication response helper
 */
export function createAuthResponse(
  data: any,
  options: {
    status?: number
    accessToken?: string
    refreshToken?: string
  } = {}
) {
  const { status = 200, accessToken, refreshToken } = options

  const response = NextResponse.json(data, { status })

  // Set cookies if tokens provided
  if (accessToken) {
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
  }

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  }

  return response
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}
