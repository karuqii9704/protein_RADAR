import Link from 'next/link';
import { 
  HandHeart, 
  Calendar, 
  ChevronRight,
  Target,
  Users
} from 'lucide-react';

export default function ProgramsPage() {
  // Mock data for programs
  const programs = [
    {
      id: 1,
      title: 'Renovasi Masjid',
      description: 'Program perbaikan dan pengembangan fasilitas masjid untuk kenyamanan jamaah dalam beribadah.',
      collected: 75000000,
      target: 150000000,
      progress: 50,
      daysLeft: 45,
      donors: 128,
      category: 'Infrastruktur',
    },
    {
      id: 2,
      title: 'Santunan Anak Yatim',
      description: 'Program bantuan bulanan untuk anak-anak yatim di sekitar masjid dan komunitas.',
      collected: 28000000,
      target: 50000000,
      progress: 56,
      daysLeft: 20,
      donors: 89,
      category: 'Sosial',
    },
    {
      id: 3,
      title: 'Operasional Masjid',
      description: 'Dana untuk kebutuhan operasional harian masjid termasuk listrik, air, dan kebersihan.',
      collected: 15500000,
      target: 25000000,
      progress: 62,
      daysLeft: 15,
      donors: 67,
      category: 'Operasional',
    },
    {
      id: 4,
      title: 'Pembangunan Fasilitas Wudhu',
      description: 'Pembangunan tempat wudhu baru dengan kapasitas lebih besar dan aksesibilitas lebih baik.',
      collected: 45000000,
      target: 100000000,
      progress: 45,
      daysLeft: 60,
      donors: 156,
      category: 'Infrastruktur',
    },
    {
      id: 5,
      title: 'Program Tahfidz Quran',
      description: 'Program beasiswa untuk santri penghafal Al-Quran di lingkungan masjid.',
      collected: 32000000,
      target: 60000000,
      progress: 53,
      daysLeft: 90,
      donors: 78,
      category: 'Pendidikan',
    },
    {
      id: 6,
      title: 'Kajian Rutin & Dakwah',
      description: 'Mendanai kegiatan kajian rutin, pengajian akbar, dan program dakwah lainnya.',
      collected: 18000000,
      target: 30000000,
      progress: 60,
      daysLeft: 30,
      donors: 45,
      category: 'Dakwah',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Page Header */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <HandHeart className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Program Donasi</h1>
          </div>
          <p className="text-green-50 text-lg max-w-2xl">
            Dukung program-program masjid untuk kemaslahatan umat. Setiap donasi Anda sangat berarti untuk kemajuan masjid dan masyarakat sekitar.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div 
                key={program.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                {/* Program Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white relative">
                  <HandHeart className="w-20 h-20 opacity-50" />
                  <span className="absolute top-4 left-4 text-xs px-3 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                    {program.category}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                  
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

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Terkumpul</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(program.collected)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(program.target)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {program.daysLeft} hari lagi
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {program.donors} donatur
                      </span>
                    </div>
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

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto text-center">
          <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ingin Mengusulkan Program Baru?
          </h2>
          <p className="text-green-50 mb-6 max-w-xl mx-auto">
            Kami terbuka untuk usulan program baru yang bermanfaat untuk jamaah dan masyarakat sekitar masjid.
          </p>
          <Link 
            href="/about" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Hubungi Kami
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
