import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id] - Get single user
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse('User tidak ditemukan', 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error('Admin user fetch error:', error);
    return errorResponse('Failed to fetch user', 500);
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const { email, password, name, role, isActive } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse('User tidak ditemukan', 404);
    }

    // Check email uniqueness if changing
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return errorResponse('Email sudah digunakan', 400);
      }
    }

    // Build update data
    const updateData: {
      email?: string;
      password?: string;
      name?: string;
      role?: Role;
      isActive?: boolean;
    } = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role && Object.values(Role).includes(role)) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    // Hash password if provided
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return successResponse(user, 'User berhasil diperbarui');
  } catch (error) {
    console.error('Admin user update error:', error);
    return errorResponse('Failed to update user', 500);
  }
}

// DELETE /api/admin/users/[id] - Deactivate user (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse('User tidak ditemukan', 404);
    }

    // Soft delete by deactivating
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse(null, 'User berhasil dinonaktifkan');
  } catch (error) {
    console.error('Admin user delete error:', error);
    return errorResponse('Failed to delete user', 500);
  }
}
