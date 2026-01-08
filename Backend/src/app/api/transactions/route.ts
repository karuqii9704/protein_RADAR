import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { TransactionType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/transactions - Get recent public transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Optional filters
    const type = searchParams.get('type') as TransactionType | null;
    const categoryId = searchParams.get('categoryId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Build where clause
    const where: {
      type?: TransactionType;
      categoryId?: string;
      date?: { gte: Date; lte: Date };
    } = {};

    if (type && Object.values(TransactionType).includes(type)) {
      where.type = type;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // Add month/year filter for reports export
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          donor: true,
          recipient: true,
          date: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Format transactions for frontend
    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      type: t.type, // Keep uppercase for Excel export
      amount: Number(t.amount),
      description: t.description,
      donor: t.donor,
      recipient: t.recipient,
      date: t.date.toISOString().split('T')[0],
      category: { 
        id: t.category.id,
        name: t.category.name,
        color: t.category.color,
        icon: t.category.icon,
      },
    }));

    return paginatedResponse(formattedTransactions, total, page, limit);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return errorResponse('Failed to fetch transactions', 500);
  }
}
