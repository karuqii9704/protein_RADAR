import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { NewsCategory, Role } from '@prisma/client';
import { logActivity } from '@/lib/activityLog';

export const dynamic = 'force-dynamic';

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/artikel - Get all articles
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    const isPublished = searchParams.get('isPublished');
    const search = searchParams.get('search');

    // Build where clause - only ARTIKEL category
    const where: {
      category: NewsCategory;
      isPublished?: boolean;
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>;
    } = {
      category: NewsCategory.ARTIKEL,
    };

    if (isPublished !== null) {
      where.isPublished = isPublished === 'true';
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
      isPublished: a.isPublished,
      publishedAt: a.publishedAt?.toISOString() || null,
      viewCount: a.viewCount,
      author: a.author,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return paginatedResponse(formattedArticles, total, page, limit);
  } catch (error) {
    console.error('Admin artikel fetch error:', error);
    return errorResponse('Failed to fetch articles', 500);
  }
}

// POST /api/admin/artikel - Create article
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { title, content, excerpt, image, isPublished } = body;

    if (!title || !content) {
      return errorResponse('Title and content are required', 400);
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSlug = await prisma.news.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const article = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        image,
        category: NewsCategory.ARTIKEL,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: authResult.user.userId,
      },
    });

    // Log activity
    logActivity({
      action: 'CREATE',
      entity: 'News',
      entityId: article.id,
      entityTitle: article.title,
      userId: authResult.user.userId,
      userName: authResult.user.name,
      userRole: authResult.user.role,
      details: { category: 'ARTIKEL' },
      request,
    });

    return successResponse({
      id: article.id,
      title: article.title,
      slug: article.slug,
      isPublished: article.isPublished,
    }, 'Article created successfully');
  } catch (error) {
    console.error('Create artikel error:', error);
    return errorResponse('Failed to create article', 500);
  }
}
