import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Config for body size (10MB for base64 images)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/programs - Get all programs
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: { isActive?: boolean } = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: { select: { donations: true } },
        },
      }),
      prisma.program.count({ where }),
    ]);

    const formattedPrograms = programs.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      target: Number(p.target),
      collected: Number(p.collected),
      progress: Number(p.target) > 0 ? Math.round((Number(p.collected) / Number(p.target)) * 100) : 0,
      image: p.image,
      qris: p.qris,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      startDate: p.startDate.toISOString().split('T')[0],
      endDate: p.endDate?.toISOString().split('T')[0] || null,
      donorCount: p._count.donations,
      createdAt: p.createdAt.toISOString(),
    }));

    return paginatedResponse(formattedPrograms, total, page, limit);
  } catch (error) {
    console.error('Admin programs fetch error:', error);
    return errorResponse('Failed to fetch programs', 500);
  }
}

// POST /api/admin/programs - Create program
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/programs - Starting request');
    
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      console.log('POST /api/admin/programs - Auth failed');
      return authResult;
    }
    console.log('POST /api/admin/programs - Auth passed');

    let body;
    try {
      body = await request.json();
      console.log('POST /api/admin/programs - Body parsed, title:', body?.title);
    } catch (parseError) {
      console.error('POST /api/admin/programs - Body parse error:', parseError);
      return errorResponse('Invalid JSON body or body too large', 400);
    }
    
    const { title, description, target, image, qris, isActive, isFeatured, startDate, endDate } = body;

    if (!title || !description || !target) {
      return errorResponse('Title, description, and target are required', 400);
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSlug = await prisma.program.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        target: target, // Prisma handles number to Decimal conversion
        image: image || null,
        qris: qris || null,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return successResponse({
      id: program.id,
      title: program.title,
      slug: program.slug,
    }, 'Program created successfully');
  } catch (error) {
    console.error('Create program error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create program';
    return errorResponse(errorMessage, 500);
  }
}
