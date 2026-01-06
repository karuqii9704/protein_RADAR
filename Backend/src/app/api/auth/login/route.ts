import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ErrorMessages } from '@/utils/api-response';
import { generateToken } from '@/middleware/auth';

export const dynamic = 'force-dynamic';

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3001';
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.split(',')[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// POST /api/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    });

    if (!user) {
      return errorResponse(ErrorMessages.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse('Your account has been deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return errorResponse(ErrorMessages.INVALID_CREDENTIALS, 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}

