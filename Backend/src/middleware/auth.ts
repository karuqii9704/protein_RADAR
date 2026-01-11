import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { errorResponse, ErrorMessages } from '@/utils/api-response';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

// Generate JWT Token
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT Token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// Extract token from request
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Auth middleware - returns user or error response
export async function withAuth(
  request: NextRequest,
  allowedRoles?: Role[]
): Promise<{ user: JwtPayload & { name: string } } | NextResponse> {
  const token = extractToken(request);
  
  if (!token) {
    return errorResponse(ErrorMessages.UNAUTHORIZED, 401);
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return errorResponse(ErrorMessages.TOKEN_INVALID, 401);
  }
  
  // Check if user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, isActive: true, role: true },
  });
  
  if (!user || !user.isActive) {
    return errorResponse(ErrorMessages.UNAUTHORIZED, 401);
  }
  
  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return errorResponse(ErrorMessages.FORBIDDEN, 403);
  }
  
  return { user: { ...payload, name: user.name } };
}

// Helper to check if auth result is an error
export function isAuthError(result: { user: JwtPayload } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
