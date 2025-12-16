import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { NewsCategory, Role } from '@prisma/client';

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/news - Get all news (including drafts)
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Filters
    const category = searchParams.get('category') as NewsCategory | null;
    const isPublished = searchParams.get('isPublished');
    const search = searchParams.get('search');

    // Build where clause
    const where: {
      category?: NewsCategory;
      isPublished?: boolean;
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; content?: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (category && Object.values(NewsCategory).includes(category)) {
      where.category = category;
    }
    if (isPublished !== null) {
      where.isPublished = isPublished === 'true';
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

    const formattedNews = news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      image: n.image,
      category: n.category,
      isPublished: n.isPublished,
      publishedAt: n.publishedAt?.toISOString() || null,
      viewCount: n.viewCount,
      author: n.author,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    }));

    return paginatedResponse(formattedNews, total, page, limit);
  } catch (error) {
    console.error('Admin news fetch error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}

// POST /api/admin/news - Create news
export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { title, content, excerpt, image, category, isPublished } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return errorResponse('Title, content, and category are required', 400);
    }

    if (!Object.values(NewsCategory).includes(category)) {
      return errorResponse('Invalid news category', 400);
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSlug = await prisma.news.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        image,
        category,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: authResult.user.userId,
      },
    });

    return successResponse({
      id: news.id,
      title: news.title,
      slug: news.slug,
      isPublished: news.isPublished,
    }, 'News created successfully');
  } catch (error) {
    console.error('Create news error:', error);
    return errorResponse('Failed to create news', 500);
  }
}
