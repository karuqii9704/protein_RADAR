import Link from 'next/link';
import Image from 'next/image';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Wallet,
  HandHeart,
  Newspaper,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import HeroCarousel from '@/components/dashboard/HeroCarousel';
import CategoryButtons from '@/components/dashboard/CategoryButtons';

export default function HomePage() {
  // Mock data for preview (inspired by Rumah Amal)
  const stats = {
    totalIncome: 125500000,
    totalExpense: 87300000,
    balance: 38200000,
    transactionCount: 156,
    donors: 342,
  };

  const recentTransactions = [
    { id: 1, type: 'income', donor: 'Bapak Ahmad Ridwan', amount: 1500000, date: '2025-11-24', category: 'Infak' },
    { id: 2, type: 'expense', recipient: 'PLN (Listrik Masjid)', amount: 1200000, date: '2025-11-23', category: 'Operasional' },
    { id: 3, type: 'income', donor: 'Ibu Siti Aminah', amount: 500000, date: '2025-11-22', category: 'Zakat' },
    { id: 4, type: 'expense', recipient: 'PDAM (Air)', amount: 350000, date: '2025-11-22', category: 'Operasional' },
    { id: 5, type: 'income', donor: 'Anonymous', amount: 2000000, date: '2025-11-21', category: 'Wakaf' },
  ];

  const programs = [
    {
      id: 1,
      title: 'Renovasi Masjid',
      collected: 75000000,
      target: 150000000,
      progress: 50,
      daysLeft: 45,
    },
    {
      id: 2,
      title: 'Santunan Anak Yatim',
      collected: 28000000,
      target: 50000000,
      progress: 56,
      daysLeft: 20,
    },
    {
      id: 3,
      title: 'Operasional Masjid',
      collected: 15500000,
      target: 25000000,
      progress: 62,
      daysLeft: 15,
    },
  ];

  const news = [
    {
      id: 1,
      title: 'Laporan Keuangan Bulan November 2025',
      date: '24/11/2025',
      category: 'Laporan',
      image: '/images/report.jpg',
    },
    {
      id: 2,
      title: 'Kegiatan Santunan Anak Yatim - Ramadhan 1446H',
      date: '20/11/2025',
      category: 'Kegiatan',
      image: '/images/event.jpg',
    },
    {
      id: 3,
      title: 'Pembangunan Fasilitas Wudhu Baru',
      date: '15/11/2025',
      category: 'Pengumuman',
      image: '/images/construction.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Header - Inspired by Rumah Amal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 bg-white-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image 
                  src="/icon-masjid.png" 
                  alt="Masjid Syamsul Ulum Logo" 
                  width={100}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Masjid Syamsul 'Ulum</h1>
                <p className="text-sm text-green-700 font-medium">Telkom University</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition">
                Beranda
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-green-600 font-medium transition">
                Program
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-green-600 font-medium transition">
                Berita
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition">
                Tentang
              </Link>
            </nav>

            <Link 
              href="/admin/login"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Carousel Slides */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <HeroCarousel />
        </div>
      </section>

      {/* Category Buttons - Wakaf Salman Style */}
      <CategoryButtons />

      {/* Stats Cards - Enhanced Design */}
      <section className="py-12 px-4 -mt-16 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Pemasukan */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Pemasukan</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                Rp {(stats.totalIncome / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">Bulan ini · {stats.donors} donatur</p>
            </div>

            {/* Total Pengeluaran */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    -5.2%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Pengeluaran</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                Rp {(stats.totalExpense / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">Bulan ini · Operasional</p>
            </div>

            {/* Saldo */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Aktif
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Saldo Tersedia</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                Rp {(stats.balance / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">Update: 24 Nov 2025</p>
            </div>

            {/* Total Transaksi */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    +23
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Transaksi</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.transactionCount}</p>
              <p className="text-xs text-gray-500">Bulan ini · Tercatat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan - Rumah Amal Style */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Program Unggulan</h3>
              <p className="text-gray-600">Dukung program-program masjid untuk kemaslahatan umat</p>
            </div>
            <Link href="/programs" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                  <HandHeart className="w-20 h-20 opacity-50" />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h4>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Terkumpul</span>
                      <span className="font-bold text-green-600">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Terkumpul</p>
                      <p className="text-sm font-bold text-gray-900">
                        Rp {(program.collected / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-sm font-bold text-gray-900">
                        Rp {(program.target / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {program.daysLeft} hari lagi
                    </span>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                      Donasi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Transaksi Terbaru</h3>
              <Link href="/transactions" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                Lihat Semua
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'income' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.type === 'income' ? transaction.donor : transaction.recipient}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Berita/Kabar - Wakaf Salman Style */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Kabar Terbaru</h3>
              <p className="text-gray-600">Informasi dan kegiatan terkini Masjid Syamsul 'Ulum</p>
            </div>
            <Link href="/news" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link 
                key={item.id}
                href={`/news/${item.id}`}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  <Newspaper className="w-20 h-20 text-gray-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-green-600 font-semibold text-sm mt-4">
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Inspired by Wakaf Salman */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Masjid Syamsul 'Ulum</h3>
                  <p className="text-sm text-gray-400">Telkom University</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Lembaga pengelolaan masjid yang transparan dan akuntabel dalam mengelola dana untuk kemaslahatan umat dan kemajuan masjid.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition">
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition">
                  <span className="text-xl">🐦</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Learn More</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-green-400 transition">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="text-gray-300 hover:text-green-400 transition">
                    Program
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-gray-300 hover:text-green-400 transition">
                    Laporan Keuangan
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-300 hover:text-green-400 transition">
                    Berita
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-green-400 transition">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Kontak</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">📍</span>
                  <span className="text-sm">
                    Komplek Masjid Telkom University<br />
                    Bandung, Jawa Barat 40257
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">📞</span>
                  <span className="text-sm">+62 811 2222 3333</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✉️</span>
                  <span className="text-sm">info@masjidsyamsululum.ac.id</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Masjid Syamsul 'Ulum Telkom University · All Rights Reserved
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Dikembangkan oleh Tim PTI - Dashboard Keuangan Masjid
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
