# 📊 Presentasi Proyek Dashboard Keuangan Masjid Syamsul 'Ulum

## Telkom University - Semester 7

### Tugas Akhir Pengembangan Teknologi Informasi (PTI)

---

## 📌 Slide 1: Halaman Judul

**DASHBOARD KEUANGAN MASJID SYAMSUL 'ULUM**

Sistem Informasi Pengelolaan Keuangan Masjid Berbasis Web

**Tim Pengembang:**

- Rifqi Sigwan Nugraha (1303223004) - Ketua
- Davin Verrellius (1303223031)
- Aldi Satria Hidayatullah (1303223056)
- Anju Manginar Angelo Sitanggang (1303223065)
- Rama Aulia Ramadan

**Telkom University - 2025**

---

## 📌 Slide 2: Latar Belakang

### Permasalahan:

- Pencatatan keuangan masjid masih dilakukan secara manual
- Sulit melacak pemasukan dan pengeluaran secara real-time
- Transparansi keuangan kepada jamaah kurang optimal
- Tidak ada sistem terpusat untuk mengelola program donasi

### Solusi:

Membangun **Dashboard Digital** untuk mengelola keuangan masjid secara transparan, efisien, dan modern.

---

## 📌 Slide 3: Tujuan Proyek

1. **Digitalisasi** pencatatan keuangan masjid
2. **Meningkatkan transparansi** laporan keuangan kepada jamaah
3. **Mempermudah pengelolaan** pemasukan & pengeluaran
4. **Menyediakan dashboard real-time** untuk monitoring keuangan
5. **Mendukung program donasi** (Infak, Zakat, Wakaf)
6. **Menyediakan platform berita** untuk kegiatan masjid

---

## 📌 Slide 4: Tech Stack

### 🔧 Backend:

| Teknologi         | Fungsi                |
| ----------------- | --------------------- |
| Next.js 14        | Framework utama       |
| TypeScript        | Type-safe development |
| Prisma ORM        | Database access       |
| PostgreSQL        | Database              |
| NextAuth.js + JWT | Authentication        |
| Zod               | Validation            |
| Winston           | Logging               |

### 🎨 Frontend:

| Teknologi    | Fungsi                |
| ------------ | --------------------- |
| Next.js 14   | Framework utama       |
| TypeScript   | Type-safe development |
| Tailwind CSS | Styling               |
| Recharts     | Data visualization    |
| Zustand      | State management      |
| React Query  | Server state          |

---

## 📌 Slide 5: Arsitektur Sistem

### MVC Pattern + Full-Stack Architecture

```
┌─────────────────┐       ┌─────────────────┐
│    FRONTEND     │◄─────►│     BACKEND     │
│   (Port 3001)   │  API  │   (Port 3000)   │
│   Next.js 14    │ REST  │   Next.js 14    │
└─────────────────┘       └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   PostgreSQL    │
                          │   (Supabase)    │
                          └─────────────────┘
```

### Struktur Backend:

- **Controllers** → Handle HTTP requests
- **Services** → Business logic layer
- **Repositories** → Data access layer
- **Middleware** → Auth & validation

---

## 📌 Slide 6: Fitur Utama (1/2)

### 🏠 Halaman Publik:

**1. Dashboard Homepage**

- Statistik keuangan real-time
- Total pemasukan & pengeluaran
- Saldo tersedia
- Jumlah transaksi

**2. Program Donasi**

- Infak, Zakat, Wakaf
- Progress bar target donasi
- Kategori program

**3. Laporan Keuangan**

- Riwayat transaksi publik
- Filter berdasarkan kategori
- Pagination

**4. Berita & Artikel**

- Kabar kegiatan masjid
- Kategori berita

---

## 📌 Slide 7: Fitur Utama (2/2)

### 🔐 Panel Admin:

**1. Dashboard Admin**

- Overview statistik lengkap
- Chart visualisasi data

**2. Manajemen Transaksi**

- CRUD pemasukan & pengeluaran
- Filter dan pencarian
- Export laporan

**3. Manajemen Program**

- Kelola program donasi
- Set target dan deadline

**4. Manajemen Berita**

- CRUD artikel dan berita
- Editor konten

**5. Authentication**

- Login dengan JWT
- Role-based access control

---

## 📌 Slide 8: API Endpoints

### 22+ REST API Endpoints:

