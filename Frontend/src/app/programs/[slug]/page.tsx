'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Target,
  ArrowLeft,
  HandHeart,
  Share2,
  Facebook,
  Twitter,
  Clock,
  TrendingUp
} from 'lucide-react';
import { apiGet } from '@/lib/api';
import type { Program } from '@/types';
import DonationModal from '@/components/DonationModal';

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  useEffect(() => {
    // Set URL after mount to avoid SSR issues
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await apiGet<Program>(`/api/programs/${slug}`);
        if (res.success && res.data) {
          setProgram(res.data);
        } else {
          setError('Program tidak ditemukan');
        }
      } catch (err) {
        console.error('Failed to fetch program:', err);
        setError('Gagal memuat program');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProgram();
    }
  }, [slug]);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
              <div className="space-y-2 mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <HandHeart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Program tidak ditemukan'}
          </h1>
          <p className="text-gray-500 mb-8">
            Maaf, program yang Anda cari tidak tersedia atau telah berakhir.
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Program
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Program
        </Link>

        {/* Program Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Featured Image / Banner */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center relative">
            {program.image ? (
              <img 
                src={program.image} 
                alt={program.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <HandHeart className="w-24 h-24 text-white/40" />
            )}
            {program.isFeatured && (
              <span className="absolute top-4 left-4 px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full shadow-lg">
                ⭐ Program Unggulan
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {program.title}
            </h1>

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Progress Penggalangan</span>
                <span className="text-2xl font-bold text-green-600">{program.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(100, program.progress)}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Terkumpul</p>
                  <p className="font-bold text-gray-900">{formatCurrency(program.collected)}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Target</p>
                  <p className="font-bold text-gray-900">{formatCurrency(program.target)}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Donatur</p>
                  <p className="font-bold text-gray-900">{program.donors} orang</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">Sisa Waktu</p>
                  <p className="font-bold text-gray-900">
                    {program.daysLeft !== null && program.daysLeft !== undefined 
                      ? `${program.daysLeft} hari` 
                      : 'Tanpa batas'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Program</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>{program.description}</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mulai: {formatDate(program.startDate)}
              </span>
              {program.endDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Berakhir: {formatDate(program.endDate)}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => setIsDonationModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:from-green-700 hover:to-green-600 transition-all"
              >
                <HandHeart className="w-5 h-5 inline mr-2" />
                Donasi Sekarang
              </button>
              
              {/* Share */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  Bagikan:
                </span>
                {currentUrl && (
                  <>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(program.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Programs */}
        <div className="text-center mt-12">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Lihat Program Lainnya
          </Link>
        </div>
      </div>

      {/* Donation Modal */}
      {program && (
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          programId={program.id}
          programTitle={program.title}
          programQris={(program as unknown as { qris?: string }).qris}
        />
      )}
    </div>
  );
}
