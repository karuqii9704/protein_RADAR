import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/slides/[id] - Get slide detail
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

    const slide = await prisma.slide.findUnique({
      where: { id },
    });

    if (!slide) {
      return errorResponse('Slide not found', 404);
    }

    return successResponse({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image: slide.image,
      linkType: slide.linkType,
      linkId: slide.linkId,
      linkUrl: slide.linkUrl,
      order: slide.order,
      isActive: slide.isActive,
      createdAt: slide.createdAt.toISOString(),
      updatedAt: slide.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Slide detail fetch error:', error);
    return errorResponse('Failed to fetch slide', 500);
  }
}

// PUT /api/admin/slides/[id] - Update slide
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
    const { title, description, image, linkType, linkId, linkUrl, order, isActive } = body;

    const existing = await prisma.slide.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Slide not found', 404);
    }

    const updateData: {
      title?: string;
      description?: string | null;
      image?: string | null;
      linkType?: string | null;
      linkId?: string | null;
      linkUrl?: string | null;
      order?: number;
      isActive?: boolean;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (linkType !== undefined) updateData.linkType = linkType;
    if (linkId !== undefined) updateData.linkId = linkId;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const slide = await prisma.slide.update({
      where: { id },
      data: updateData,
    });

    return successResponse({
      id: slide.id,
      title: slide.title,
      order: slide.order,
    }, 'Slide updated successfully');
  } catch (error) {
    console.error('Update slide error:', error);
    return errorResponse('Failed to update slide', 500);
  }
}

// DELETE /api/admin/slides/[id] - Delete slide
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

    const existing = await prisma.slide.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Slide not found', 404);
    }

    await prisma.slide.delete({ where: { id } });

    return successResponse({ id }, 'Slide deleted successfully');
  } catch (error) {
    console.error('Delete slide error:', error);
    return errorResponse('Failed to delete slide', 500);
  }
}
