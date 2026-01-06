import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/donations/stats - Get donation statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const [pendingCount, verifiedCount, cancelledCount, totalVerifiedAmount] = await Promise.all([
      prisma.donation.count({ where: { status: 'PENDING' } }),
      prisma.donation.count({ where: { status: 'VERIFIED' } }),
      prisma.donation.count({ where: { status: 'CANCELLED' } }),
      prisma.donation.aggregate({
        where: { status: 'VERIFIED' },
        _sum: { amount: true },
      }),
    ]);

    return successResponse({
      pending: pendingCount,
      verified: verifiedCount,
      cancelled: cancelledCount,
      totalVerifiedAmount: Number(totalVerifiedAmount._sum.amount || 0),
    });
  } catch (error) {
    console.error('Donation stats error:', error);
    return errorResponse('Failed to fetch donation stats', 500);
  }
}
