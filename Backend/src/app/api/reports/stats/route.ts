import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { TransactionType } from '@prisma/client';

// GET /api/reports/stats - Get financial statistics with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Calculate date range for the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get category breakdown
    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Get categories for names
    const categoryIds = [...new Set(categoryStats.map((c) => c.categoryId))];
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true, icon: true, type: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // Format category breakdown
    const incomeByCategory = categoryStats
      .filter((c) => c.type === TransactionType.INCOME)
      .map((c) => {
        const cat = categoryMap.get(c.categoryId);
        return {
          categoryId: c.categoryId,
          name: cat?.name || 'Unknown',
          color: cat?.color || '#10B981',
          icon: cat?.icon || 'circle',
          amount: Number(c._sum.amount || 0),
        };
      })
      .sort((a, b) => b.amount - a.amount);

    const expenseByCategory = categoryStats
      .filter((c) => c.type === TransactionType.EXPENSE)
      .map((c) => {
        const cat = categoryMap.get(c.categoryId);
        return {
          categoryId: c.categoryId,
          name: cat?.name || 'Unknown',
          color: cat?.color || '#EF4444',
          icon: cat?.icon || 'circle',
          amount: Number(c._sum.amount || 0),
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Get totals
    const totalIncome = incomeByCategory.reduce((sum, c) => sum + c.amount, 0);
    const totalExpense = expenseByCategory.reduce((sum, c) => sum + c.amount, 0);

    // Get monthly comparison (last 6 months)
    const monthlyComparison = [];
    for (let i = 5; i >= 0; i--) {
      const compareDate = new Date(year, month - 1 - i, 1);
      const compareStart = new Date(compareDate.getFullYear(), compareDate.getMonth(), 1);
      const compareEnd = new Date(compareDate.getFullYear(), compareDate.getMonth() + 1, 0, 23, 59, 59);

      const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            type: TransactionType.INCOME,
            date: { gte: compareStart, lte: compareEnd },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: TransactionType.EXPENSE,
            date: { gte: compareStart, lte: compareEnd },
          },
          _sum: { amount: true },
        }),
      ]);

      monthlyComparison.push({
        month: compareDate.toLocaleString('id-ID', { month: 'short' }),
        year: compareDate.getFullYear(),
        income: Number(income._sum.amount || 0),
        expense: Number(expense._sum.amount || 0),
      });
    }

    return successResponse({
      period: {
        month,
        year,
        label: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
      },
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      incomeByCategory,
      expenseByCategory,
      monthlyComparison,
    });
  } catch (error) {
    console.error('Report stats fetch error:', error);
    return errorResponse('Failed to fetch report statistics', 500);
  }
}
