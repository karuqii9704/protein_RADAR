'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload,
  BookOpen,
  Eye,
  Bold,
  Italic,
  List,
  Link2,
  Quote,
  Loader2, // Added Loader2
  Image as ImageIcon // Aliased Image icon
} from 'lucide-react';
import { apiPost } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image'; // Added Next.js Image component

export default function CreateArtikelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Added imagePreview state
  const fileInputRef = useRef<HTMLInputElement>(null); // Added fileInputRef
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '', // Added image field to formData
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // Max 5MB
      toast.error('Ukuran gambar maksimal 5MB');
      return;
    }

    setLoading(true);
    
    // Compress image before converting to base64
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');
        
        img.onload = () => {
          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 70% quality
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        
        img.src = URL.createObjectURL(file);
      });
    };

    try {
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
      setFormData(prev => ({ ...prev, image: compressedImage }));
    } catch (error) {
      toast.error('Gagal memproses gambar');
      console.error('Image compression error:', error);
    } finally {
      setLoading(false);
    }
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

    setIsSubmitting(true);

    try {
      const res = await apiPost('/api/admin/artikel', {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 200),
        isPublished: publish,
        image: formData.image,
      });

      if (res.success) {
        toast.success(publish ? 'Artikel berhasil dipublikasi' : 'Draft artikel berhasil disimpan');
        router.push('/admin/artikel');
      } else {
        toast.error(res.error || 'Gagal menyimpan artikel');
      }
    } catch (error) {
      toast.error('Gagal menyimpan artikel');
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
                <ImageIcon className="w-5 h-5" /> {/* Used aliased Image icon */}
              </button>
            </div>

            {/* Editor */}
            <textarea
              rows={20}
              placeholder={`Tulis artikel Anda di sini...

Gunakan format Markdown untuk styling:

## Heading 2
### Heading 3

**Teks tebal** dan *teks miring*

- List item 1
- List item 2

> Quote / kutipan

[Link text](url)`}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-6 bg-white border-none outline-none resize-none font-mono text-gray-700 leading-relaxed"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Info Artikel
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm font-medium text-purple-700">Kategori: Artikel</p>
                <p className="text-xs text-purple-600 mt-1">
                  Artikel akan otomatis masuk ke kategori Artikel Islami
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Gambar Utama</h2>
            
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
                  {loading ? (
                    <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  )}
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
                  value={formData.image.startsWith('data:') ? '' : formData.image} // Display URL if not base64
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    setImagePreview(null); // Clear preview if URL is entered
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h2>
            <textarea
              rows={4}
              placeholder="Tulis ringkasan singkat artikel (opsional, akan diambil dari konten jika kosong)..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            />
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
