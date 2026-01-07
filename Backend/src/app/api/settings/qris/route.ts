import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// GET /api/settings/qris - Get default QRIS image (public)
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'default_qris' },
    });

    return successResponse({
      qris: setting?.value || null,
    });
  } catch (error) {
    console.error('QRIS fetch error:', error);
    return errorResponse('Failed to fetch QRIS', 500);
  }
}
