'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save,
  Loader2,
  HandHeart
} from 'lucide-react';
import { apiGet, apiPut } from '@/lib/api';
import toast from 'react-hot-toast';

interface Program {
  id: string;
  title: string;
  description: string;
  target: number;
  collected: number;
  image: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

export default function EditProgramPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    image: '',
    startDate: '',
    endDate: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await apiGet<Program>(`/api/admin/programs/${params.id}`);
        if (res.success && res.data) {
          const p = res.data;
          setFormData({
            title: p.title,
            description: p.description,
            target: p.target.toString(),
            image: p.image || '',
            startDate: p.startDate,
            endDate: p.endDate || '',
            isActive: p.isActive,
            isFeatured: p.isFeatured,
          });
        } else {
          toast.error('Program tidak ditemukan');
          router.push('/admin/program');
        }
      } catch (error) {
        toast.error('Gagal memuat program');
        router.push('/admin/program');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProgram();
    }
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.target) {
      toast.error('Judul, deskripsi, dan target wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const res = await apiPut(`/api/admin/programs/${params.id}`, {
        ...formData,
        target: parseFloat(formData.target),
        endDate: formData.endDate || null,
        image: formData.image || null,
      });

      if (res.success) {
        toast.success('Program berhasil diperbarui');
        router.push('/admin/program');
      } else {
        toast.error(res.error || 'Gagal memperbarui program');
      }
    } catch (error) {
      toast.error('Gagal memperbarui program');
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
      <div className="flex items-center gap-4">
        <Link
          href="/admin/program"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
          <p className="text-gray-500">Perbarui informasi program</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Dana <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-700">Preview</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {formData.title || 'Judul Program'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {formData.description || 'Deskripsi program...'}
              </p>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-500">Target</p>
                <p className="text-lg font-bold text-green-600">
                  Rp {formData.target ? parseInt(formData.target).toLocaleString('id-ID') : '0'}
                </p>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-900 mb-4">Periode Program</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-900 mb-4">Pengaturan</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Unggulan</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/admin/program"
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
