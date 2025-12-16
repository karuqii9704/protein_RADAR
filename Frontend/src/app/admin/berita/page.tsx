import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Newspaper,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Image
} from 'lucide-react';

export default function BeritaListPage() {
  // Mock data
  const beritaList = [
    { 
      id: 1, 
      title: 'Kajian Akbar Bersama Ustadz Abdul Somad', 
      category: 'Kegiatan',
      excerpt: 'Masjid Syamsul Ulum akan mengadakan kajian akbar yang diisi oleh Ustadz Abdul Somad...',
      status: 'published',
      createdAt: '2025-11-24',
      views: 1250
    },
    { 
      id: 2, 
      title: 'Pembangunan Fasilitas Wudhu Baru Selesai', 
      category: 'Pengumuman',
      excerpt: 'Alhamdulillah, pembangunan fasilitas wudhu baru telah selesai dan siap digunakan...',
      status: 'published',
      createdAt: '2025-11-20',
      views: 890
    },
    { 
      id: 3, 
      title: 'Jadwal Sholat Idul Adha 1447H', 
      category: 'Pengumuman',
      excerpt: 'Berikut jadwal dan informasi pelaksanaan sholat Idul Adha di Masjid Syamsul Ulum...',
      status: 'draft',
      createdAt: '2025-11-18',
      views: 0
    },
    { 
      id: 4, 
      title: 'Kegiatan Santunan Anak Yatim Ramadhan 1446H', 
      category: 'Kegiatan',
      excerpt: 'Masjid Syamsul Ulum berhasil menyalurkan santunan kepada 150 anak yatim...',
      status: 'published',
      createdAt: '2025-11-15',
      views: 2100
    },
    { 
      id: 5, 
      title: 'Renovasi Masjid Tahap 2 Dimulai', 
      category: 'Pengumuman',
      excerpt: 'Renovasi masjid tahap kedua telah dimulai meliputi perbaikan atap dan AC...',
      status: 'published',
      createdAt: '2025-11-10',
      views: 650
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          Published
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
        Draft
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Kegiatan': 'bg-blue-100 text-blue-700',
      'Pengumuman': 'bg-purple-100 text-purple-700',
      'Laporan': 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
          <p className="text-gray-500 mt-1">Kelola semua berita dan pengumuman masjid</p>
        </div>
        <Link
          href="/admin/berita/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Newspaper className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Berita</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">12.5K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Newspaper className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Berita Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beritaList.map((berita) => (
          <div
            key={berita.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Image className="w-16 h-16 text-gray-400" />
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                {getCategoryBadge(berita.category)}
                {getStatusBadge(berita.status)}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                {berita.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{berita.excerpt}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {berita.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {berita.views}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/berita/${berita.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/berita/${berita.id}/edit`}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Menampilkan 1-5 dari 18 berita</p>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium">1</button>
          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">2</button>
          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">3</button>
          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">4</button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