| Kategori         | Endpoints                                             |
| ---------------- | ----------------------------------------------------- |
| **Auth**         | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| **Dashboard**    | `/api/dashboard/stats`                                |
| **Programs**     | `/api/programs` (CRUD)                                |
| **Transactions** | `/api/transactions` (CRUD)                            |
| **News**         | `/api/news` (CRUD)                                    |
| **Categories**   | `/api/categories`                                     |
| **Admin**        | `/api/admin/*` (Protected routes)                     |

### Response Format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "pagination": { "page": 1, "limit": 10, "total": 100 }
}
```

---

## 📌 Slide 9: Database Schema

### Entity Relationship:

```
┌────────────┐     ┌─────────────────┐     ┌────────────┐
│   Users    │     │   Transactions  │     │ Categories │
├────────────┤     ├─────────────────┤     ├────────────┤
│ id         │     │ id              │     │ id         │
│ email      │     │ type (IN/OUT)   │     │ name       │
│ password   │     │ amount          │     │ type       │
│ role       │────►│ categoryId      │◄────│            │
│ name       │     │ description     │     └────────────┘
└────────────┘     │ date            │
                   └─────────────────┘

┌────────────┐     ┌────────────┐
│  Programs  │     │    News    │
├────────────┤     ├────────────┤
│ id         │     │ id         │
│ title      │     │ title      │
│ target     │     │ slug       │
│ collected  │     │ content    │
│ deadline   │     │ category   │
│ featured   │     │ publishedAt│
└────────────┘     └────────────┘
```

---

## 📌 Slide 10: UI/UX Design

### Prinsip Desain:

- **Modern & Clean** - Gradient, shadow, rounded corners
- **Responsive** - Mobile-first approach
- **Consistent** - Green theme matching Islamic identity
- **Intuitive** - Easy navigation

### Screenshot Komponen:

1. **Hero Carousel** - Banner promosi program
2. **Stats Cards** - Kartu statistik dengan icon
3. **Program Cards** - Progress bar donasi
4. **Transaction List** - Riwayat transaksi
5. **Admin Sidebar** - Navigasi panel admin
6. **CRUD Forms** - Form input data

### Color Palette:

- Primary: `#22C55E` (Green)
- Secondary: `#3B82F6` (Blue)
- Accent: `#F97316` (Orange)
- Background: `#F9FAFB` (Gray)

---

## 📌 Slide 11: Demo Aplikasi

### 🌐 Akses Aplikasi:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000/api

### 📱 Halaman yang Tersedia:

**Publik:**

- `/` - Homepage dengan dashboard
- `/programs` - Daftar program donasi
- `/laporan` - Laporan keuangan publik
- `/news` - Berita dan artikel
- `/about` - Tentang masjid

**Admin:**

- `/admin` - Dashboard admin
- `/admin/laporan` - Kelola transaksi
- `/admin/berita` - Kelola berita
- `/admin/artikel` - Kelola artikel
- `/admin/login` - Halaman login

---

## 📌 Slide 12: Kesimpulan & Pengembangan Selanjutnya

### ✅ Hasil yang Dicapai:

- Dashboard keuangan real-time
- Sistem CRUD lengkap untuk transaksi
- Panel admin dengan autentikasi
- API backend dengan 22+ endpoints
- UI/UX modern dan responsive

### 🚀 Pengembangan Selanjutnya:

1. Payment gateway integration
2. Mobile app (React Native)
3. Export laporan PDF/Excel
4. Notifikasi push
5. Multi-bahasa support
6. Analytics & reporting advanced

---

## 📌 Slide 13: Terima Kasih

### 🙏 Dashboard Keuangan Masjid Syamsul 'Ulum

**"Transparansi Keuangan untuk Kepercayaan Umat"**

---

**Repository:** github.com/karuqii9704/protein_RADAR

**Teknologi:** Next.js • TypeScript • Prisma • PostgreSQL • Tailwind CSS

---

_Proyek Tugas Akhir PTI - Semester 7_
_Telkom University © 2025_

---

## 📌 Slide 14: Sesi Tanya Jawab

### Q&A

**Silakan ajukan pertanyaan!**

---

### Tim Pengembang:

- Rifqi Sigwan Nugraha (Ketua)
- Davin Verrellius
- Aldi Satria Hidayatullah
- Anju Manginar Angelo Sitanggang
- Rama Aulia Ramadan
