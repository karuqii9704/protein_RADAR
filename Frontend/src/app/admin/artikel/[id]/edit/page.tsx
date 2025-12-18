'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Eye,
  Loader2,
  Upload
} from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  isPublished: boolean;
}

export default function EditArtikelPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    isPublished: false
  });

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await apiGet<Article>(`/api/admin/artikel/${params.id}`);
        if (res.success && res.data) {
          const a = res.data;
          setFormData({
            title: a.title,
            excerpt: a.excerpt || '',
            content: a.content,
            image: a.image || '',
            isPublished: a.isPublished,
          });
          if (a.image) setImagePreview(a.image);
        } else {
          toast.error('Artikel tidak ditemukan');
          router.push('/admin/artikel');
        }
      } catch (error) {
        toast.error('Gagal memuat artikel');
        router.push('/admin/artikel');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArtikel();
    }
  }, [params.id, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.title || !formData.content) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const res = await apiPut(`/api/admin/artikel/${params.id}`, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200),
        image: formData.image || null,
        isPublished: publish,
      });

      if (res.success) {
        toast.success(publish ? 'Artikel berhasil dipublikasi' : 'Artikel berhasil diperbarui');
        router.push('/admin/artikel');
      } else {
        toast.error(res.error || 'Gagal memperbarui artikel');
      }
    } catch (error) {
      toast.error('Gagal memperbarui artikel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
            <p className="text-gray-500 mt-1">Perbarui artikel islami</p>
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
            href="/admin/artikel"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
            Batal
          </Link>
          <button 
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition disabled:opacity-70"
          >
            Simpan Draft
          </button>
          <button 
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
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
          {/* Title */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Informasi Artikel
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul artikel..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ringkasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat artikel..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Konten Artikel <span className="text-red-500">*</span></h2>
            <div>
              <textarea
                rows={15}
                placeholder="Tulis konten artikel di sini..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Gambar Utama
            </h2>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Klik untuk upload gambar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 5MB)</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atau gunakan URL Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(null);
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Preview</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-purple-400" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                    Artikel
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    formData.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {formData.title || 'Judul artikel...'}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {formData.excerpt || 'Ringkasan artikel...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
