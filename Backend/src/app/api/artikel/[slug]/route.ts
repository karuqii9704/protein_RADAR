import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/artikel/[slug] - Get single published article by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.news.findFirst({
      where: {
        slug,
        category: NewsCategory.ARTIKEL,
        isPublished: true,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!article) {
      return errorResponse('Article not found', 404);
    }

    // Increment view count
    await prisma.news.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    return successResponse({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      image: article.image,
      category: article.category,
      publishedAt: article.publishedAt?.toISOString() || null,
      viewCount: article.viewCount + 1,
      author: article.author,
    });
  } catch (error) {
    console.error('Public artikel detail error:', error);
    return errorResponse('Failed to fetch article', 500);
  }
}
