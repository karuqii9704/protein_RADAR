import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { TransactionType, Role } from '@prisma/client';

// GET /api/admin/transactions - Get all transactions with filters
export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Filters
    const type = searchParams.get('type') as TransactionType | null;
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: {
      type?: TransactionType;
      categoryId?: string;
      description?: { contains: string; mode: 'insensitive' };
      date?: { gte?: Date; lte?: Date };
    } = {};

    if (type && Object.values(TransactionType).includes(type)) {
      where.type = type;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, color: true, icon: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Format transactions
    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      donor: t.donor,
      recipient: t.recipient,
      date: t.date.toISOString().split('T')[0],
      receiptNumber: t.receiptNumber,
      notes: t.notes,
      category: t.category,
      createdBy: t.createdBy,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return paginatedResponse(formattedTransactions, total, page, limit);
  } catch (error) {
    console.error('Admin transactions fetch error:', error);
    return errorResponse('Failed to fetch transactions', 500);
  }
}

// POST /api/admin/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { type, amount, description, donor, recipient, date, categoryId, receiptNumber, notes } = body;

    // Validate required fields
    if (!type || !amount || !description || !categoryId) {
      return errorResponse('Type, amount, description, and categoryId are required', 400);
    }

    if (!Object.values(TransactionType).includes(type)) {
      return errorResponse('Invalid transaction type', 400);
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        donor: type === TransactionType.INCOME ? donor : null,
        recipient: type === TransactionType.EXPENSE ? recipient : null,
        date: date ? new Date(date) : new Date(),
        categoryId,
        receiptNumber,
        notes,
        createdById: authResult.user.userId,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return successResponse({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      date: transaction.date.toISOString().split('T')[0],
      category: transaction.category,
    }, 'Transaction created successfully');
  } catch (error) {
    console.error('Create transaction error:', error);
    return errorResponse('Failed to create transaction', 500);
  }
}
