import { prisma } from './prisma';
import { NextRequest } from 'next/server';

interface LogActivityParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entityId?: string;
  entityTitle?: string;
  userId: string;
  userName: string;
  userRole: string;
  details?: Record<string, unknown>;
  request?: NextRequest;
}

/**
 * Log admin activity for audit trail
 * This function is async but doesn't need to be awaited - fire and forget
 */
export async function logActivity({
  action,
  entity,
  entityId,
  entityTitle,
  userId,
  userName,
  userRole,
  details,
  request,
}: LogActivityParams): Promise<void> {
  try {
    // Get IP address from request if available
    let ipAddress: string | undefined;
    if (request) {
      ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] 
        || request.headers.get('x-real-ip') 
        || undefined;
    }

    await prisma.activityLog.create({
      data: {
        action,
        entity,
        entityId,
        entityTitle,
        userId,
        userName,
        userRole,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
      },
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the main operation
    console.error('Failed to log activity:', error);
  }
}

/**
 * Format user display name for activity logs
 * Returns: "Super Admin (username)" or "Admin (username)"
 */
export function formatUserDisplayName(role: string, name: string): string {
  const roleName = role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';
  return `${roleName} (${name})`;
}
