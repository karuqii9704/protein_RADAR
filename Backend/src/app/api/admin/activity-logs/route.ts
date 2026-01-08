import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/activity-logs - Get activity logs (read-only, SUPER_ADMIN only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);
    
    // Filters
    const entity = searchParams.get('entity');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    // Build where clause
    const where: {
      entity?: string;
      action?: string;
      userId?: string;
    } = {};

    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    // Format logs with full timestamp
    const formattedLogs = logs.map((log) => {
      const date = new Date(log.createdAt);
      const formattedDate = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      return {
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        entityTitle: log.entityTitle,
        userId: log.userId,
        userName: log.userName,
        userRole: log.userRole,
        userDisplay: log.userRole === 'SUPER_ADMIN' 
          ? `Super Admin (${log.userName})` 
          : `Admin (${log.userName})`,
        details: log.details ? JSON.parse(log.details) : null,
        ipAddress: log.ipAddress,
        timestamp: `${formattedDate} ${formattedTime}`,
        createdAt: log.createdAt.toISOString(),
      };
    });

    return paginatedResponse(formattedLogs, total, page, limit);
  } catch (error) {
    console.error('Activity logs fetch error:', error);
    return errorResponse('Failed to fetch activity logs', 500);
  }
}
