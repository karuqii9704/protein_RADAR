import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, NewsCategory } from '@prisma/client';

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN, Role.VIEWER]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    // Get counts in parallel
    const [
      totalTransactions,
      totalNews,
      totalArticles,
      totalPrograms,
      recentTransactions,
    ] = await Promise.all([
      prisma.transaction.count(),
      prisma.news.count({
        where: { category: { not: NewsCategory.ARTIKEL } },
      }),
      prisma.news.count({
        where: { category: NewsCategory.ARTIKEL },
      }),
      prisma.program.count(),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          createdBy: { select: { name: true } },
        },
      }),
    ]);

    // Format recent activities from transactions
    const recentActivities = recentTransactions.map((tx) => ({
      id: tx.id,
      action: `${tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}: ${tx.description}`,
      user: tx.createdBy.name,
      time: formatRelativeTime(tx.createdAt),
      type: tx.type === 'INCOME' ? 'income' : 'expense',
      amount: Number(tx.amount),
    }));

    return successResponse({
      totalTransactions,
      totalNews,
      totalArticles,
      totalPrograms,
      recentActivities,
    });
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return errorResponse('Failed to fetch admin stats', 500);
  }
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
