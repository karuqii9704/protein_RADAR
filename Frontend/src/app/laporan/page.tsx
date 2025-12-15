'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';
import MonthlyComparisonChart from '@/components/laporan/MonthlyComparisonChart';
import CategoryBreakdownChart from '@/components/laporan/CategoryBreakdownChart';
import FilterSection from '@/components/laporan/FilterSection';

export default function LaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Mock data - akan diganti dengan API call
  const summaryStats = {
    totalIncome: 125500000,
    totalExpense: 87300000,
    balance: 38200000,
    transactionCount: 156,
  };

  const reports = [
    { 
      id: 1, 
      period: 'November 2025', 
      income: 125500000, 
      expense: 87300000, 
      balance: 38200000,
      publishedDate: '2025-11-25'
    },
    { 
      id: 2, 
      period: 'Oktober 2025', 
      income: 118200000, 
      expense: 82100000, 
      balance: 36100000,
      publishedDate: '2025-10-25'
    },
    { 
      id: 3, 
      period: 'September 2025', 
      income: 112800000, 
      expense: 79500000, 
      balance: 33300000,
      publishedDate: '2025-09-25'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilterChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // TODO: Fetch data based on filter
  };

  return (
    <div className="bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Page Title */}
      <section className="py-8 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">Laporan Keuangan</h2>
          </div>
          <p className="text-green-50">Transparansi pengelolaan keuangan masjid untuk jamaah</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <FilterSection 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onFilterChange={handleFilterChange}
          />
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Pemasukan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  +12.5%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalIncome)}</h3>
            </div>

            {/* Total Pengeluaran */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  +8.3%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalExpense)}</h3>
            </div>

            {/* Saldo */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Periode Ini
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Saldo</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.balance)}</h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Comparison Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Perbandingan Bulanan</h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <MonthlyComparisonChart month={selectedMonth} year={selectedYear} />
            </div>

            {/* Category Breakdown Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Breakdown Per Kategori</h3>
                <PieChart className="w-5 h-5 text-green-600" />
              </div>
              <CategoryBreakdownChart month={selectedMonth} year={selectedYear} />
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Laporan Keuangan Bulanan</h3>
              <Download className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Periode</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pemasukan</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pengeluaran</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Saldo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.period}</p>
                          <p className="text-xs text-gray-500">Dipublikasi: {report.publishedDate}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-600 font-semibold">{formatCurrency(report.income)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-red-600 font-semibold">{formatCurrency(report.expense)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-blue-600 font-semibold">{formatCurrency(report.balance)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
