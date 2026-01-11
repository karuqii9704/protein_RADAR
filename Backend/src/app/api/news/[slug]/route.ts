import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/news/[slug] - Get news detail by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Handle params - can be Promise in some Next.js versions
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    
    console.log('Fetching news with slug:', slug);

    if (!slug) {
      return errorResponse('Slug is required', 400);
    }

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

    console.log('News found:', news ? 'yes' : 'no', 'isPublished:', news?.isPublished);

    if (!news) {
      return errorResponse('News not found', 404);
    }

    if (!news.isPublished) {
      return errorResponse('News not published', 404);
    }

    // Increment view count (don't await, fire and forget)
    prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    }).catch(err => console.error('Failed to increment view count:', err));

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return errorResponse(`Failed to fetch news details: ${errorMessage}`, 500);
  }
}
