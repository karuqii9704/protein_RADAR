'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit,
  Trash2,
  HandHeart,
  Target,
  Users,
  Calendar,
  Loader2
} from 'lucide-react';
import { apiGet, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  target: number;
  collected: number;
  progress: number;
  isActive: boolean;
  isFeatured: boolean;
  donorCount: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await apiGet<Program>(`/api/admin/programs/${params.id}`);
        if (res.success && res.data) {
          setProgram(res.data);
        } else {
          toast.error('Program tidak ditemukan');
          router.push('/admin/program');
        }
      } catch (error) {
        console.error('Failed to fetch program:', error);
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

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus program ini?')) return;

    try {
      const res = await apiDelete(`/api/admin/programs/${params.id}`);
      if (res.success) {
        toast.success('Program berhasil dihapus');
        router.push('/admin/program');
      } else {
        toast.error(res.error || 'Gagal menghapus program');
      }
    } catch (error) {
      toast.error('Gagal menghapus program');
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!program) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/program"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
            <p className="text-gray-500">Detail program donasi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/program/${program.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <HandHeart className="w-24 h-24 text-white/50" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {program.isFeatured && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    ⭐ Unggulan
                  </span>
                )}
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  program.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {program.isActive ? 'Aktif' : 'Selesai'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{program.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Progress Donasi</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Terkumpul</span>
                <span className="text-sm font-bold text-green-600">{program.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: `${Math.min(100, program.progress)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HandHeart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terkumpul</p>
                  <p className="font-bold text-gray-900">{formatCurrency(program.collected)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="font-bold text-gray-900">{formatCurrency(program.target)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donatur</p>
                  <p className="font-bold text-gray-900">{program.donorCount} orang</p>
                </div>
              </div>
            </div>
          </div>

          {/* Period Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Periode</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Mulai</p>
                  <p className="font-medium text-gray-900">
                    {new Date(program.startDate).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              {program.endDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Berakhir</p>
                    <p className="font-medium text-gray-900">
                      {new Date(program.endDate).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
