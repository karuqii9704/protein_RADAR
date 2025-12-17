'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2,
  Calendar,
  Eye,
  User,
  Clock,
  BookOpen,
  Loader2
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  author: { id: string; name: string; email?: string };
  createdAt: string;
  updatedAt: string;
}

export default function ArtikelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artikel, setArtikel] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await apiGet<Article>(`/api/admin/artikel/${params.id}`);
        if (res.success && res.data) {
          setArtikel(res.data);
        } else {
          toast.error('Artikel tidak ditemukan');
          router.push('/admin/artikel');
        }
      } catch (error) {
        console.error('Failed to fetch artikel:', error);
        toast.error('Gagal memuat artikel');
        router.push('/admin/artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArtikel();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;

    try {
      const res = await apiDelete(`/api/admin/artikel/${params.id}`);
      if (res.success) {
        toast.success('Artikel berhasil dihapus');
        router.push('/admin/artikel');
      } else {
        toast.error(res.error || 'Gagal menghapus artikel');
      }
    } catch (error) {
      toast.error('Gagal menghapus artikel');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Artikel tidak ditemukan</h3>
        <Link href="/admin/artikel" className="text-green-600 hover:underline">
          Kembali ke daftar artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/artikel"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                Artikel
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                artikel.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {artikel.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{artikel.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/admin/artikel/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {artikel.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{artikel.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(artikel.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            {/* Excerpt */}
            {artikel.excerpt && (
              <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-green-500 pl-4">
                {artikel.excerpt}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-green max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {artikel.content}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistik</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600">Views</span>
                </div>
                <span className="font-bold text-gray-900">{artikel.viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Penulis</p>
                  <p className="text-sm font-medium text-gray-900">{artikel.author.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="text-sm font-medium text-gray-900">Artikel</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Dibuat</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(artikel.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terakhir Diupdate</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(artikel.updatedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi</h3>
            <div className="space-y-3">
              <Link
                href={`/artikel/${artikel.slug}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition"
              >
                <Eye className="w-4 h-4" />
                Lihat di Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
