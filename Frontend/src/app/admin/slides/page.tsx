'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiGet, apiPut, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';

interface Slide {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  linkType: string | null;
  linkId: string | null;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await apiGet<Slide[]>('/api/admin/slides', { limit: 100 });
      if (res.success && res.data) {
        setSlides(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
      toast.error('Gagal memuat slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await apiPut(`/api/admin/slides/${id}`, { isActive: !currentStatus });
      if (res.success) {
        toast.success(!currentStatus ? 'Slide diaktifkan' : 'Slide dinonaktifkan');
        fetchSlides();
      }
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const targetSlide = slides[newIndex];
    const currentSlide = slides[currentIndex];

    try {
      // Swap orders
      const [res1, res2] = await Promise.all([
        apiPut(`/api/admin/slides/${id}`, { order: targetSlide.order }),
        apiPut(`/api/admin/slides/${targetSlide.id}`, { order: currentSlide.order }),
      ]);
      
      if (res1.success && res2.success) {
        toast.success('Urutan berhasil diubah');
        fetchSlides();
      } else {
        toast.error('Gagal mengubah urutan');
        console.error('Move slide error:', res1, res2);
      }
    } catch (error) {
      toast.error('Gagal mengubah urutan');
      console.error('Move slide error:', error);
    }
  };

  const deleteSlide = async (id: string, title: string) => {
    if (!confirm(`Hapus slide "${title}"?`)) return;

    try {
      const res = await apiDelete(`/api/admin/slides/${id}`);
      if (res.success) {
        toast.success('Slide berhasil dihapus');
        fetchSlides();
      }
    } catch (error) {
      toast.error('Gagal menghapus slide');
    }
  };

  const getLinkTypeLabel = (type: string | null) => {
    switch (type) {
      case 'news': return 'Berita';
      case 'artikel': return 'Artikel';
      case 'program': return 'Program';
      case 'external': return 'URL Eksternal';
      default: return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Carousel</h1>
          <p className="text-gray-500 mt-1">Atur slide carousel di halaman beranda</p>
        </div>
        <Link
          href="/admin/slides/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Slide</span>
        </Link>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Gunakan tombol panah untuk mengatur urutan slide. Slide dengan urutan lebih kecil akan ditampilkan lebih dulu.
        </p>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase w-12">Urutan</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Slide</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Link</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-8"></div></td>
                    <td className="px-4 py-4"><div className="h-12 bg-gray-200 rounded w-48"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : slides.length > 0 ? (
                slides.map((slide, index) => (
                  <tr key={slide.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-green-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-center">{slide.order}</span>
                        <button
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={index === slides.length - 1}
                          className="p-1 text-gray-400 hover:text-green-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        {slide.image ? (
                          <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-gray-100">
                            <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-14 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white opacity-50" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{slide.title}</p>
                          {slide.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">{slide.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {getLinkTypeLabel(slide.linkType)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(slide.id, slide.isActive)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                          slide.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {slide.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {slide.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/slides/${slide.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteSlide(slide.id, slide.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada slide</p>
                    <Link 
                      href="/admin/slides/create"
                      className="inline-block mt-4 text-sm text-green-600 hover:text-green-700"
                    >
                      Tambah slide pertama
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
