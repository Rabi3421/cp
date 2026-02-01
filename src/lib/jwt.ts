import jwt from 'jsonwebtoken'
import { UserRole } from '@/models/User'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m'
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d'

export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
}

export interface DecodedToken extends TokenPayload {
  iat: number
  exp: number
}

/**
 * Generate Access Token (short-lived)
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  })
}

/**
 * Generate Refresh Token (long-lived)
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  })
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as DecodedToken
  } catch (error) {
    return null
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as DecodedToken
  } catch (error) {
    return null
  }
}

/**
 * Generate both tokens
 */
export function generateTokens(payload: TokenPayload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}
