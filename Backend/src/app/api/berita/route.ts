import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Berita categories (excludes ARTIKEL)
const BERITA_CATEGORIES = [NewsCategory.KEGIATAN, NewsCategory.PENGUMUMAN, NewsCategory.LAPORAN];

// GET /api/berita - Get published news (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    const category = searchParams.get('category') as NewsCategory | null;
    const search = searchParams.get('search');

    // Build where clause - only published berita categories
    const where: {
      category?: NewsCategory | { in: NewsCategory[] };
      isPublished: boolean;
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>;
    } = {
      isPublished: true,
    };

    if (category && (BERITA_CATEGORIES as NewsCategory[]).includes(category)) {
      where.category = category;
    } else {
      where.category = { in: BERITA_CATEGORIES };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [news, total] = await Promise.all([
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

    const formattedNews = news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      image: n.image,
      category: n.category,
      publishedAt: n.publishedAt?.toISOString() || null,
      viewCount: n.viewCount,
      author: n.author,
    }));

    return paginatedResponse(formattedNews, total, page, limit);
  } catch (error) {
    console.error('Public berita fetch error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}
