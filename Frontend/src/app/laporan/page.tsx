'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  FileText,
  Calendar
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { ReportStats, Transaction } from '@/types';

interface MonthlyReport {
  id: string;
  period: string;
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  publishedDate: string;
}

export default function LaporanPublicPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          apiGet<ReportStats>('/api/reports/stats'),
          apiGet<MonthlyReport[]>('/api/reports'),
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (reportsRes.success && reportsRes.data) setReports(reportsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Laporan Keuangan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparansi keuangan Masjid Syamsul &apos;Ulum untuk masyarakat
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pemasukan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : formatCurrency(stats?.summary?.totalIncome ?? 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stats?.period?.label ?? 'Bulan ini'}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : formatCurrency(stats?.summary?.totalExpense ?? 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stats?.period?.label ?? 'Bulan ini'}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : formatCurrency(stats?.summary?.balance ?? 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Tersedia</p>
          </div>
        </div>

        {/* Category Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Income by Category */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pemasukan per Kategori</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded-full"></div>
                    </div>
                  ))
                ) : stats.incomeByCategory?.length > 0 ? (
                  stats.incomeByCategory.map((cat) => {
                    const percentage = stats.summary.totalIncome > 0 
                      ? (cat.amount / stats.summary.totalIncome) * 100 
                      : 0;
                    return (
                      <div key={cat.categoryId}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(cat.amount)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: cat.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada data</p>
                )}
              </div>
            </div>

            {/* Expense by Category */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Pengeluaran per Kategori</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded-full"></div>
                    </div>
                  ))
                ) : stats.expenseByCategory?.length > 0 ? (
                  stats.expenseByCategory.map((cat) => {
                    const percentage = stats.summary.totalExpense > 0 
                      ? (cat.amount / stats.summary.totalExpense) * 100 
                      : 0;
                    return (
                      <div key={cat.categoryId}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(cat.amount)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: cat.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada data</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Monthly Reports */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Laporan Bulanan</h2>
          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-xl">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.period}</h3>
                      <p className="text-sm text-gray-500">Dipublikasikan: {report.publishedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Pemasukan</p>
                      <p className="font-bold text-green-600">{formatCurrency(report.income)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Pengeluaran</p>
                      <p className="font-bold text-red-600">{formatCurrency(report.expense)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Saldo</p>
                      <p className={`font-bold ${report.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {formatCurrency(report.balance)}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">Belum ada laporan bulanan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
