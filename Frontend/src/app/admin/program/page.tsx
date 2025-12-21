'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  HandHeart,
  Calendar,
  Target,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  target: number;
  collected: number;
  progress: number;
  isActive: boolean;
  isFeatured: boolean;
  donorCount: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

interface PaginatedResponse {
  data: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProgramListPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 10,
      };

      const res = await apiGet<Program[]>('/api/admin/programs', params);
      if (res.success && res.data) {
        setPrograms(res.data);
        setTotalPages(res.meta?.totalPages ?? 1);
        setTotal(res.meta?.total ?? 0);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      toast.error('Gagal memuat program');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchPrograms();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus program ini?')) return;

    try {
      const res = await apiDelete(`/api/admin/programs/${id}`);
      if (res.success) {
        toast.success('Program berhasil dihapus');
        fetchPrograms();
      } else {
        toast.error(res.error || 'Gagal menghapus program');
      }
    } catch (error) {
      toast.error('Gagal menghapus program');
    }
  };

  // Multi-select handlers
  const handleSelectAll = () => {
    if (selectedIds.size === programs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(programs.map(p => p.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} program yang dipilih?`)) return;

    setIsDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        const res = await apiDelete(`/api/admin/programs/${id}`);
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setIsDeleting(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} program berhasil dihapus`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} program gagal dihapus`);
    }
    
    setSelectedIds(new Set());
    fetchPrograms();
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Donasi</h1>
          <p className="text-gray-500 mt-1">Kelola program donasi masjid</p>
        </div>
        <Link
          href="/admin/program/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Program
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <HandHeart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Program</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : programs.filter((p) => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : programs.filter((p) => !p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Donatur</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : programs.reduce((sum, p) => sum + p.donorCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <Search className="w-5 h-5" />
            Cari
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">{selectedIds.size} program dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Menghapus...' : 'Hapus Terpilih'}
            </button>
          </div>
        </div>
      )}

      {/* Select All Row */}
      {programs.length > 0 && !loading && (
        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
          >
            {selectedIds.size === programs.length ? (
              <CheckSquare className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {selectedIds.size === programs.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </span>
          </button>
          {selectedIds.size > 0 && (
            <span className="text-sm text-gray-500">
              ({selectedIds.size} dari {programs.length} dipilih)
            </span>
          )}
        </div>
      )}

      {/* Program List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20">
            <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada program</h3>
            <p className="text-gray-500 mb-4">Mulai buat program donasi pertama</p>
            <Link
              href="/admin/program/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              Tambah Program
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {programs.map((program) => (
              <div
                key={program.id}
                className={`p-5 hover:bg-gray-50 transition ${
                  selectedIds.has(program.id) ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleSelectOne(program.id)}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-lg transition"
                  >
                    {selectedIds.has(program.id) ? (
                      <CheckSquare className="w-6 h-6 text-green-600" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <HandHeart className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {program.isFeatured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-lg bg-yellow-100 text-yellow-700">
                          ⭐ Unggulan
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        program.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {program.isActive ? 'Aktif' : 'Selesai'}
                      </span>
                      <span className="text-xs text-gray-500">• {program.donorCount} donatur</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-green-600 transition">
                      <Link href={`/admin/program/${program.id}`}>{program.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1 mb-2">{program.description}</p>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Terkumpul</span>
                          <span className="font-medium text-green-600">{program.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(100, program.progress)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">{formatCurrency(program.collected)}</span>
                        <span className="text-gray-400"> / {formatCurrency(program.target)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/program/${program.id}/edit`}
                      className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && programs.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {programs.length} dari {total} program
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
    </div>
  );
}
