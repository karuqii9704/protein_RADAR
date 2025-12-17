import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/slides - Get active slides (public)
export async function GET(request: NextRequest) {
  try {
    const slides = await prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    const formattedSlides = slides.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      linkType: s.linkType,
      linkId: s.linkId,
      linkUrl: s.linkUrl,
      order: s.order,
    }));

    return successResponse(formattedSlides);
  } catch (error) {
    console.error('Public slides fetch error:', error);
    return errorResponse('Failed to fetch slides', 500);
  }
}
