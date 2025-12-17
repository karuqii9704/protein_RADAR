import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/artikel - Get published articles (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const search = searchParams.get('search');

    // Build where clause - only published ARTIKEL
    const where: {
      category: NewsCategory;
      isPublished: boolean;
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>;
    } = {
      category: NewsCategory.ARTIKEL,
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    const formattedArticles = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      image: a.image,
      category: a.category,
      publishedAt: a.publishedAt?.toISOString() || null,
      viewCount: a.viewCount,
      author: a.author,
    }));

    return paginatedResponse(formattedArticles, total, page, limit);
  } catch (error) {
    console.error('Public artikel fetch error:', error);
    return errorResponse('Failed to fetch articles', 500);
  }
}
