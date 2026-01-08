'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Save,
  Loader2,
  Upload,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { apiPost, apiGet } from '@/lib/api';
import toast from 'react-hot-toast';

interface ContentOption {
  id: string;
  title: string;
  slug?: string;
}

export default function CreateSlidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [contentOptions, setContentOptions] = useState<ContentOption[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    linkType: '',
    linkId: '',
    linkUrl: '',
    isActive: true,
  });

  // Fetch content options based on linkType
  useEffect(() => {
    const fetchContent = async () => {
      if (!formData.linkType || formData.linkType === 'external') {
        setContentOptions([]);
        return;
      }

      setLoadingContent(true);
      try {
        let endpoint = '';
        if (formData.linkType === 'news') endpoint = '/api/news';
        else if (formData.linkType === 'artikel') endpoint = '/api/artikel';
        else if (formData.linkType === 'program') endpoint = '/api/programs';

        if (endpoint) {
          const res = await apiGet<ContentOption[]>(endpoint, { limit: 50 });
          if (res.success && res.data) {
            setContentOptions(res.data);
          } else {
            toast.error(`Gagal memuat daftar ${formData.linkType}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Gagal memuat daftar konten');
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [formData.linkType]);

  // Compress image to reduce base64 size (Vercel has 4.5MB body limit)
  const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Scale down if larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      return;
    }

    try {
      toast.loading('Mengompresi gambar...', { id: 'compress' });
      const compressedBase64 = await compressImage(file);
      toast.dismiss('compress');
      
      // Check compressed size (should be under 2MB for safe API call)
      const base64Size = compressedBase64.length * 0.75;
      if (base64Size > 2 * 1024 * 1024) {
        // Try with more compression
        const moreCompressed = await compressImage(file, 800, 0.5);
        setImagePreview(moreCompressed);
        setFormData(prev => ({ ...prev, image: moreCompressed }));
      } else {
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      }
      toast.success('Gambar berhasil dimuat');
    } catch (error) {
      console.error('Image compression error:', error);
      toast.error('Gagal memproses gambar');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Judul wajib diisi');
      return;
    }

    setLoading(true);
    try {
      // Build linkUrl based on linkType
      let linkUrl = formData.linkUrl;
      if (formData.linkType && formData.linkType !== 'external' && formData.linkId) {
        const selected = contentOptions.find(c => c.id === formData.linkId);
        if (selected) {
          if (formData.linkType === 'news') linkUrl = `/news/${selected.slug || selected.id}`;
          else if (formData.linkType === 'artikel') linkUrl = `/artikel/${selected.slug || selected.id}`;
          else if (formData.linkType === 'program') linkUrl = `/programs/${selected.slug || selected.id}`;
        }
      }

      const res = await apiPost('/api/admin/slides', {
        ...formData,
        linkUrl,
      });

      if (res.success) {
        toast.success('Slide berhasil dibuat');
        router.push('/admin/slides');
      } else {
        toast.error(res.error || 'Gagal membuat slide');
      }
    } catch (error) {
      toast.error('Gagal membuat slide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/slides"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Slide</h1>
          <p className="text-gray-500">Buat slide baru untuk carousel</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Slide <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Program Renovasi Masjid"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi (Opsional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi singkat untuk slide ini..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Slide
          </label>
          
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
        </div>

        {/* Link Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4 inline mr-2" />
            Link Ke
          </label>
          <select
            value={formData.linkType}
            onChange={(e) => setFormData({ ...formData, linkType: e.target.value, linkId: '', linkUrl: '' })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tanpa Link</option>
            <option value="news">Berita</option>
            <option value="artikel">Artikel</option>
            <option value="program">Program</option>
            <option value="external">URL Eksternal</option>
          </select>
        </div>

        {/* Content Selection */}
        {formData.linkType && formData.linkType !== 'external' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih {formData.linkType === 'news' ? 'Berita' : formData.linkType === 'artikel' ? 'Artikel' : 'Program'}
            </label>
            <select
              value={formData.linkId}
              onChange={(e) => setFormData({ ...formData, linkId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loadingContent}
            >
              <option value="">Pilih konten...</option>
              {contentOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* External URL */}
        {formData.linkType === 'external' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Eksternal</label>
            <input
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {/* Active */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">Aktifkan slide ini</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Link
            href="/admin/slides"
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
