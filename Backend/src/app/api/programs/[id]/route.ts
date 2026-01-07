import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/programs/[id] - Get program detail by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const program = await prisma.program.findFirst({
      where: isUUID ? { id } : { slug: id },
      include: {
        _count: {
          select: { 
            donations: {
              where: { status: 'VERIFIED' }
            }
          },
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
      qris: program.qris,
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
