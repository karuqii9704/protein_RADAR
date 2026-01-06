import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, DonationStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/donations - Get all donations with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Optional filters
    const status = searchParams.get('status') as DonationStatus | null;
    const programId = searchParams.get('programId');

    // Build where clause
    const where: {
      status?: DonationStatus;
      programId?: string;
    } = {};

    if (status && Object.values(DonationStatus).includes(status)) {
      where.status = status;
    }
    if (programId) {
      where.programId = programId;
    }

    // Get donations with program info
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          program: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          verifiedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.donation.count({ where }),
    ]);

    // Get pending count for badge
    const pendingCount = await prisma.donation.count({
      where: { status: 'PENDING' },
    });

    // Format donations for frontend
    const formattedDonations = donations.map((d) => ({
      id: d.id,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      donorPhone: d.donorPhone,
      amount: Number(d.amount),
      message: d.message,
      isAnonymous: d.isAnonymous,
      status: d.status,
      paymentMethod: d.paymentMethod,
      paymentProof: d.paymentProof,
      rejectReason: d.rejectReason,
      program: d.program,
      verifiedBy: d.verifiedBy,
      verifiedAt: d.verifiedAt?.toISOString() || null,
      createdAt: d.createdAt.toISOString(),
    }));

    return paginatedResponse(formattedDonations, total, page, limit, undefined);
  } catch (error) {
    console.error('Admin donations fetch error:', error);
    return errorResponse('Failed to fetch donations', 500);
  }
}
