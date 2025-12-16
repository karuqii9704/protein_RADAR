import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { TransactionType } from '@prisma/client';

// GET /api/dashboard/stats - Get dashboard statistics for homepage
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get total income for the month
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.INCOME,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Get total expense for the month
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.EXPENSE,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Get transaction count
    const transactionCount = await prisma.transaction.count({
      where: {
        date: { gte: startDate, lte: endDate },
      },
    });

    // Get unique donor count (from transactions with donor field)
    const donorCount = await prisma.transaction.groupBy({
      by: ['donor'],
      where: {
        type: TransactionType.INCOME,
        date: { gte: startDate, lte: endDate },
        donor: { not: null },
      },
    });

    // Calculate previous month for comparison
    const prevStartDate = new Date(year, month - 2, 1);
    const prevEndDate = new Date(year, month - 1, 0, 23, 59, 59);

    const prevIncomeResult = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.INCOME,
        date: { gte: prevStartDate, lte: prevEndDate },
      },
      _sum: { amount: true },
    });

    const prevExpenseResult = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.EXPENSE,
        date: { gte: prevStartDate, lte: prevEndDate },
      },
      _sum: { amount: true },
    });

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpense = Number(expenseResult._sum.amount || 0);
    const prevIncome = Number(prevIncomeResult._sum.amount || 0);
    const prevExpense = Number(prevExpenseResult._sum.amount || 0);

    // Calculate percentage changes
    const incomeChange = prevIncome > 0 
      ? ((totalIncome - prevIncome) / prevIncome * 100).toFixed(1)
      : '0';
    const expenseChange = prevExpense > 0 
      ? ((totalExpense - prevExpense) / prevExpense * 100).toFixed(1)
      : '0';

    return successResponse({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
      donorCount: donorCount.length,
      incomeChange: parseFloat(incomeChange),
      expenseChange: parseFloat(expenseChange),
      period: {
        month,
        year,
        label: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return errorResponse('Failed to fetch dashboard statistics', 500);
  }
}
