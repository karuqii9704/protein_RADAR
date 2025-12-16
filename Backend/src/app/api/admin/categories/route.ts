import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, TransactionType } from '@prisma/client';

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN, Role.VIEWER]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as TransactionType | null;

    const where: { type?: TransactionType } = {};
    if (type && Object.values(TransactionType).includes(type)) {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    const formattedCategories = categories.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      color: c.color,
      icon: c.icon,
      isActive: c.isActive,
      transactionCount: c._count.transactions,
    }));

    return successResponse(formattedCategories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { name, type, description, color, icon } = body;

    if (!name || !type) {
      return errorResponse('Name and type are required', 400);
    }

    if (!Object.values(TransactionType).includes(type)) {
      return errorResponse('Invalid category type', 400);
    }

    // Check if category name already exists
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return errorResponse('Category with this name already exists', 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        description,
        color: color || '#10B981',
        icon: icon || 'circle',
      },
    });

    return successResponse({
      id: category.id,
      name: category.name,
      type: category.type,
    }, 'Category created successfully');
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse('Failed to create category', 500);
  }
}
