import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/artikel/[id] - Get article detail
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

    const article = await prisma.news.findFirst({
      where: { id, category: NewsCategory.ARTIKEL },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!article) {
      return errorResponse('Article not found', 404);
    }

    return successResponse({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      image: article.image,
      category: article.category,
      isPublished: article.isPublished,
      publishedAt: article.publishedAt?.toISOString() || null,
      viewCount: article.viewCount,
      author: article.author,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Article detail fetch error:', error);
    return errorResponse('Failed to fetch article', 500);
  }
}

// PUT /api/admin/artikel/[id] - Update article
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
    const { title, content, excerpt, image, isPublished } = body;

    const existing = await prisma.news.findFirst({
      where: { id, category: NewsCategory.ARTIKEL },
    });
    if (!existing) {
      return errorResponse('Article not found', 404);
    }

    const updateData: {
      title?: string;
      content?: string;
      excerpt?: string;
      image?: string | null;
      isPublished?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (image !== undefined) updateData.image = image;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const article = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return successResponse({
      id: article.id,
      title: article.title,
      slug: article.slug,
      isPublished: article.isPublished,
    }, 'Article updated successfully');
  } catch (error) {
    console.error('Update artikel error:', error);
    return errorResponse('Failed to update article', 500);
  }
}

// DELETE /api/admin/artikel/[id] - Delete article
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

    const existing = await prisma.news.findFirst({
      where: { id, category: NewsCategory.ARTIKEL },
    });
    if (!existing) {
      return errorResponse('Article not found', 404);
    }

    await prisma.news.delete({ where: { id } });

    return successResponse({ id }, 'Article deleted successfully');
  } catch (error) {
    console.error('Delete artikel error:', error);
    return errorResponse('Failed to delete article', 500);
  }
}
