import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

export default function ArtikelListPage() {
  // Mock data
  const artikelList = [
    { 
      id: 1, 
      title: 'Keutamaan Sholat Berjamaah di Masjid', 
      category: 'Ibadah',
      author: 'Ustadz Ahmad',
      excerpt: 'Sholat berjamaah di masjid memiliki keutamaan 27 derajat lebih tinggi dari sholat sendiri...',
      status: 'published',
      createdAt: '2025-11-24',
      readTime: '5 min'
    },
    { 
      id: 2, 
      title: 'Panduan Lengkap Zakat Mal', 
      category: 'Zakat',
      author: 'Ustadz Fauzi',
      excerpt: 'Zakat mal adalah zakat yang dikeluarkan dari harta yang kita miliki jika sudah mencapai nisab...',
      status: 'published',
      createdAt: '2025-11-20',
      readTime: '8 min'
    },
    { 
      id: 3, 
      title: 'Adab Masuk dan Keluar Masjid', 
      category: 'Adab',
      author: 'Ustadz Ridwan',
      excerpt: 'Masjid adalah rumah Allah SWT yang memiliki keagungan tersendiri, maka kita harus menjaga adab...',
      status: 'published',
      createdAt: '2025-11-18',
      readTime: '4 min'
    },
    { 
      id: 4, 
      title: 'Keutamaan Sedekah dalam Islam', 
      category: 'Sedekah',
      author: 'Admin',
      excerpt: 'Sedekah tidak akan mengurangi harta, justru akan menambah keberkahan dalam kehidupan...',
      status: 'draft',
      createdAt: '2025-11-15',
      readTime: '6 min'
    },
    { 
      id: 5, 
      title: 'Tuntunan Sholat Tahajud', 
      category: 'Ibadah',
      author: 'Ustadz Ahmad',
      excerpt: 'Sholat tahajud adalah sholat sunnah yang dikerjakan pada sepertiga malam terakhir...',
      status: 'published',
      createdAt: '2025-11-10',
      readTime: '7 min'
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
      'Ibadah': 'bg-blue-100 text-blue-700',
      'Zakat': 'bg-green-100 text-green-700',
      'Adab': 'bg-purple-100 text-purple-700',
      'Sedekah': 'bg-orange-100 text-orange-700',
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
          <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
          <p className="text-gray-500 mt-1">Kelola semua artikel islami</p>
        </div>
        <Link
          href="/admin/artikel/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Artikel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Artikel</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
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
              <p className="text-2xl font-bold text-gray-900">8.2K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
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
              <p className="text-2xl font-bold text-gray-900">4</p>
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
              placeholder="Cari artikel..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Artikel List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {artikelList.map((artikel) => (
            <div
              key={artikel.id}
              className="p-5 hover:bg-gray-50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getCategoryBadge(artikel.category)}
                    {getStatusBadge(artikel.status)}
                    <span className="text-xs text-gray-500">• {artikel.readTime} read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-green-600 transition">
                    <Link href={`/admin/artikel/${artikel.id}`}>{artikel.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-1 mb-2">{artikel.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {artikel.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {artikel.createdAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/artikel/${artikel.id}`}
                    className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/admin/artikel/${artikel.id}/edit`}
                    className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Menampilkan 1-5 dari 32 artikel</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">2</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">3</button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
