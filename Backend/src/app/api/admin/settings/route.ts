import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings - Get all settings or specific key
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (key) {
      // Get specific setting
      const setting = await prisma.setting.findUnique({
        where: { key },
      });
      return successResponse(setting);
    }

    // Get all settings
    const settings = await prisma.setting.findMany();
    
    // Convert to key-value object for easier consumption
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    return successResponse(settingsMap);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return errorResponse('Failed to fetch settings', 500);
  }
}

// PUT /api/admin/settings - Update setting(s)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN, Role.ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const body = await request.json();
    const { key, value, settings } = body;

    // Single setting update
    if (key && value !== undefined) {
      const setting = await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      return successResponse(setting, 'Setting updated successfully');
    }

    // Multiple settings update
    if (settings && typeof settings === 'object') {
      const updates = Object.entries(settings).map(([k, v]) =>
        prisma.setting.upsert({
          where: { key: k },
          update: { value: String(v) },
          create: { key: k, value: String(v) },
        })
      );
      await Promise.all(updates);
      return successResponse(null, 'Settings updated successfully');
    }

    return errorResponse('Invalid request body', 400);
  } catch (error) {
    console.error('Settings update error:', error);
    return errorResponse('Failed to update settings', 500);
  }
}
