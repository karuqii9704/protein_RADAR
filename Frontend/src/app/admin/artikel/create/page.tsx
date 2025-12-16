'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload,
  Image,
  BookOpen,
  Eye,
  Bold,
  Italic,
  List,
  Link2,
  Quote
} from 'lucide-react';

export default function CreateArtikelPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImage: null as File | null
  });

  const categories = ['Ibadah', 'Zakat', 'Adab', 'Sedekah', 'Akhlak', 'Fiqih', 'Tafsir'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/artikel"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Artikel Baru</h1>
            <p className="text-gray-500 mt-1">Tulis artikel islami untuk jamaah</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/artikel"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
            Batal
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
            <Eye className="w-5 h-5" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition">
            <Save className="w-5 h-5" />
            Simpan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <input
              type="text"
              placeholder="Judul Artikel..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-300"
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-gray-100 bg-gray-50">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <Bold className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <Italic className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <List className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <Quote className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <Link2 className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">
                <Image className="w-5 h-5" />
              </button>
            </div>

            {/* Editor */}
            <textarea
              rows={20}
              placeholder="Tulis artikel Anda di sini...

Gunakan format Markdown untuk styling:

## Heading 2
### Heading 3

**Teks tebal** dan *teks miring*

- List item 1
- List item 2

> Quote / kutipan

[Link text](url)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-6 bg-white border-none outline-none resize-none font-mono text-gray-700 leading-relaxed"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Pengaturan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penulis
                </label>
                <input
                  type="text"
                  placeholder="Nama penulis..."
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h2>
            <textarea
              rows={4}
              placeholder="Tulis ringkasan singkat artikel..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Gambar Utama</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-green-400 transition cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Upload gambar</p>
              <p className="text-xs text-gray-500">Max 2MB</p>
            </div>
          </div>

          {/* SEO Preview */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Preview SEO</h2>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-blue-600 text-sm font-medium mb-1 line-clamp-1">
                {formData.title || 'Judul Artikel'}
              </p>
              <p className="text-green-700 text-xs mb-1">
                msu.telkomuniversity.ac.id/artikel/...
              </p>
              <p className="text-gray-600 text-xs line-clamp-2">
                {formData.excerpt || 'Ringkasan artikel akan muncul di sini sebagai meta description...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
