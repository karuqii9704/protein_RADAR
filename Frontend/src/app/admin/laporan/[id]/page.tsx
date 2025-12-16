import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Share2,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock
} from 'lucide-react';

export default function LaporanDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch based on params.id
  const laporan = {
    id: params.id,
    title: 'Laporan Keuangan November 2025',
    period: 'November 2025',
    description: 'Laporan keuangan bulanan Masjid Syamsul Ulum untuk periode November 2025. Mencakup semua pemasukan dari infaq, zakat, dan donasi serta pengeluaran operasional masjid.',
    income: 45000000,
    expense: 32000000,
    balance: 13000000,
    status: 'published',
    createdAt: '2025-11-24',
    updatedAt: '2025-11-25',
    author: 'Admin Masjid'
  };

  const transactions = [
    { id: 1, type: 'income', description: 'Infaq Jumat Minggu 1', category: 'Infaq', amount: 8500000, date: '2025-11-01' },
    { id: 2, type: 'income', description: 'Infaq Jumat Minggu 2', category: 'Infaq', amount: 7200000, date: '2025-11-08' },
    { id: 3, type: 'expense', description: 'Pembayaran Listrik PLN', category: 'Operasional', amount: 2500000, date: '2025-11-05' },
    { id: 4, type: 'income', description: 'Zakat Bapak Ahmad', category: 'Zakat', amount: 5000000, date: '2025-11-10' },
    { id: 5, type: 'expense', description: 'Pembayaran Air PDAM', category: 'Operasional', amount: 850000, date: '2025-11-10' },
    { id: 6, type: 'income', description: 'Donasi Renovasi Toilet', category: 'Donasi', amount: 15000000, date: '2025-11-12' },
    { id: 7, type: 'expense', description: 'Gaji Marbot (2 orang)', category: 'Gaji', amount: 4000000, date: '2025-11-15' },
    { id: 8, type: 'income', description: 'Infaq Jumat Minggu 3', category: 'Infaq', amount: 9300000, date: '2025-11-15' },
    { id: 9, type: 'expense', description: 'Pembelian Peralatan Kebersihan', category: 'Kebersihan', amount: 1500000, date: '2025-11-18' },
    { id: 10, type: 'expense', description: 'Biaya Internet & Listrik Sound', category: 'Operasional', amount: 750000, date: '2025-11-20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/laporan"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{laporan.title}</h1>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Published
              </span>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {laporan.period}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Download">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/admin/laporan/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition">
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-green-100 font-medium">Total Pemasukan</span>
          </div>
          <p className="text-3xl font-bold">Rp {laporan.income.toLocaleString('id-ID')}</p>
          <p className="text-green-100 text-sm mt-2">{transactions.filter(t => t.type === 'income').length} transaksi</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-red-100 font-medium">Total Pengeluaran</span>
          </div>
          <p className="text-3xl font-bold">Rp {laporan.expense.toLocaleString('id-ID')}</p>
          <p className="text-red-100 text-sm mt-2">{transactions.filter(t => t.type === 'expense').length} transaksi</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/25">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-blue-100 font-medium">Saldo Akhir</span>
          </div>
          <p className="text-3xl font-bold">Rp {laporan.balance.toLocaleString('id-ID')}</p>
          <p className="text-blue-100 text-sm mt-2">Surplus bulan ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Daftar Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Deskripsi</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Kategori</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Tanggal</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {tx.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{tx.date}</td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{laporan.description}</p>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dibuat oleh</p>
                  <p className="text-sm font-medium text-gray-900">{laporan.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Dibuat</p>
                  <p className="text-sm font-medium text-gray-900">{laporan.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terakhir Diupdate</p>
                  <p className="text-sm font-medium text-gray-900">{laporan.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
