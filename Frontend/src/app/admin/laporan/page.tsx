import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function LaporanListPage() {
  // Mock data for laporan
  const laporanList = [
    { 
      id: 1, 
      title: 'Laporan Keuangan November 2025', 
      period: 'November 2025',
      income: 45000000,
      expense: 32000000,
      balance: 13000000,
      status: 'published',
      createdAt: '2025-11-24'
    },
    { 
      id: 2, 
      title: 'Laporan Keuangan Oktober 2025', 
      period: 'Oktober 2025',
      income: 38500000,
      expense: 28700000,
      balance: 9800000,
      status: 'published',
      createdAt: '2025-10-31'
    },
    { 
      id: 3, 
      title: 'Laporan Keuangan September 2025', 
      period: 'September 2025',
      income: 42000000,
      expense: 35200000,
      balance: 6800000,
      status: 'published',
      createdAt: '2025-09-30'
    },
    { 
      id: 4, 
      title: 'Laporan Keuangan Agustus 2025', 
      period: 'Agustus 2025',
      income: 36000000,
      expense: 29500000,
      balance: 6500000,
      status: 'draft',
      createdAt: '2025-08-31'
    },
    { 
      id: 5, 
      title: 'Laporan Keuangan Juli 2025', 
      period: 'Juli 2025',
      income: 41200000,
      expense: 31800000,
      balance: 9400000,
      status: 'published',
      createdAt: '2025-07-31'
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-500 mt-1">Kelola semua laporan keuangan masjid</p>
        </div>
        <Link
          href="/admin/laporan/create"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Laporan
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Laporan</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">21</p>
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

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter */}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>

          {/* Export */}
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
            <Download className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Laporan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Periode</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Pemasukan</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Pengeluaran</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Saldo</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanList.map((laporan, index) => (
                <tr 
                  key={laporan.id} 
                  className={`border-b border-gray-50 hover:bg-gray-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{laporan.title}</p>
                        <p className="text-xs text-gray-500">{laporan.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{laporan.period}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-medium">
                      +Rp {laporan.income.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-red-600 font-medium">
                      -Rp {laporan.expense.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-600 font-bold">
                      Rp {laporan.balance.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(laporan.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/laporan/${laporan.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/laporan/${laporan.id}/edit`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Menampilkan 1-5 dari 24 laporan
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">2</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">3</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">4</button>
            <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">5</button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
