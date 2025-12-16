'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Newspaper, 
  ChevronRight,
  Calendar,
  Eye
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { News } from '@/types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiGet<News[]>('/api/news', { limit: 20 });
        if (res.success && res.data) {
          setNews(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Berita & Kabar</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan Masjid Syamsul &apos;Ulum
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="px-4 py-2 bg-green-600 text-white rounded-full font-medium">
            Semua
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:border-green-300 hover:text-green-600 transition">
            Kegiatan
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:border-green-300 hover:text-green-600 transition">
            Pengumuman
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:border-green-300 hover:text-green-600 transition">
            Artikel
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
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
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  <Newspaper className="w-16 h-16 text-gray-400 group-hover:scale-110 transition-transform" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.viewCount}
                      </span>
                    </div>
                    <span className="text-green-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Baca
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Belum ada berita</p>
              <p className="text-gray-400 mt-2">Berita akan segera hadir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
