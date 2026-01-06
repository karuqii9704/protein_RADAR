'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Wallet,
  HandHeart,
  Newspaper,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import HeroCarousel from '@/components/dashboard/HeroCarousel';
import CategoryButtons from '@/components/dashboard/CategoryButtons';
import { apiGet } from '@/lib/api';
import { formatCurrency } from '@/lib/currency';
import type { DashboardStats, Program, Transaction, News } from '@/types';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [statsRes, programsRes, transactionsRes, newsRes] = await Promise.all([
          apiGet<DashboardStats>('/api/dashboard/stats'),
          apiGet<Program[]>('/api/programs', { featured: true, limit: 3 }),
          apiGet<Transaction[]>('/api/transactions', { limit: 5 }),
          apiGet<News[]>('/api/news', { limit: 3 }),
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (programsRes.success && programsRes.data) setPrograms(programsRes.data);
        if (transactionsRes.success && transactionsRes.data) setTransactions(transactionsRes.data);
        if (newsRes.success && newsRes.data) setNews(newsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Hero Section - Carousel Slides */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <HeroCarousel />
        </div>
      </section>

      {/* Category Buttons - Wakaf Salman Style */}
      <CategoryButtons />

      {/* Stats Cards - Enhanced Design */}
      <section className="py-12 px-4 -mt-16 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Pemasukan */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    (stats?.incomeChange ?? 0) >= 0 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {(stats?.incomeChange ?? 0) >= 0 ? '+' : ''}{stats?.incomeChange ?? 0}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Pemasukan</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : formatCurrency(stats?.totalIncome ?? 0)}
              </p>
              <p className="text-xs text-gray-500">
                {stats?.period?.label ?? 'Bulan ini'} · {stats?.donorCount ?? 0} donatur
              </p>
            </div>

            {/* Total Pengeluaran */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    (stats?.expenseChange ?? 0) <= 0 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {(stats?.expenseChange ?? 0) >= 0 ? '+' : ''}{stats?.expenseChange ?? 0}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Pengeluaran</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : formatCurrency(stats?.totalExpense ?? 0)}
              </p>
              <p className="text-xs text-gray-500">{stats?.period?.label ?? 'Bulan ini'} · Operasional</p>
            </div>

            {/* Saldo */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Aktif
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Saldo Tersedia</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : formatCurrency(stats?.balance ?? 0)}
              </p>
              <p className="text-xs text-gray-500">Update: {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            {/* Total Transaksi */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    +{stats?.transactionCount ?? 0}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Transaksi</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.transactionCount ?? 0}</p>
              <p className="text-xs text-gray-500">{stats?.period?.label ?? 'Bulan ini'} · Tercatat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan - Rumah Amal Style */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Program Unggulan</h3>
              <p className="text-gray-600">Dukung program-program masjid untuk kemaslahatan umat</p>
            </div>
            <Link href="/programs" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : programs.length > 0 ? (
              programs.map((program) => (
                <div key={program.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white overflow-hidden">
                    {program.image ? (
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover"
                        unoptimized={program.image.startsWith('data:') || program.image.startsWith('http')}
                      />
                    ) : (
                      <HandHeart className="w-20 h-20 opacity-50" />
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h4>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Terkumpul</span>
                        <span className="font-bold text-green-600">{program.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Terkumpul</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(program.collected)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Target</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(program.target)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {program.daysLeft ?? 0} hari lagi
                      </span>
                      <Link 
                        href={`/programs/${program.slug}`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
                      >
                        Donasi
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Belum ada program tersedia
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Transaksi Terbaru</h3>
              <Link href="/laporan" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                Lihat Semua
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                  </div>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'INCOME' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'INCOME' ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.type === 'INCOME' ? transaction.donor : transaction.recipient}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{transaction.date}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                            {transaction.category?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'INCOME' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{transaction.type.toLowerCase()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Belum ada transaksi
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Berita/Kabar - Wakaf Salman Style */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Kabar Terbaru</h3>
              <p className="text-gray-600">Informasi dan kegiatan terkini Masjid Syamsul &apos;Ulum</p>
            </div>
            <Link href="/news" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : news.length > 0 ? (
              news.map((item) => (
                <Link 
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform"
                        unoptimized={item.image.startsWith('data:') || item.image.startsWith('http')} 
                      />
                    ) : (
                      <Newspaper className="w-20 h-20 text-gray-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.publishedAt}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                      {item.title}
                    </h4>
                    <div className="flex items-center text-green-600 font-semibold text-sm mt-4">
                      Baca Selengkapnya
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Belum ada berita
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
