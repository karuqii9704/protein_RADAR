import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/programs - Get active donation programs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Optional filters
    const featured = searchParams.get('featured') === 'true';

    // Build where clause - only get active programs
    const where: {
      isActive: boolean;
      isFeatured?: boolean;
    } = {
      isActive: true,
    };

    if (featured) {
      where.isFeatured = true;
    }

    // Get programs with donation count
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
        include: {
          _count: {
            select: { 
              donations: {
                where: { status: 'VERIFIED' }
              }
            },
          },
        },
      }),
      prisma.program.count({ where }),
    ]);

    // Format programs for frontend
    const formattedPrograms = programs.map((p) => {
      const collected = Number(p.collected);
      const target = Number(p.target);
      const progress = target > 0 ? Math.round((collected / target) * 100) : 0;
      
      // Calculate days left
      const daysLeft = p.endDate 
        ? Math.max(0, Math.ceil((p.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        image: p.image,
        qris: p.qris,
        collected,
        target,
        progress,
        daysLeft,
        donors: p._count.donations,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        startDate: p.startDate.toISOString().split('T')[0],
        endDate: p.endDate?.toISOString().split('T')[0] || null,
      };
    });

    return paginatedResponse(formattedPrograms, total, page, limit);
  } catch (error) {
    console.error('Programs fetch error:', error);
    return errorResponse('Failed to fetch programs', 500);
  }
}
