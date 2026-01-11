import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, TransactionType } from '@prisma/client';
import { logActivity } from '@/lib/activityLog';

export const dynamic = 'force-dynamic';

// POST /api/admin/donations/[id]/verify - Verify (approve/reject) a donation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const body = await request.json();
    const { action, rejectReason } = body;

    // Validate action
    if (!action || !['approve', 'reject'].includes(action)) {
      return errorResponse('Action harus "approve" atau "reject"', 400);
    }

    const currentUser = authResult.user;

    // Get donation with program info
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!donation) {
      return errorResponse('Donasi tidak ditemukan', 404);
    }

    if (donation.status !== 'PENDING') {
      return errorResponse('Donasi sudah diverifikasi sebelumnya', 400);
    }

    const donorDisplay = donation.isAnonymous ? 'Hamba Allah' : donation.donorName;

    if (action === 'approve') {
      // Find or create "Donasi Program" category for transactions
      let donationCategory = await prisma.category.findFirst({
        where: { 
          name: 'Donasi Program',
          type: TransactionType.INCOME,
        },
      });

      if (!donationCategory) {
        donationCategory = await prisma.category.create({
          data: {
            name: 'Donasi Program',
            type: TransactionType.INCOME,
            description: 'Donasi dari program masjid',
            color: '#10B981',
            icon: 'heart',
            isActive: true,
          },
        });
      }

      // Use transaction to ensure data consistency
      await prisma.$transaction(async (tx) => {
        // 1. Update donation status to VERIFIED
        await tx.donation.update({
          where: { id },
          data: {
            status: 'VERIFIED',
            verifiedById: currentUser.userId,
            verifiedAt: new Date(),
          },
        });

        // 2. Update program collected amount
        await tx.program.update({
          where: { id: donation.programId },
          data: {
            collected: {
              increment: donation.amount,
            },
          },
        });

        // 3. Create transaction for financial report
        await tx.transaction.create({
          data: {
            type: TransactionType.INCOME,
            amount: donation.amount,
            description: `Donasi untuk program: ${donation.program.title}`,
            donor: donorDisplay,
            date: new Date(),
            receiptNumber: `DON-${donation.id.slice(-8).toUpperCase()}`,
            notes: donation.message || undefined,
            categoryId: donationCategory!.id,
            createdById: currentUser.userId,
          },
        });
      });

      // Log activity for approve
      logActivity({
        action: 'APPROVE',
        entity: 'Donation',
        entityId: donation.id,
        entityTitle: `Donasi ${donorDisplay} - Rp ${Number(donation.amount).toLocaleString('id-ID')}`,
        userId: currentUser.userId,
        userName: currentUser.name,
        userRole: currentUser.role,
        details: {
          program: donation.program.title,
          amount: Number(donation.amount),
          donor: donorDisplay,
        },
        request,
      });

      return successResponse({
        id,
        status: 'VERIFIED',
        message: 'Donasi berhasil diverifikasi dan tercatat di laporan keuangan',
      }, 'Donasi berhasil diverifikasi');
    } else {
      // Reject donation
      if (!rejectReason) {
        return errorResponse('Alasan penolakan wajib diisi', 400);
      }

      await prisma.donation.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          rejectReason,
          verifiedById: currentUser.userId,
          verifiedAt: new Date(),
        },
      });

      // Log activity for reject
      logActivity({
        action: 'REJECT',
        entity: 'Donation',
        entityId: donation.id,
        entityTitle: `Donasi ${donorDisplay} - Rp ${Number(donation.amount).toLocaleString('id-ID')}`,
        userId: currentUser.userId,
        userName: currentUser.name,
        userRole: currentUser.role,
        details: {
          program: donation.program.title,
          amount: Number(donation.amount),
          donor: donorDisplay,
          reason: rejectReason,
        },
        request,
      });

      return successResponse({
        id,
        status: 'CANCELLED',
        message: 'Donasi telah ditolak',
      }, 'Donasi berhasil ditolak');
    }
  } catch (error) {
    console.error('Donation verification error:', error);
    return errorResponse('Gagal memverifikasi donasi', 500);
  }
}
