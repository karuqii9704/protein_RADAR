import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { NewsCategory } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Berita categories
const BERITA_CATEGORIES = [NewsCategory.KEGIATAN, NewsCategory.PENGUMUMAN, NewsCategory.LAPORAN];

// GET /api/berita/[slug] - Get single published news by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const news = await prisma.news.findFirst({
      where: {
        slug,
        category: { in: BERITA_CATEGORIES },
        isPublished: true,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!news) {
      return errorResponse('News not found', 404);
    }

    // Increment view count
    await prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    });

    return successResponse({
      id: news.id,
      title: news.title,
      slug: news.slug,
      content: news.content,
      excerpt: news.excerpt,
      image: news.image,
      category: news.category,
      publishedAt: news.publishedAt?.toISOString() || null,
      viewCount: news.viewCount + 1,
      author: news.author,
    });
  } catch (error) {
    console.error('Public berita detail error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}
