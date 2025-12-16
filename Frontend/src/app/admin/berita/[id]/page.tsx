import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Share2,
  Calendar,
  Eye,
  User,
  Clock,
  Image
} from 'lucide-react';

export default function BeritaDetailPage({ params }: { params: { id: string } }) {
  // Mock data
  const berita = {
    id: params.id,
    title: 'Kajian Akbar Bersama Ustadz Abdul Somad',
    category: 'Kegiatan',
    excerpt: 'Masjid Syamsul Ulum akan mengadakan kajian akbar yang diisi oleh Ustadz Abdul Somad. Acara ini terbuka untuk umum dan gratis.',
    content: `
## Deskripsi Kegiatan

Masjid Syamsul Ulum dengan bangga mengundang Bapak/Ibu/Saudara sekalian untuk hadir dalam Kajian Akbar yang akan diisi oleh **Ustadz Abdul Somad, Lc., M.A.**

### Detail Acara

- **Hari/Tanggal**: Sabtu, 30 November 2025
- **Waktu**: 08.00 - 12.00 WIB
- **Tempat**: Masjid Syamsul Ulum, Telkom University
- **Tema**: "Membangun Keluarga Sakinah di Era Digital"

### Fasilitas

1. Tempat duduk yang nyaman
2. Konsumsi gratis
3. Door prize menarik
4. Mushaf Al-Quran untuk 100 pendaftar pertama

### Cara Pendaftaran

Pendaftaran dapat dilakukan melalui:
- Website: msu.telkomuniversity.ac.id/kajian
- WhatsApp: 0812-3456-7890
- Langsung ke sekretariat masjid

Kami mengharapkan kehadiran Bapak/Ibu/Saudara untuk bersama-sama menimba ilmu dan mempererat silaturahmi.

*Wallahu a'lam bishawab*
    `,
    status: 'published',
    featuredImage: null,
    author: 'Admin Masjid',
    createdAt: '2025-11-24',
    updatedAt: '2025-11-25',
    views: 1250
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/berita"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {berita.category}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Published
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{berita.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/admin/berita/${params.id}/edit`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Image className="w-20 h-20 text-gray-400" />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-green-500 pl-4">
              {berita.excerpt}
            </p>
            <div className="prose prose-green max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {berita.content}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistik</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600">Views</span>
                </div>
                <span className="font-bold text-gray-900">{berita.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Penulis</p>
                  <p className="text-sm font-medium text-gray-900">{berita.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Dibuat</p>
                  <p className="text-sm font-medium text-gray-900">{berita.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terakhir Diupdate</p>
                  <p className="text-sm font-medium text-gray-900">{berita.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi</h3>
            <div className="space-y-3">
              <Link
                href={`/news/${params.id}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition"
              >
                <Eye className="w-4 h-4" />
                Lihat di Website
              </Link>
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl font-medium hover:bg-yellow-100 transition">
                Ubah ke Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
