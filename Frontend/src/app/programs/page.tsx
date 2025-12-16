'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Target,
  ChevronRight,
  HandHeart
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { Program } from '@/types';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await apiGet<Program[]>('/api/programs', { limit: 20 });
        if (res.success && res.data) {
          setPrograms(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Program Donasi</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dukung program-program Masjid Syamsul &apos;Ulum untuk kemaslahatan umat
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : programs.length > 0 ? (
            programs.map((program) => (
              <div 
                key={program.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white relative overflow-hidden">
                  <HandHeart className="w-20 h-20 opacity-50 group-hover:scale-110 transition-transform" />
                  {program.isFeatured && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      ⭐ Unggulan
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Terkumpul</span>
                      <span className="font-bold text-green-600">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(100, program.progress)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Target
                      </p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(program.target)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Donatur
                      </p>
                      <p className="text-sm font-bold text-gray-900">{program.donors} orang</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {program.daysLeft !== null ? `${program.daysLeft} hari lagi` : 'Tanpa batas waktu'}
                    </span>
                    <Link 
                      href={`/programs/${program.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                      Donasi
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Belum ada program tersedia</p>
              <p className="text-gray-400 mt-2">Program donasi akan segera hadir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
