import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';
import { withAuth, isAuthError } from '@/middleware/auth';
import { Role, TransactionType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET /api/admin/transactions/[id] - Get transaction detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!transaction) {
      return errorResponse('Transaction not found', 404);
    }

    return successResponse({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      donor: transaction.donor,
      recipient: transaction.recipient,
      date: transaction.date.toISOString().split('T')[0],
      receiptNumber: transaction.receiptNumber,
      notes: transaction.notes,
      category: transaction.category,
      createdBy: transaction.createdBy,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Transaction detail fetch error:', error);
    return errorResponse('Failed to fetch transaction', 500);
  }
}

// PUT /api/admin/transactions/[id] - Update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const { type, amount, description, donor, recipient, date, categoryId, receiptNumber, notes } = body;

    // Check if transaction exists
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Transaction not found', 404);
    }

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type: type || existing.type,
        amount: amount !== undefined ? amount : existing.amount,
        description: description || existing.description,
        donor: type === TransactionType.INCOME ? donor : null,
        recipient: type === TransactionType.EXPENSE ? recipient : null,
        date: date ? new Date(date) : existing.date,
        categoryId: categoryId || existing.categoryId,
        receiptNumber: receiptNumber !== undefined ? receiptNumber : existing.receiptNumber,
        notes: notes !== undefined ? notes : existing.notes,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return successResponse({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      category: transaction.category,
    }, 'Transaction updated successfully');
  } catch (error) {
    console.error('Update transaction error:', error);
    return errorResponse('Failed to update transaction', 500);
  }
}

// DELETE /api/admin/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, [Role.SUPER_ADMIN]);
    if (isAuthError(authResult)) {
      return authResult;
    }

    const { id } = await params;

    // Check if exists
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Transaction not found', 404);
    }

    // Delete transaction
    await prisma.transaction.delete({ where: { id } });

    return successResponse({ id }, 'Transaction deleted successfully');
  } catch (error) {
    console.error('Delete transaction error:', error);
    return errorResponse('Failed to delete transaction', 500);
  }
}
