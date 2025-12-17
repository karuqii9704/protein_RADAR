import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/news - Get published news
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Optional filters
    const category = searchParams.get('category') as NewsCategory | null;

    // Build where clause - only get published news
    const where: {
      isPublished: boolean;
      category?: NewsCategory;
    } = {
      isPublished: true,
    };

    if (category && Object.values(NewsCategory).includes(category)) {
      where.category = category;
    }

    // Get news
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          category: true,
          publishedAt: true,
          viewCount: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    // Format news for frontend
    const formattedNews = news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      image: n.image,
      category: n.category,
      publishedAt: n.publishedAt?.toISOString().split('T')[0] || null,
      viewCount: n.viewCount,
      author: n.author.name,
    }));

    return paginatedResponse(formattedNews, total, page, limit);
  } catch (error) {
    console.error('News fetch error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}
