'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload,
  Image,
  FileText,
  Eye
} from 'lucide-react';
import { apiPost } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateBeritaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    isPublished: false
  });

  const [preview, setPreview] = useState(false);

  const categories = [
    { value: 'KEGIATAN', label: 'Kegiatan' },
    { value: 'PENGUMUMAN', label: 'Pengumuman' },
    { value: 'LAPORAN', label: 'Laporan' },
    { value: 'ARTIKEL', label: 'Artikel' },
  ];

  const handleSubmit = async (publish: boolean = false) => {
    // Validate
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Judul, konten, dan kategori wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiPost('/api/admin/news', {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200),
        category: formData.category,
        isPublished: publish,
      });

      if (res.success) {
        toast.success(publish ? 'Berita berhasil dipublikasi' : 'Draft berita berhasil disimpan');
        router.push('/admin/berita');
      } else {
        toast.error(res.error || 'Gagal menyimpan berita');
      }
    } catch (error) {
      toast.error('Gagal menyimpan berita');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/berita"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
            <p className="text-gray-500 mt-1">Buat berita atau pengumuman baru</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <Eye className="w-5 h-5" />
            {preview ? 'Edit' : 'Preview'}
          </button>
          <Link
            href="/admin/berita"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
            Batal
          </Link>
          <button 
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition disabled:opacity-70"
          >
            Simpan Draft
          </button>
          <button 
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Publikasikan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Category */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Informasi Berita
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul berita yang menarik..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ringkasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat berita yang akan muncul di halaman daftar..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Konten Berita <span className="text-red-500">*</span></h2>
            <div>
              <textarea
                rows={15}
                placeholder="Tulis konten berita di sini... (Mendukung format Markdown)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tips: Gunakan **teks** untuk bold, *teks* untuk italic
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-green-600" />
              Gambar Utama
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-400 transition cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Klik untuk upload gambar
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, atau WEBP (max. 2MB)
              </p>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Preview Card</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Image className="w-10 h-10 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {formData.category && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                    Draft
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {formData.title || 'Judul berita akan muncul di sini...'}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {formData.excerpt || 'Ringkasan berita akan muncul di sini...'}
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="font-bold text-green-800 mb-3">💡 Tips Menulis</h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• Gunakan judul yang menarik & informatif</li>
              <li>• Tambahkan gambar yang relevan</li>
              <li>• Tulis ringkasan yang jelas</li>
              <li>• Review sebelum publish</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
