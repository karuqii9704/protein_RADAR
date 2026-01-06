import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/donations/[id] - Get donation detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;
    
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        program: {
          select: {
            id: true,
            title: true,
            slug: true,
            target: true,
            collected: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!donation) {
      return errorResponse('Donasi tidak ditemukan', 404);
    }

    return successResponse({
      id: donation.id,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      amount: Number(donation.amount),
      message: donation.message,
      isAnonymous: donation.isAnonymous,
      status: donation.status,
      paymentMethod: donation.paymentMethod,
      paymentProof: donation.paymentProof,
      rejectReason: donation.rejectReason,
      program: {
        ...donation.program,
        target: Number(donation.program.target),
        collected: Number(donation.program.collected),
      },
      verifiedBy: donation.verifiedBy,
      verifiedAt: donation.verifiedAt?.toISOString() || null,
      createdAt: donation.createdAt.toISOString(),
      updatedAt: donation.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Admin donation detail error:', error);
    return errorResponse('Failed to fetch donation', 500);
  }
}

// DELETE /api/admin/donations/[id] - Delete donation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;
    
    const donation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!donation) {
      return errorResponse('Donasi tidak ditemukan', 404);
    }

    await prisma.donation.delete({
      where: { id },
    });

    return successResponse({ id }, 'Donasi berhasil dihapus');
  } catch (error) {
    console.error('Admin donation delete error:', error);
    return errorResponse('Failed to delete donation', 500);
  }
}
