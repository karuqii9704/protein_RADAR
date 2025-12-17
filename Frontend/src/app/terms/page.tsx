'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Syarat & Ketentuan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ketentuan penggunaan layanan Dashboard Masjid Syamsul &apos;Ulum
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Ketentuan Umum</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Dashboard Masjid Syamsul &apos;Ulum adalah platform transparansi keuangan yang dikelola oleh pengurus masjid. Dengan mengakses dashboard ini, Anda menyetujui untuk:
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>Menggunakan informasi yang tersedia untuk tujuan yang baik dan sesuai syariat</li>
                <li>Tidak menyalahgunakan data yang ditampilkan</li>
                <li>Menghormati privasi donatur yang tidak ingin dipublikasikan</li>
                <li>Melaporkan kepada pengurus jika menemukan ketidaksesuaian data</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Privasi & Keamanan</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen menjaga keamanan dan privasi data:
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>Data donatur yang bersifat anonim akan tetap dirahasiakan</li>
                <li>Informasi keuangan yang ditampilkan sudah diverifikasi oleh bendahara masjid</li>
                <li>Laporan keuangan diaudit secara berkala oleh tim pengawas</li>
                <li>Akses admin dilindungi dengan sistem autentikasi yang aman</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Penggunaan Layanan</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Layanan dashboard ini disediakan untuk:
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>Transparansi keuangan masjid kepada jamaah</li>
                <li>Informasi program dan kegiatan masjid</li>
                <li>Fasilitasi donasi dan infaq secara digital</li>
                <li>Publikasi berita dan artikel dakwah</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pertanyaan & Kontak</h2>
            <p className="text-gray-600 leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi pengurus masjid melalui:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mt-4">
              <p className="text-gray-700 font-medium">Masjid Syamsul &apos;Ulum</p>
              <p className="text-gray-600">Telkom University, Bandung</p>
              <p className="text-gray-600 mt-2">Email: info@masjidsyamsululum.ac.id</p>
              <p className="text-gray-600">Telepon: +62 811 2222 3333</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: Desember 2024
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
