'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  HandHeart,
  Wallet,
  Filter
} from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string | null;
  donorPhone: string | null;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  status: 'PENDING' | 'VERIFIED' | 'CANCELLED';
  paymentMethod: string | null;
  paymentProof: string | null;
  rejectReason: string | null;
  program: {
    id: string;
    title: string;
    slug: string;
  };
  verifiedBy: {
    id: string;
    name: string;
  } | null;
  verifiedAt: string | null;
  createdAt: string;
}

interface DonationStats {
  pending: number;
  verified: number;
  cancelled: number;
  totalVerifiedAmount: number;
}

export default function AdminDonationPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  
  // Modal state
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await apiGet<Donation[]>('/api/admin/donations', params);
      if (res.success && res.data) {
        setDonations(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
        setTotal(res.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      toast.error('Gagal memuat donasi');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiGet<DonationStats>('/api/admin/donations/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [page, statusFilter]);

  const handleApprove = async () => {
    if (!selectedDonation) return;
    
    // Confirmation dialog
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin MENERIMA donasi dari ${selectedDonation.donorName} sebesar ${formatCurrency(selectedDonation.amount)}?\n\nAksi ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;
    
    setIsProcessing(true);
    try {
      const res = await apiPost(`/api/admin/donations/${selectedDonation.id}/verify`, {
        action: 'approve',
      });
      if (res.success) {
        toast.success('Donasi berhasil diterima!');
        setIsModalOpen(false);
        setSelectedDonation(null);
        fetchDonations();
        fetchStats();
      } else {
        toast.error(res.error || 'Gagal menerima donasi');
      }
    } catch (error) {
      toast.error('Gagal menerima donasi');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDonation || !rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }
    
    // Confirmation dialog
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin MENOLAK donasi dari ${selectedDonation.donorName}?\n\nAlasan: ${rejectReason.trim()}\n\nAksi ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;
    
    setIsProcessing(true);
    try {
      const res = await apiPost(`/api/admin/donations/${selectedDonation.id}/verify`, {
        action: 'reject',
        rejectReason: rejectReason.trim(),
      });
      if (res.success) {
        toast.success('Donasi berhasil ditolak');
        setIsModalOpen(false);
        setSelectedDonation(null);
        setRejectReason('');
        setShowRejectForm(false);
        fetchDonations();
        fetchStats();
      } else {
        toast.error(res.error || 'Gagal menolak donasi');
      }
    } catch (error) {
      toast.error('Gagal menolak donasi');
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonation(null);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi Donasi</h1>
          <p className="text-gray-500 mt-1">Kelola dan verifikasi donasi yang masuk</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pending ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Terverifikasi</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.verified ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.cancelled ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donasi</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(stats?.totalVerifiedAmount ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filter Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['PENDING', 'VERIFIED', 'CANCELLED', ''].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === '' ? 'Semua' : status === 'PENDING' ? 'Pending' : status === 'VERIFIED' ? 'Terverifikasi' : 'Ditolak'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donation List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20">
            <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada donasi</h3>
            <p className="text-gray-500">Donasi yang masuk akan muncul di sini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Donatur</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Program</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Nominal</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donorName}</p>
                        {donation.donorPhone && (
                          <p className="text-sm text-gray-500">{donation.donorPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/programs/${donation.program.slug}`}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        {donation.program.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(donation.amount)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(donation.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => openModal(donation)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && donations.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {donations.length} dari {total} donasi
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium">
                {page}
              </span>
              <span className="text-gray-500 text-sm">dari {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detail Donasi</h2>
                <p className="text-gray-500 text-sm mt-1">ID: {selectedDonation.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Donatur</p>
                  <p className="font-medium text-gray-900">{selectedDonation.donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedDonation.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nominal</p>
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(selectedDonation.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedDonation.createdAt)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium text-gray-900">{selectedDonation.program.title}</p>
                </div>
                {selectedDonation.donorEmail && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedDonation.donorEmail}</p>
                  </div>
                )}
                {selectedDonation.donorPhone && (
                  <div>
                    <p className="text-sm text-gray-500">No. HP</p>
                    <p className="font-medium text-gray-900">{selectedDonation.donorPhone}</p>
                  </div>
                )}
                {selectedDonation.message && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Pesan</p>
                    <p className="font-medium text-gray-900">{selectedDonation.message}</p>
                  </div>
                )}
              </div>

              {/* Payment Proof */}
              {selectedDonation.paymentProof && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Bukti Pembayaran</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedDonation.paymentProof}
                      alt="Bukti Pembayaran"
                      className="w-full max-h-80 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {/* Reject Reason (for cancelled) */}
              {selectedDonation.status === 'CANCELLED' && selectedDonation.rejectReason && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">Alasan Penolakan:</p>
                  <p className="text-red-700">{selectedDonation.rejectReason}</p>
                </div>
              )}

              {/* Verified Info */}
              {selectedDonation.status === 'VERIFIED' && selectedDonation.verifiedBy && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">Diverifikasi oleh:</p>
                  <p className="text-green-700">
                    {selectedDonation.verifiedBy.name} pada {formatDate(selectedDonation.verifiedAt!)}
                  </p>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Penolakan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Tuliskan alasan penolakan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedDonation.status === 'PENDING' && (
              <div className="flex items-center gap-3 p-6 border-t border-gray-100 bg-gray-50">
                {showRejectForm ? (
                  <>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isProcessing || !rejectReason.trim()}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      Konfirmasi Tolak
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 px-4 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Tolak
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Terima
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
