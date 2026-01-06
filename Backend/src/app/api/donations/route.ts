import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api-response';

export const dynamic = 'force-dynamic';

// POST /api/donations - Submit a new donation (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      programId, 
      amount, 
      donorName, 
      donorEmail, 
      donorPhone, 
      message, 
      isAnonymous, 
      paymentProof 
    } = body;

    // Validate required fields
    if (!programId) {
      return errorResponse('Program ID wajib diisi', 400);
    }
    if (!amount || amount <= 0) {
      return errorResponse('Nominal donasi wajib diisi dan harus lebih dari 0', 400);
    }
    if (!paymentProof) {
      return errorResponse('Bukti pembayaran wajib diupload', 400);
    }

    // Check if program exists and is active
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return errorResponse('Program tidak ditemukan', 404);
    }
    if (!program.isActive) {
      return errorResponse('Program sudah tidak aktif', 400);
    }

    // Determine donor name
    const finalDonorName = isAnonymous ? 'Hamba Allah' : (donorName || 'Anonim');

    // Create donation with PENDING status
    const donation = await prisma.donation.create({
      data: {
        programId,
        amount,
        donorName: finalDonorName,
        donorEmail: donorEmail || null,
        donorPhone: donorPhone || null,
        message: message || null,
        isAnonymous: isAnonymous ?? false,
        paymentProof,
        paymentMethod: 'QRIS',
        status: 'PENDING',
      },
    });

    return successResponse({
      id: donation.id,
      status: donation.status,
      message: 'Donasi berhasil disubmit. Mohon tunggu verifikasi dari admin.',
    }, 'Donasi berhasil disubmit');
  } catch (error) {
    console.error('Create donation error:', error);
    return errorResponse('Gagal membuat donasi', 500);
  }
}
