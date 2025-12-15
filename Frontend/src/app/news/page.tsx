import Link from 'next/link';
import { 
  Newspaper, 
  Calendar,
  ChevronRight,
  Tag
} from 'lucide-react';

export default function NewsPage() {
  // Mock data for news
  const newsItems = [
    {
      id: 1,
      title: 'Laporan Keuangan Bulan November 2025',
      excerpt: 'Laporan keuangan bulanan masjid periode November 2025 telah tersedia untuk jamaah. Total pemasukan mencapai Rp 125 juta.',
      date: '24 November 2025',
      category: 'Laporan',
      image: '/images/report.jpg',
    },
    {
      id: 2,
      title: 'Kegiatan Santunan Anak Yatim - Ramadhan 1446H',
      excerpt: 'Alhamdulillah, program santunan anak yatim telah berhasil dilaksanakan dengan menyantuni 50 anak yatim di sekitar masjid.',
      date: '20 November 2025',
      category: 'Kegiatan',
      image: '/images/event.jpg',
    },
    {
      id: 3,
      title: 'Pembangunan Fasilitas Wudhu Baru',
      excerpt: 'Proyek pembangunan fasilitas wudhu baru telah dimulai. Target penyelesaian pada akhir tahun 2025.',
      date: '15 November 2025',
      category: 'Pengumuman',
      image: '/images/construction.jpg',
    },
    {
      id: 4,
      title: 'Kajian Akbar Bersama Ustadz Abdul Somad',
      excerpt: 'Masjid Syamsul Ulum akan mengadakan kajian akbar bersama Ustadz Abdul Somad pada tanggal 10 Desember 2025.',
      date: '12 November 2025',
      category: 'Kegiatan',
      image: '/images/kajian.jpg',
    },
    {
      id: 5,
      title: 'Program Beasiswa Tahfidz Quran 2026',
      excerpt: 'Pendaftaran program beasiswa tahfidz Quran untuk tahun 2026 telah dibuka. Tersedia 20 kuota untuk santri berprestasi.',
      date: '10 November 2025',
      category: 'Pengumuman',
      image: '/images/tahfidz.jpg',
    },
    {
      id: 6,
      title: 'Renovasi Mihrab Masjid Selesai',
      excerpt: 'Renovasi mihrab masjid telah selesai dilaksanakan. Terima kasih kepada semua donatur yang telah berkontribusi.',
      date: '5 November 2025',
      category: 'Laporan',
      image: '/images/mihrab.jpg',
    },
  ];

  const categories = ['Semua', 'Laporan', 'Kegiatan', 'Pengumuman'];

  return (
    <div className="bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Page Header */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Berita & Pengumuman</h1>
          </div>
          <p className="text-green-50 text-lg max-w-2xl">
            Informasi terkini seputar kegiatan, program, dan perkembangan Masjid Syamsul 'Ulum Telkom University.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  category === 'Semua'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                {/* News Image */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  <Newspaper className="w-20 h-20 text-gray-400 group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                    {item.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>
                  
                  {/* Read More */}
                  <div className="flex items-center text-green-600 font-semibold text-sm">
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
