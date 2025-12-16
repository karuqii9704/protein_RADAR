'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Newspaper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import type { News } from '@/types';
import toast from 'react-hot-toast';

export default function BeritaListPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;

      const res = await apiGet<News[]>('/api/admin/news', params);
      if (res.success && res.data) {
        setNews(res.data);
        setTotal(res.meta?.total ?? 0);
        setTotalPages(res.meta?.totalPages ?? 1);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('Gagal memuat data berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const res = await apiDelete(`/api/admin/news/${id}`);
      if (res.success) {
        toast.success('Berita berhasil dihapus');
        fetchNews();
      } else {
        toast.error(res.error || 'Gagal menghapus berita');
      }
    } catch (error) {
      toast.error('Gagal menghapus berita');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'LAPORAN': 'bg-blue-100 text-blue-700',
      'KEGIATAN': 'bg-green-100 text-green-700',
      'PENGUMUMAN': 'bg-yellow-100 text-yellow-700',
      'ARTIKEL': 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berita & Pengumuman</h1>
          <p className="text-gray-500 mt-1">Kelola semua berita dan pengumuman masjid</p>
        </div>
        <Link
          href="/admin/berita/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Newspaper className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{news.filter(n => n.isPublished).length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-2xl font-bold text-yellow-600">{news.filter(n => !n.isPublished).length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold text-blue-600">{news.reduce((sum, n) => sum + n.viewCount, 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Kategori</option>
            <option value="LAPORAN">Laporan</option>
            <option value="KEGIATAN">Kegiatan</option>
            <option value="PENGUMUMAN">Pengumuman</option>
            <option value="ARTIKEL">Artikel</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : news.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada berita</p>
            <Link href="/admin/berita/create" className="text-green-600 font-medium hover:underline mt-2 inline-block">
              Tambah berita pertama
            </Link>
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition group">
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-green-400" />
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {item.publishedAt || 'Belum dipublikasi'} · {item.viewCount} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/news/${item.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/berita/${item.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
                page === i + 1 ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
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
      )}
    </div>
  );
}
