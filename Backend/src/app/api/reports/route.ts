import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, getPaginationParams, paginatedResponse } from '@/utils/api-response';
import { TransactionType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/reports - Get monthly financial reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Get all months that have transactions for the year
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    // Get all transactions for the year grouped by month
    const transactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startOfYear, lte: endOfYear },
      },
      select: {
        type: true,
        amount: true,
        date: true,
      },
      orderBy: { date: 'desc' },
    });

    // Group transactions by month
    const monthlyData: Record<number, { income: number; expense: number }> = {};
    
    transactions.forEach((t) => {
      const month = t.date.getMonth() + 1;
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      const amount = Number(t.amount);
      if (t.type === TransactionType.INCOME) {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expense += amount;
      }
    });

    // Convert to array and sort by month (descending)
    const reports = Object.entries(monthlyData)
      .map(([month, data]) => {
        const monthNum = parseInt(month);
        const monthDate = new Date(year, monthNum - 1);
        return {
          id: `${year}-${month.padStart(2, '0')}`,
          period: monthDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
          month: monthNum,
          year,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense,
          publishedDate: new Date(year, monthNum - 1, 25).toISOString().split('T')[0],
        };
      })
      .sort((a, b) => b.month - a.month);

    // Apply pagination
    const paginatedReports = reports.slice(skip, skip + limit);

    return paginatedResponse(paginatedReports, reports.length, page, limit);
  } catch (error) {
    console.error('Reports fetch error:', error);
    return errorResponse('Failed to fetch reports', 500);
  }
}
