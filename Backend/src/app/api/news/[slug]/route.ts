import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/news/[slug] - Get news detail by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!news || !news.isPublished) {
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
      attachment: news.attachment,
      attachmentName: news.attachmentName,
      category: news.category,
      publishedAt: news.publishedAt?.toISOString() || null,
      viewCount: news.viewCount + 1,
      author: {
        id: news.author.id,
        name: news.author.name,
        avatar: news.author.avatar,
      },
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('News detail fetch error:', error);
    return errorResponse('Failed to fetch news details', 500);
  }
}
