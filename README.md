# SmartComplaint — Pesona Serpong Residential Ecosystem

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19.3-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Supabase Backend](https://img.shields.io/badge/Supabase-Enabled-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#license)

---

## Nama Project

**SmartComplaint** — Platform Pengaduan Warga Perumahan Pesona Serpong

---

## Deskripsi Singkat

SmartComplaint menjembatani kesenjangan komunikasi antara warga, petugas lingkungan (RT/RW), dan administrator perumahan. Warga dapat mengirim laporan berbasis lokasi dengan foto, melacak status secara real-time (Pending → Diproses → Selesai), dan menerima pengumuman resmi dari pengurus — semua dalam satu platform yang modern, responsif, dan aman.

---

## Problem yang Diselesaikan

1. **Komunikasi Tersebar** — Laporan di grup WhatsApp cepat tertimbun obrolan lain, menyebabkan banyak keluhan terlewat dan tidak tertangani.
2. **Tidak Ada Transparansi** — Warga melapor tapi tidak bisa melihat apakah laporannya diterima, diproses, atau sudah selesai.
3. **Tidak Ada Riwayat Terpusat** — Pengurus RT/RW tidak memiliki catatan historis keluhan untuk evaluasi dan pengambilan keputusan.
4. **Koordinasi Manual** — Memilah laporan berdasarkan kategori (Keamanan, Kebersihan, Fasilitas) dan prioritas (Urgent/Normal) secara manual rentan salah dan memakan waktu.

SmartComplaint menyediakan **command center terpadu** di mana setiap laporan terkategori, terprioritaskan, terlacak statusnya, dan disertai thread tanggapan resmi dari petugas.

---

## Fitur Utama

### 1. Laporan Warga dengan Geolokasi & Foto
- Input detail RT/RW, alamat, dan titik koordinat.
- Upload foto kejadian didukung Supabase Storage.
- Toggle urgensi untuk laporan darurat.

### 2. Siklus Hidup Status & Tanggapan
- Status: `PENDING` → `PROCESSING` → `COMPLETED`.
- Petugas bisa menambahkan tanggapan, mengupload foto penyelesaian, dan mengubah status.
- Warga bisa mengedit atau menarik laporan yang masih berstatus PENDING.

### 3. Eskalasi SLA Otomatis
- Sistem otomatis menaikkan level eskalasi (24h/48h/72h) jika laporan tidak ditangani sesuai SLA.
- Admin mendapat notifikasi jika laporan sudah 48 jam tanpa tanggapan.

### 4. Pengumuman Resmi
- Admin dapat menerbitkan, mengedit, dan menghapus pengumuman.
- Pengumuman muncul di dashboard seluruh warga.

### 5. Keamanan Role-Based (RBAC)
- **Warga (Masyarakat)**: Buat, edit, lacak laporan pribadi.
- **Petugas**: Review semua laporan, beri tanggapan, ubah status.
- **Admin**: Verifikasi akun, kelola role pengguna, audit, hapus konten.

### 6. Dashboard Statistik & Peta
- Grafik status, distribusi per RT, dan peta sebaran laporan interaktif.
- KPI: Total laporan, tingkat penyelesaian, response time.

### 7. Ekspor Data
- Unduh laporan dalam format PDF (ringkasan eksekutif), CSV, dan XLSX.
- Limit paginasi (max 5000 record) untuk keamanan.

### 8. Cetak Tanda Terima
- Setiap laporan bisa dicetak sebagai bukti tanda terima resmi.

---

## Kelebihan & Kekurangan

### Kelebihan
- **Performa Tinggi**: Server Actions + Prisma select minimal → query database efisien, N+1 hampir tidak ada.
- **Keamanan**: RBAC ketat, validasi server-side, header keamanan (CSP, HSTS), proteksi IP spoofing, tidak ada stack trace bocor ke client.
- **UI/UX Premium**: Desain terinspirasi Wise (TransferWise), dark mode, mikro-animasi, responsif di semua perangkat.
- **Code Quality**: TypeScript strict, lint ketat, zero ESLint errors, reusable components (ConfirmModal, MobileBottomNav).
- **CI/CD**: GitHub Actions dengan secret scanning + npm audit.

### Kekurangan
- **Belum Ada Real-time**: Notifikasi dan update status masih refresh-based (belum WebSocket/SSE).
- **Mobile App**: Belum ada versi native Android/iOS (hanya PWA-compatible web).
- **Multi-Bahasa**: Hanya mendukung Bahasa Indonesia untuk saat ini.
- **Ketergantungan Eksternal**: Membutuhkan Supabase (Auth + Storage) dan koneksi internet aktif.

---

## Tech Stack

| Teknologi | Peran | Alasan |
|:---|:---|:---|
| **Next.js 16 (App Router)** | Framework | SSR optimal, Server Actions bawaan, routing intuitif, build size kecil. |
| **React 19** | Frontend Engine | Concurrent rendering, form native state, ekosistem luas. |
| **Tailwind CSS v4** | Styling | Utility-first, kustomisasi desain cepat, bundle kecil. |
| **Supabase (Auth + Storage)** | Keamanan & Media | Auth JWT built-in, storage terenkripsi, integrasi mudah dengan Next.js. |
| **Prisma ORM** | Database | Type-safe query, migrasi mudah, dukungan PostgreSQL penuh. |
| **PostgreSQL** | Database | Reliabel, transaksional, performa index lookup tinggi. |
| **Lucide React** | Ikon | Ringan, modern, aksesibel. |
| **PDFKit** | Generate PDF | Library PDF server-side yang stabil dan ringan. |
| **xlsx** | Generate XLSX | Membuat file Excel tanpa dependency berat. |

---

## Cara Install / Run

### Prasyarat
- Node.js v18+
- npm atau yarn
- Database PostgreSQL (via Supabase atau lokal)
- Project Supabase (Auth + Storage bucket `complaints`)

### Langkah-Langkah

```bash
# 1. Clone repositori
git clone https://github.com/WahyutegarNugroho/smart-complaint.git
cd smart-complaint

# 2. Install dependencies
npm install

# 3. Buat file .env
# Salin dari .env.example dan isi konfigurasi:
#   DATABASE_URL, DIRECT_URL (PostgreSQL)
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase)
#   CRON_SECRET (untuk endpoint cron eskalasi)
cp .env.example .env

# 4. Inisialisasi database
npx prisma db push
npx prisma generate

# 5. Jalankan development server
npm run dev
# Buka http://localhost:3000

# Build untuk production
npm run build
npm start
```

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Cron (untuk endpoint /api/cron/escalate)
CRON_SECRET="your-cron-secret"

# App URL (untuk redirect setelah reset password)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Lisensi

**MIT License** — © 2026 whtsn dev.
