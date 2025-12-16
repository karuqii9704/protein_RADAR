import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, NewsCategory } from '@prisma/client';

// GET /api/admin/news/[id] - Get news detail
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

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!news) {
      return errorResponse('News not found', 404);
    }

    return successResponse({
      id: news.id,
      title: news.title,
      slug: news.slug,
      content: news.content,
      excerpt: news.excerpt,
      image: news.image,
      category: news.category,
      isPublished: news.isPublished,
      publishedAt: news.publishedAt?.toISOString() || null,
      viewCount: news.viewCount,
      author: news.author,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('News detail fetch error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}

// PUT /api/admin/news/[id] - Update news
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
    const { title, content, excerpt, image, category, isPublished } = body;

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('News not found', 404);
    }

    // Prepare update data
    const updateData: {
      title?: string;
      content?: string;
      excerpt?: string;
      image?: string | null;
      category?: NewsCategory;
      isPublished?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (image !== undefined) updateData.image = image;
    if (category && Object.values(NewsCategory).includes(category)) {
      updateData.category = category;
    }
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      // Set publishedAt if publishing for the first time
      if (isPublished && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return successResponse({
      id: news.id,
      title: news.title,
      slug: news.slug,
      isPublished: news.isPublished,
    }, 'News updated successfully');
  } catch (error) {
    console.error('Update news error:', error);
    return errorResponse('Failed to update news', 500);
  }
}

// DELETE /api/admin/news/[id] - Delete news
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

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('News not found', 404);
    }

    await prisma.news.delete({ where: { id } });

    return successResponse({ id }, 'News deleted successfully');
  } catch (error) {
    console.error('Delete news error:', error);
    return errorResponse('Failed to delete news', 500);
  }
}
