import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

// GET /api/programs/[id] - Get program detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: {
          select: { donations: true },
        },
        donations: {
          where: { status: 'VERIFIED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            donorName: true,
            amount: true,
            message: true,
            isAnonymous: true,
            createdAt: true,
          },
        },
      },
    });

    if (!program) {
      return errorResponse('Program not found', 404);
    }

    const collected = Number(program.collected);
    const target = Number(program.target);
    const progress = target > 0 ? Math.round((collected / target) * 100) : 0;
    
    const daysLeft = program.endDate 
      ? Math.max(0, Math.ceil((program.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

    // Format recent donations (hide name if anonymous)
    const recentDonations = program.donations.map((d) => ({
      id: d.id,
      donorName: d.isAnonymous ? 'Hamba Allah' : d.donorName,
      amount: Number(d.amount),
      message: d.message,
      createdAt: d.createdAt.toISOString(),
    }));

    return successResponse({
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description,
      image: program.image,
      collected,
      target,
      progress,
      daysLeft,
      donors: program._count.donations,
      isFeatured: program.isFeatured,
      isActive: program.isActive,
      startDate: program.startDate.toISOString().split('T')[0],
      endDate: program.endDate?.toISOString().split('T')[0] || null,
      recentDonations,
    });
  } catch (error) {
    console.error('Program detail fetch error:', error);
    return errorResponse('Failed to fetch program details', 500);
  }
}
