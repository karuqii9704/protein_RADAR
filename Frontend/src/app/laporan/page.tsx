'use client';

import { useEffect, useState } from 'react';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { ReportStats } from '@/types';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';

// Dynamic imports for charts to avoid SSR issues
const MonthlyComparisonChart = dynamic(
  () => import('@/components/laporan/MonthlyComparisonChart'),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse bg-gray-100 rounded-xl" /> }
);

const CategoryPieChart = dynamic(
  () => import('@/components/laporan/CategoryPieChart'),
  { ssr: false, loading: () => <div className="h-[250px] animate-pulse bg-gray-100 rounded-xl" /> }
);

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
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Available years (last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, reportsRes] = await Promise.all([
          apiGet<ReportStats>('/api/reports/stats', { month: selectedMonth, year: selectedYear }),
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
  }, [selectedMonth, selectedYear]);

  // Sort and paginate reports
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleDownloadExcel = async (report: MonthlyReport) => {
    const wb = XLSX.utils.book_new();
    
    // Fetch detailed stats
    let incomeDetails: Array<{name: string; amount: number}> = [];
    let expenseDetails: Array<{name: string; amount: number}> = [];
    
    // Fetch individual transactions for this period
    interface TransactionDetail {
      id: string;
      type: string;
      amount: number;
      description: string;
      date: string;
      donor?: string;
      recipient?: string;
      category?: { name: string };
    }
    
    let transactions: TransactionDetail[] = [];
    
    try {
      const [detailRes, transRes] = await Promise.all([
        apiGet<ReportStats>('/api/reports/stats', { 
          month: report.month, 
          year: report.year 
        }),
        apiGet<TransactionDetail[]>('/api/transactions', {
          month: report.month,
          year: report.year,
          limit: 1000 // Get all transactions for the month
        })
      ]);
      
      if (detailRes.success && detailRes.data) {
        incomeDetails = detailRes.data.incomeByCategory || [];
        expenseDetails = detailRes.data.expenseByCategory || [];
      }
      
      if (transRes.success && transRes.data) {
        transactions = transRes.data;
      }
    } catch (e) {
      console.error('Failed to fetch details:', e);
    }
    
    // Sheet 1: Summary
    const summaryData = [
      ['Laporan Keuangan Masjid Syamsul Ulum'],
      [`Periode: ${report.period}`],
      [`Tanggal Export: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
      [],
      ['RINGKASAN'],
      ['Jenis', 'Jumlah (Rp)'],
      ['Total Pemasukan', report.income],
      ['Total Pengeluaran', report.expense],
      ['Saldo', report.balance],
      [],
      ['PEMASUKAN PER KATEGORI'],
      ['Kategori', 'Jumlah (Rp)'],
      ...incomeDetails.map(c => [c.name, c.amount]),
      [],
      ['PENGELUARAN PER KATEGORI'],
      ['Kategori', 'Jumlah (Rp)'],
      ...expenseDetails.map(c => [c.name, c.amount]),
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');
    
    // Sheet 2: Detail Transaksi Pemasukan
    const incomeTransactions = transactions.filter(t => t.type === 'INCOME');
    const incomeData = [
      ['DETAIL TRANSAKSI PEMASUKAN'],
      [`Periode: ${report.period}`],
      [],
      ['No', 'Tanggal', 'Keterangan', 'Donatur', 'Kategori', 'Jumlah (Rp)'],
      ...incomeTransactions.map((t, i) => [
        i + 1,
        new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        t.description || '-',
        t.donor || '-',
        t.category?.name || '-',
        t.amount
      ])
    ];
    
    if (incomeTransactions.length === 0) {
      incomeData.push(['', '', 'Tidak ada transaksi pemasukan', '', '', '']);
    }
    
    const wsIncome = XLSX.utils.aoa_to_sheet(incomeData);
    wsIncome['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 35 }, { wch: 25 }, { wch: 20 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsIncome, 'Pemasukan');
    
    // Sheet 3: Detail Transaksi Pengeluaran
    const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
    const expenseData = [
      ['DETAIL TRANSAKSI PENGELUARAN'],
      [`Periode: ${report.period}`],
      [],
      ['No', 'Tanggal', 'Keterangan', 'Penerima', 'Kategori', 'Jumlah (Rp)'],
      ...expenseTransactions.map((t, i) => [
        i + 1,
        new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        t.description || '-',
        t.recipient || '-',
        t.category?.name || '-',
        t.amount
      ])
    ];
    
    if (expenseTransactions.length === 0) {
      expenseData.push(['', '', 'Tidak ada transaksi pengeluaran', '', '', '']);
    }
    
    const wsExpense = XLSX.utils.aoa_to_sheet(expenseData);
    wsExpense['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 35 }, { wch: 25 }, { wch: 20 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsExpense, 'Pengeluaran');
    
    XLSX.writeFile(wb, `laporan-${report.year}-${String(report.month).padStart(2, '0')}.xlsx`);
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

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filter:</span>
            </div>
            
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div className="flex-1" />

            {/* Sort */}
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}
            </button>

            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={5}>5 per halaman</option>
              <option value={10}>10 per halaman</option>
              <option value={15}>15 per halaman</option>
              <option value={20}>20 per halaman</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-sm text-gray-500">{stats?.period?.label ?? `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}</p>
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
            <p className="text-sm text-gray-500">{stats?.period?.label ?? `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}</p>
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

        {/* Monthly Comparison Bar Chart - First */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Perbandingan 6 Bulan Terakhir</h2>
          <MonthlyComparisonChart month={selectedMonth} year={selectedYear} />
        </div>

        {/* Pie Charts Section with Month Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Kategori Pemasukan & Pengeluaran</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Periode:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Pie Chart */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Pemasukan</h3>
              <CategoryPieChart 
                data={stats?.incomeByCategory || []} 
                loading={loading} 
                type="income"
              />
            </div>

            {/* Expense Pie Chart */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Pengeluaran</h3>
              <CategoryPieChart 
                data={stats?.expenseByCategory || []} 
                loading={loading} 
                type="expense"
              />
            </div>
          </div>
        </div>

        {/* Monthly Reports List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Laporan Bulanan</h2>
            <span className="text-sm text-gray-500">
              Menampilkan {paginatedReports.length} dari {sortedReports.length} laporan
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-xl">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))
            ) : paginatedReports.length > 0 ? (
              paginatedReports.map((report) => (
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
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-500">Pemasukan</p>
                      <p className="font-bold text-green-600">{formatCurrency(report.income)}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-500">Pengeluaran</p>
                      <p className="font-bold text-red-600">{formatCurrency(report.expense)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Saldo</p>
                      <p className={`font-bold ${report.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {formatCurrency(report.balance)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDownloadExcel(report)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Download Laporan Excel"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">Belum ada laporan bulanan</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
