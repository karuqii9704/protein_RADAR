'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Eye, 
  ArrowLeft, 
  User,
  Share2,
  Facebook,
  Twitter,
  Newspaper,
  FileText,
  Download
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { News } from '@/types';

interface NewsDetail extends News {
  content: string;
  attachment?: string;
  attachmentName?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  // Set URL after mount to avoid SSR issues with window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiGet<NewsDetail>(`/api/news/${slug}`);
        if (res.success && res.data) {
          setNews(res.data);
        } else {
          setError('Berita tidak ditemukan');
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Gagal memuat berita');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNews();
    }
  }, [slug]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'LAPORAN': 'bg-blue-100 text-blue-700',
      'KEGIATAN': 'bg-green-100 text-green-700',
      'PENGUMUMAN': 'bg-yellow-100 text-yellow-700',
      'ARTIKEL': 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="space-y-2 mt-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <Newspaper className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Berita tidak ditemukan'}
          </h1>
          <p className="text-gray-500 mb-8">
            Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Berita
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
            {news.image ? (
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Newspaper className="w-24 h-24 text-white/40" />
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`px-4 py-2 text-sm font-medium rounded-full ${getCategoryColor(news.category)}`}>
                {news.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {news.publishedAt ? formatDate(news.publishedAt) : 'Belum dipublikasi'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {news.viewCount} views
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                {news.author?.avatar ? (
                  <img src={news.author.avatar} alt={news.author.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{news.author?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">Penulis</p>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mt-8 prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-green-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: news.content || '' }}
            />

            {/* Attachment Download */}
            {news.attachment && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Lampiran Dokumen
                </h3>
                <a
                  href={news.attachment}
                  download={news.attachmentName || 'lampiran'}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
                >
                  <Download className="w-5 h-5" />
                  <span>Unduh {news.attachmentName || 'Dokumen'}</span>
                </a>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-gray-600">
                  <Share2 className="w-5 h-5" />
                  Bagikan:
                </span>
                {currentUrl && (
                  <div className="flex gap-2">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(news.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Back to News */}
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Lihat Berita Lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}
