'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload,
  Image,
  FileText,
  Eye
} from 'lucide-react';

export default function CreateBeritaPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImage: null as File | null
  });

  const [preview, setPreview] = useState(false);

  const categories = ['Kegiatan', 'Pengumuman', 'Laporan', 'Artikel'];

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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
            <Save className="w-5 h-5" />
            Simpan
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
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Konten Berita</h2>
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
                      {formData.category}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    formData.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {formData.status === 'published' ? 'Published' : 'Draft'}
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
