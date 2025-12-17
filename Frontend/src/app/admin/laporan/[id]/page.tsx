'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Share2,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2
} from 'lucide-react';
import { apiGet } from '@/lib/api';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  donor?: string;
  recipient?: string;
  date: string;
  category: { id: string; name: string };
  createdBy: { id: string; name: string };
}

interface PaginatedResponse {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LaporanDetailPage({ params }: { params: { id: string } }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  // Parse the ID (format: YYYY-MM)
  const [year, month] = params.id.split('-').map(Number);
  const periodDate = new Date(year, month - 1);
  const periodLabel = periodDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await apiGet<PaginatedResponse>('/api/admin/transactions', {
          month,
          year,
          limit: 100,
        });

        if (res.success && res.data) {
          setTransactions(res.data.data);

          // Calculate summary
          let income = 0;
          let expense = 0;
          res.data.data.forEach((tx) => {
            if (tx.type === 'INCOME') {
              income += tx.amount;
            } else {
              expense += tx.amount;
            }
          });
          setSummary({ income, expense, balance: income - expense });
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchTransactions();
    }
  }, [year, month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/laporan"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan {periodLabel}</h1>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Published
              </span>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {periodLabel}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Download">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/admin/laporan/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-green-100 font-medium">Total Pemasukan</span>
          </div>
          <p className="text-3xl font-bold">Rp {summary.income.toLocaleString('id-ID')}</p>
          <p className="text-green-100 text-sm mt-2">
            {transactions.filter(t => t.type === 'INCOME').length} transaksi
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-red-100 font-medium">Total Pengeluaran</span>
          </div>
          <p className="text-3xl font-bold">Rp {summary.expense.toLocaleString('id-ID')}</p>
          <p className="text-red-100 text-sm mt-2">
            {transactions.filter(t => t.type === 'EXPENSE').length} transaksi
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-blue-100 font-medium">Saldo Akhir</span>
          </div>
          <p className="text-3xl font-bold">Rp {summary.balance.toLocaleString('id-ID')}</p>
          <p className="text-blue-100 text-sm mt-2">
            {summary.balance >= 0 ? 'Surplus' : 'Defisit'} bulan ini
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Daftar Transaksi</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada transaksi untuk periode ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Deskripsi</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Kategori</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Tanggal</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {tx.type === 'INCOME' ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{tx.description}</span>
                            {tx.donor && (
                              <p className="text-xs text-gray-500">Dari: {tx.donor}</p>
                            )}
                            {tx.recipient && (
                              <p className="text-xs text-gray-500">Kepada: {tx.recipient}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(tx.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'INCOME' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Laporan keuangan bulanan Masjid Syamsul &apos;Ulum untuk periode {periodLabel}. 
              Mencakup semua pemasukan dari infaq, zakat, dan donasi serta pengeluaran operasional masjid.
            </p>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Periode</p>
                  <p className="text-sm font-medium text-gray-900">{periodLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Transaksi</p>
                  <p className="text-sm font-medium text-gray-900">{transactions.length} transaksi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
