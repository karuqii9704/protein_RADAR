import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/programs/[id] - Get program detail
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

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: { select: { donations: true } },
        donations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            donorName: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!program) {
      return errorResponse('Program not found', 404);
    }

    return successResponse({
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description,
      target: Number(program.target),
      collected: Number(program.collected),
      image: program.image,
      isActive: program.isActive,
      isFeatured: program.isFeatured,
      startDate: program.startDate.toISOString().split('T')[0],
      endDate: program.endDate?.toISOString().split('T')[0] || null,
      donorCount: program._count.donations,
      recentDonations: program.donations.map((d) => ({
        id: d.id,
        donorName: d.donorName,
        amount: Number(d.amount),
        status: d.status,
        createdAt: d.createdAt.toISOString(),
      })),
      createdAt: program.createdAt.toISOString(),
      updatedAt: program.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Program detail fetch error:', error);
    return errorResponse('Failed to fetch program', 500);
  }
}

// PUT /api/admin/programs/[id] - Update program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, target, collected, image, isActive, isFeatured, startDate, endDate } = body;

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Program not found', 404);
    }

    const updateData: {
      title?: string;
      description?: string;
      target?: number;
      collected?: number;
      image?: string | null;
      isActive?: boolean;
      isFeatured?: boolean;
      startDate?: Date;
      endDate?: Date | null;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (target !== undefined) updateData.target = target;
    if (collected !== undefined) updateData.collected = collected;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
    });

    return successResponse({
      id: program.id,
      title: program.title,
      slug: program.slug,
    }, 'Program updated successfully');
  } catch (error) {
    console.error('Update program error:', error);
    return errorResponse('Failed to update program', 500);
  }
}

// DELETE /api/admin/programs/[id] - Delete program
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

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Program not found', 404);
    }

    // Delete related donations first
    await prisma.donation.deleteMany({ where: { programId: id } });
    await prisma.program.delete({ where: { id } });

    return successResponse({ id }, 'Program deleted successfully');
  } catch (error) {
    console.error('Delete program error:', error);
    return errorResponse('Failed to delete program', 500);
  }
}
