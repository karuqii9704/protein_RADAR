'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import type { Transaction } from '@/types';
import toast from 'react-hot-toast';

interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LaporanListPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 10 };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;

      const res = await apiGet<Transaction[]>('/api/admin/transactions', params);
      if (res.success && res.data) {
        setTransactions(res.data);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 1);
        // Clear selection when data changes
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return;

    try {
      const res = await apiDelete(`/api/admin/transactions/${id}`);
      if (res.success) {
        toast.success('Transaksi berhasil dihapus');
        fetchTransactions();
      } else {
        toast.error(res.error || 'Gagal menghapus transaksi');
      }
    } catch (error) {
      toast.error('Gagal menghapus transaksi');
    }
  };

  // Multi-select handlers
  const handleSelectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map(t => t.id)));
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
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} transaksi yang dipilih?`)) return;

    setIsDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        const res = await apiDelete(`/api/admin/transactions/${id}`);
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
      toast.success(`${successCount} transaksi berhasil dihapus`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} transaksi gagal dihapus`);
    }
    
    setSelectedIds(new Set());
    fetchTransactions();
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Calculate stats from current data
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-500 mt-1">Kelola semua transaksi keuangan masjid</p>
        </div>
        <Link
          href="/admin/laporan/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pemasukan</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalIncome.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalExpense.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Tipe</option>
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">{selectedIds.size} item dipilih</span>
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada transaksi</p>
              <Link href="/admin/laporan/create" className="text-green-600 font-medium hover:underline mt-2 inline-block">
                Tambah transaksi pertama
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-4 w-12">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 hover:bg-gray-200 rounded transition"
                      title={selectedIds.size === transactions.length ? "Batal pilih semua" : "Pilih semua"}
                    >
                      {selectedIds.size === transactions.length && transactions.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Deskripsi</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Kategori</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tanggal</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Jumlah</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Tipe</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className={`border-b border-gray-50 hover:bg-gray-50 transition ${
                      selectedIds.has(transaction.id) 
                        ? 'bg-green-50' 
                        : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleSelectOne(transaction.id)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        {selectedIds.has(transaction.id) ? (
                          <CheckSquare className="w-5 h-5 text-green-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'INCOME' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {transaction.type === 'INCOME' ? transaction.donor : transaction.recipient}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${transaction.category?.color}20`,
                          color: transaction.category?.color 
                        }}
                      >
                        {transaction.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{transaction.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        transaction.type === 'INCOME'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/laporan/${transaction.id}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/laporan/${transaction.id}/edit`}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {((page - 1) * 10) + 1}-{Math.min(page * 10, total)} dari {total} transaksi
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    page === i + 1
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
