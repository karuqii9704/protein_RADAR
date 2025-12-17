'use client';

import { useEffect, useState } from 'react';
import { 
  FileText, 
  Newspaper, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Layers,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { DashboardStats } from '@/types';

interface AdminStatsResponse {
  totalTransactions: number;
  totalNews: number;
  totalArticles: number;
  totalPrograms: number;
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: string;
  amount?: number;
}

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, adminRes] = await Promise.all([
          apiGet<DashboardStats>('/api/dashboard/stats'),
          apiGet<AdminStatsResponse>('/api/admin/stats'),
        ]);
        
        if (dashRes.success && dashRes.data) {
          setDashboardStats(dashRes.data);
        }
        if (adminRes.success && adminRes.data) {
          setAdminStats(adminRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Build stats array from API data
  const stats = [
    {
      title: 'Total Transaksi',
      value: loading ? '...' : (adminStats?.totalTransactions ?? 0).toString(),
      change: '',
      changeType: 'neutral',
      icon: FileText,
      color: 'blue',
      href: '/admin/laporan'
    },
    {
      title: 'Total Berita',
      value: loading ? '...' : (adminStats?.totalNews ?? 0).toString(),
      change: '',
      changeType: 'neutral',
      icon: Newspaper,
      color: 'green',
      href: '/admin/berita'
    },
    {
      title: 'Total Artikel',
      value: loading ? '...' : (adminStats?.totalArticles ?? 0).toString(),
      change: '',
      changeType: 'neutral',
      icon: BookOpen,
      color: 'purple',
      href: '/admin/artikel'
    },
    {
      title: 'Total Program',
      value: loading ? '...' : (adminStats?.totalPrograms ?? 0).toString(),
      change: '',
      changeType: 'neutral',
      icon: Layers,
      color: 'orange',
      href: '/admin/program'
    },
  ];

  // Get recent activities from API
  const recentActivities: Activity[] = adminStats?.recentActivities ?? [];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'from-blue-500 to-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'from-green-500 to-green-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'from-purple-500 to-purple-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'from-orange-500 to-orange-600' },
    };
    return colors[color] || colors.blue;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'laporan': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'berita': return <Newspaper className="w-4 h-4 text-green-500" />;
      case 'artikel': return <BookOpen className="w-4 h-4 text-purple-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang di Admin Panel Masjid Syamsul &apos;Ulum</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/laporan/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Laporan</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.iconBg} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Keuangan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-green-700">Pemasukan</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : formatCurrency(dashboardStats?.totalIncome ?? 0)}
              </p>
              <p className="text-xs text-green-600 mt-1">{dashboardStats?.period?.label ?? 'Bulan ini'}</p>
            </div>

            {/* Expense */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-red-700">Pengeluaran</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : formatCurrency(dashboardStats?.totalExpense ?? 0)}
              </p>
              <p className="text-xs text-red-600 mt-1">{dashboardStats?.period?.label ?? 'Bulan ini'}</p>
            </div>

            {/* Balance */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700">Saldo</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : formatCurrency(dashboardStats?.balance ?? 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Tersedia</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link
              href="/admin/laporan/create"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition group"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-600">Tambah Laporan</p>
                <p className="text-xs text-gray-500">Buat laporan keuangan baru</p>
              </div>
            </Link>
            <Link
              href="/admin/berita/create"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition group"
            >
              <div className="p-2 bg-green-500 rounded-lg">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-600">Tambah Berita</p>
                <p className="text-xs text-gray-500">Posting berita terbaru</p>
              </div>
            </Link>
            <Link
              href="/admin/artikel/create"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition group"
            >
              <div className="p-2 bg-purple-500 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-purple-600">Tambah Artikel</p>
                <p className="text-xs text-gray-500">Tulis artikel baru</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h2>
          <button className="text-sm text-green-600 font-medium hover:text-green-700">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">
                  oleh {activity.user} · {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
