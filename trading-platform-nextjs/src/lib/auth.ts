import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!token) {
      console.error('[Auth] No token provided');
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('[Auth] Token verified successfully:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  console.log('[Auth] Auth header:', authHeader ? 'present' : 'missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[Auth] Invalid auth header format');
    return null;
  }

  const token = authHeader.substring(7);
  console.log('[Auth] Token extracted from header');
  return token;
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    console.error('[Auth] No token found in request');
    return null;
  }

  const user = verifyToken(token);
  if (!user) {
    console.error('[Auth] Failed to verify token');
  }
  return user;
}
