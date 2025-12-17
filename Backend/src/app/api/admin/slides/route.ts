import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/slides - Get all slides
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    const [slides, total] = await Promise.all([
      prisma.slide.findMany({
        orderBy: { order: 'asc' },
        skip,
        take: limit,
      }),
      prisma.slide.count(),
    ]);

    const formattedSlides = slides.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      image: s.image,
      linkType: s.linkType,
      linkId: s.linkId,
      linkUrl: s.linkUrl,
      order: s.order,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return paginatedResponse(formattedSlides, total, page, limit);
  } catch (error) {
    console.error('Admin slides fetch error:', error);
    return errorResponse('Failed to fetch slides', 500);
  }
}

// POST /api/admin/slides - Create slide
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { title, description, image, linkType, linkId, linkUrl, order, isActive } = body;

    if (!title) {
      return errorResponse('Title is required', 400);
    }

    // Get highest order if not specified
    let slideOrder = order;
    if (slideOrder === undefined) {
      const lastSlide = await prisma.slide.findFirst({
        orderBy: { order: 'desc' },
      });
      slideOrder = (lastSlide?.order ?? 0) + 1;
    }

    const slide = await prisma.slide.create({
      data: {
        title,
        description,
        image,
        linkType,
        linkId,
        linkUrl,
        order: slideOrder,
        isActive: isActive ?? true,
      },
    });

    return successResponse({
      id: slide.id,
      title: slide.title,
      order: slide.order,
    }, 'Slide created successfully');
  } catch (error) {
    console.error('Create slide error:', error);
    return errorResponse('Failed to create slide', 500);
  }
}
