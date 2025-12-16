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
  BookOpen
} from 'lucide-react';

export default function ArtikelDetailPage({ params }: { params: { id: string } }) {
  // Mock data
  const artikel = {
    id: params.id,
    title: 'Keutamaan Sholat Berjamaah di Masjid',
    category: 'Ibadah',
    author: 'Ustadz Ahmad',
    excerpt: 'Sholat berjamaah di masjid memiliki keutamaan 27 derajat lebih tinggi dari sholat sendiri. Mari kita pelajari lebih dalam tentang keutamaan ini.',
    content: `
## Pendahuluan

Sholat adalah tiang agama dan merupakan ibadah yang paling utama dalam Islam. Rasulullah SAW bersabda bahwa sholat berjamaah memiliki keutamaan 27 derajat lebih tinggi dibandingkan sholat sendirian.

## Dalil Keutamaan Sholat Berjamaah

Dari Abdullah bin Umar radhiyallahu 'anhuma, Rasulullah shallallahu 'alaihi wa sallam bersabda:

> "Sholat berjamaah lebih utama dari sholat sendirian dengan dua puluh tujuh derajat." (HR. Bukhari dan Muslim)

## Keutamaan Sholat Berjamaah

### 1. Pahala yang Berlipat Ganda
Sebagaimana hadits di atas, sholat berjamaah mendapatkan pahala 27 kali lipat dibanding sholat sendiri.

### 2. Terhindar dari Sifat Munafik
Rasulullah SAW bersabda bahwa orang yang meninggalkan sholat jamaah tanpa udzur maka ia memiliki sifat munafik.

### 3. Mendapat Perlindungan Allah
Orang yang pergi ke masjid dalam keadaan gelap, maka Allah akan memberikan cahaya yang sempurna di hari kiamat.

### 4. Menghapus Dosa dan Mengangkat Derajat
Setiap langkah menuju masjid akan menghapus satu dosa dan mengangkat satu derajat.

### 5. Memperkuat Ukhuwah Islamiyah
Sholat berjamaah mempererat hubungan antar sesama muslim.

## Adab Sholat Berjamaah

1. **Datang lebih awal** ke masjid
2. **Merapatkan shaf** dan meluruskannya
3. **Tidak mendahului imam** dalam gerakan sholat
4. **Khusyu' dan tuma'ninah** dalam sholat
5. **Berdzikir setelah sholat** bersama jamaah

## Penutup

Mari kita tingkatkan semangat untuk sholat berjamaah di masjid. Selain mendapat pahala yang berlipat ganda, kita juga bisa mempererat silaturahmi dengan sesama muslim.

*Wallahu a'lam bishawab*
    `,
    status: 'published',
    createdAt: '2025-11-24',
    updatedAt: '2025-11-25',
    readTime: '5 min',
    views: 892
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/artikel"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {artikel.category}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Published
              </span>
              <span className="text-xs text-gray-500">• {artikel.readTime} read</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{artikel.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/admin/artikel/${params.id}/edit`}
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
          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {artikel.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{artikel.author}</p>
                <p className="text-sm text-gray-500">{artikel.createdAt} • {artikel.readTime} read</p>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 mb-6 italic border-l-4 border-green-500 pl-4">
              {artikel.excerpt}
            </p>

            {/* Content */}
            <div className="prose prose-green max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {artikel.content}
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
                <span className="font-bold text-gray-900">{artikel.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">Read Time</span>
                </div>
                <span className="font-bold text-gray-900">{artikel.readTime}</span>
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
                  <p className="text-sm font-medium text-gray-900">{artikel.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="text-sm font-medium text-gray-900">{artikel.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Dibuat</p>
                  <p className="text-sm font-medium text-gray-900">{artikel.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terakhir Diupdate</p>
                  <p className="text-sm font-medium text-gray-900">{artikel.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi</h3>
            <div className="space-y-3">
              <Link
                href={`/artikel/${params.id}`}
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
