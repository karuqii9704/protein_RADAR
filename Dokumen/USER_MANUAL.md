# 📖 User Manual - Dashboard Keuangan Masjid Syamsul 'Ulum

**Versi:** 1.0  
**Tanggal:** 7 Januari 2026  
**Website:** https://protein-radar-f1b2.vercel.app

---

## 📋 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Akses Website](#akses-website)
3. [Halaman Publik](#halaman-publik)
   - [Beranda](#1-beranda)
   - [Laporan Keuangan](#2-laporan-keuangan)
   - [Program Donasi](#3-program-donasi)
   - [Berita](#4-berita)
   - [Tentang](#5-tentang)
4. [Cara Berdonasi](#cara-berdonasi)
5. [Panel Admin](#panel-admin)
   - [Login Admin](#login-admin)
   - [Dashboard Admin](#dashboard-admin)
   - [Manajemen Transaksi](#manajemen-transaksi)
   - [Manajemen Program](#manajemen-program)
   - [Manajemen Berita](#manajemen-berita)
   - [Manajemen Donasi](#manajemen-donasi)
   - [Manajemen Slide](#manajemen-slide)
   - [Manajemen User](#manajemen-user)
6. [FAQ](#faq)
7. [Kontak](#kontak)

---

## Pendahuluan

Dashboard Keuangan Masjid Syamsul 'Ulum adalah sistem informasi berbasis web untuk mengelola dan menampilkan transparansi keuangan masjid. Sistem ini dibangun untuk memudahkan jamaah melihat laporan keuangan, berdonasi, dan mengikuti perkembangan kegiatan masjid.

**Fitur Utama:**
- ✅ Dashboard keuangan real-time
- ✅ Laporan pemasukan & pengeluaran transparan
- ✅ Program donasi online (Infak, Zakat, Wakaf)
- ✅ Berita & kabar kegiatan masjid
- ✅ Panel admin untuk pengelolaan data

---

## Akses Website

**Website Publik:** https://protein-radar-f1b2.vercel.app

**Kompatibilitas Browser:**
- Google Chrome (direkomendasikan)
- Mozilla Firefox
- Microsoft Edge
- Safari

---

## Halaman Publik

### 1. Beranda

Halaman utama menampilkan ringkasan informasi masjid.

**Komponen:**

| Section | Deskripsi |
|---------|-----------|
| **Header** | Logo masjid, menu navigasi (Beranda, Laporan, Program, Berita, Tentang), tombol login admin |
| **Hero Banner** | Gambar masjid dengan ajakan "Mari Berdonasi" |
| **Menu Prioritas** | Icon shortcuts: Operasional, Renovasi, Santunan, Pendidikan, Infak Quran, Kegiatan, Lainnya |
| **Ringkasan Keuangan** | 4 kartu: Total Pemasukan, Total Pengeluaran, Saldo Tersedia, Total Transaksi |
| **Program Unggulan** | Daftar program donasi aktif dengan progress bar |
| **Transaksi Terbaru** | Daftar donasi terbaru dengan status |
| **Footer** | Alamat, kontak, sosial media, copyright |

**Navigasi:**
- Klik menu di header untuk berpindah halaman
- Klik tombol "Donasi" pada program untuk berdonasi
- Klik icon user (kanan atas) untuk masuk ke panel admin

---

### 2. Laporan Keuangan

**URL:** `/laporan`

Halaman transparansi keuangan dengan fitur:

**Ringkasan Keuangan:**
- **Total Pemasukan** - Jumlah dana masuk periode terpilih
- **Total Pengeluaran** - Jumlah dana keluar periode terpilih
- **Saldo** - Selisih pemasukan dan pengeluaran

**Filter & Kontrol:**
- Pilihan bulan dan tahun
- Tombol sortir (terbaru/terlama)
- Pagination (item per halaman)

**Visualisasi:**
- Grafik perbandingan 6 bulan terakhir
- Diagram kategori pemasukan & pengeluaran
- Tabel daftar transaksi detail

---

### 3. Program Donasi

**URL:** `/programs`

Menampilkan semua program donasi yang sedang berjalan.

**Informasi per Program:**
| Field | Keterangan |
|-------|------------|
| Judul | Nama program donasi |
| Deskripsi | Penjelasan singkat tujuan program |
| Target | Nominal dana yang dibutuhkan |
| Terkumpul | Jumlah yang sudah terkumpul |
| Progress | Persentase pencapaian (progress bar) |
| Donatur | Jumlah orang yang sudah berdonasi |
| Batas Waktu | Sisa hari untuk mencapai target |
| Tag | Label "Unggulan" untuk program prioritas |

**Aksi:**
- Klik kartu program untuk melihat detail
- Klik tombol **"Donasi"** untuk langsung berdonasi

---

### 4. Berita

**URL:** `/news`

Menampilkan berita dan kabar kegiatan masjid.

**Filter Kategori:**
- **Semua** - Tampilkan semua berita
- **Kegiatan** - Berita kegiatan masjid
- **Pengumuman** - Pengumuman penting
- **Artikel** - Tulisan islami/kajian
- **Laporan** - Laporan keuangan bulanan

**Informasi per Berita:**
- Gambar thumbnail
- Kategori (badge warna)
- Judul artikel
- Ringkasan/excerpt
- Tanggal publikasi
- Jumlah views

**Fitur Unduh Lampiran:**
Berita kategori **LAPORAN** dapat menyertakan lampiran file (PDF/Excel) yang bisa diunduh oleh pembaca.

---

### 5. Tentang

**URL:** `/about`

Informasi tentang Masjid Syamsul 'Ulum:
- Sejarah dan profil masjid
- Kapasitas jamaah (2000+ orang)
- Layanan: Shalat 5 waktu, Jumat, kajian rutin, program sosial
- Logo dan identitas masjid
- Komitmen transparansi pengelolaan dana

---

## Cara Berdonasi

### Langkah-langkah:

1. **Pilih Program**
   - Dari halaman Beranda atau Program, klik tombol **"Donasi"** pada program yang diinginkan

2. **Isi Form Donasi**
   - **Nominal Donasi** (wajib) - Minimal Rp 1.000
   - Gunakan tombol shortcut: 10rb, 25rb, 50rb, 100rb, 250rb, 500rb
   - **Nama** (opsional) - atau centang "Donasi sebagai Anonim"
   - **Email** (opsional)
   - **No. HP** (opsional)
   - **Pesan/Doa** (opsional)

3. **Scan QRIS**
   - Scan kode QRIS yang ditampilkan menggunakan aplikasi e-wallet atau mobile banking

4. **Upload Bukti Pembayaran**
   - Klik area upload
   - Pilih file screenshot bukti transfer
   - Format: JPG, PNG, atau PDF (max 5MB)

5. **Kirim Donasi**
   - Klik tombol **"Kirim Donasi"**
   - Tunggu konfirmasi sukses

6. **Verifikasi**
   - Tim admin akan memverifikasi dalam 1x24 jam
   - Status donasi: PENDING → VERIFIED

---

## Panel Admin

### Login Admin

**URL:** `/admin/login`

**Cara Login:**
1. Buka halaman login admin
2. Masukkan **Email** yang terdaftar
3. Masukkan **Password**
4. (Opsional) Centang "Ingat saya"
5. Klik **"Masuk ke Dashboard"**

**Role User:**
| Role | Akses |
|------|-------|
| Super Admin | Semua fitur + manajemen user |
| Admin | Semua fitur kecuali manajemen user |
| Viewer | Hanya melihat laporan (read-only) |

---

### Dashboard Admin

**URL:** `/admin`

Tampilan ringkasan untuk admin:
- Statistik keuangan bulan ini
- Grafik pemasukan vs pengeluaran
- Daftar transaksi pending
- Shortcut ke modul lain

---

### Manajemen Transaksi

**URL:** `/admin/laporan`

**Fitur:**
- Lihat semua transaksi (pemasukan & pengeluaran)
- Filter berdasarkan tipe, kategori, tanggal
- Tambah transaksi baru
- Edit/Hapus transaksi
- Export laporan

**Tambah Transaksi:**
1. Klik tombol **"Tambah Transaksi"**
2. Pilih tipe: Pemasukan atau Pengeluaran
3. Isi detail: nominal, deskripsi, kategori, tanggal
4. Simpan

---

### Manajemen Program

**URL:** `/admin/program`

**Fitur:**
- Lihat daftar program donasi
- Tambah program baru
- Edit program existing
- Aktifkan/nonaktifkan program
- Set program sebagai unggulan

**Tambah Program Baru:**
1. Klik **"Tambah Program"**
2. Isi form:
   - **Judul** (wajib)
   - **Deskripsi** (wajib)
   - **Target Dana** (wajib)
   - **Gambar** - Upload atau URL
   - **QRIS** - Upload QRIS khusus program (opsional)
   - **Tanggal Mulai & Berakhir**
   - **Status Aktif** dan **Unggulan**
3. Klik **"Simpan"**

---

### Manajemen Berita

**URL:** `/admin/berita`

**Fitur:**
- Lihat semua berita (termasuk draft)
- Filter berdasarkan kategori dan status
- Tambah berita baru
- Edit/Hapus berita
- Publikasi/Unpublish

**Tambah Berita Baru:**
1. Klik **"Tambah Berita"**
2. Isi form:
   - **Judul** (wajib)
   - **Kategori** (wajib): Kegiatan, Pengumuman, Artikel, Laporan
   - **Ringkasan** - Teks preview
   - **Konten** - Isi lengkap (mendukung Markdown)
   - **Gambar Utama** - Upload atau URL
   - **Lampiran File** - Upload PDF/Excel/Word (opsional, untuk laporan)
3. Pilih: **"Simpan Draft"** atau **"Publikasikan"**

---

### Manajemen Donasi

**URL:** `/admin/donasi`

**Fitur:**
- Lihat semua donasi masuk
- Filter berdasarkan status (Pending, Verified, Cancelled)
- Verifikasi donasi
- Tolak donasi dengan alasan
- Lihat bukti pembayaran

**Proses Verifikasi:**
1. Buka donasi dengan status PENDING
2. Cek bukti pembayaran yang diupload
3. Jika valid: Klik **"Verifikasi"**
4. Jika tidak valid: Klik **"Tolak"** dan isi alasan

---

### Manajemen Slide

**URL:** `/admin/slides`

Kelola banner carousel di homepage:
- Tambah slide baru
- Upload gambar banner
- Set urutan tampil
- Aktifkan/nonaktifkan slide

---

### Manajemen User

**URL:** `/admin/users` (Khusus Super Admin)

**Fitur:**
- Lihat daftar user/admin
- Tambah user baru
- Edit role user
- Nonaktifkan user

---

## FAQ

### 1. Bagaimana cara mendaftar sebagai admin?
Hubungi Super Admin masjid untuk didaftarkan sebagai admin.

### 2. Apakah donasi saya aman?
Ya, semua donasi menggunakan QRIS resmi dan diverifikasi oleh tim admin.

### 3. Berapa lama proses verifikasi donasi?
Maksimal 1x24 jam kerja.

### 4. Apakah saya bisa donasi anonim?
Ya, centang opsi "Donasi sebagai Anonim (Hamba Allah)" saat mengisi form.

### 5. Format file apa saja yang bisa diupload?
- Bukti pembayaran: JPG, PNG, PDF (max 5MB)
- Lampiran berita: PDF, Excel, Word (max 10MB)

### 6. Bagaimana jika lupa password admin?
Hubungi Super Admin untuk reset password.

---

## Kontak

**Masjid Syamsul 'Ulum Telkom University**

📍 **Alamat:**  
Jl. Telekomunikasi No. 1, Terusan Buahbatu  
Bandung, Jawa Barat 40257

📞 **Telepon:** (022) 756-4108

📧 **Email:** masjidsyamsululum@telkomuniversity.ac.id

🌐 **Website:** https://protein-radar-f1b2.vercel.app

**Sosial Media:**
- Instagram: @masjidsyamsululum
- Facebook: Masjid Syamsul 'Ulum
- Twitter: @masjidsulum

---

**© 2026 Masjid Syamsul 'Ulum Telkom University. All rights reserved.**

*Dokumen ini dibuat sebagai panduan penggunaan Dashboard Keuangan Masjid Syamsul 'Ulum.*
