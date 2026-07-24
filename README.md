# SmartComplaint — Pesona Serpong Residential Ecosystem

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19.3-2d3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Supabase Backend](https://img.shields.io/badge/Supabase-Enabled-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.10-6b9f3c?style=for-the-badge&logo=vitest)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#license)

---

## Nama Project

**SmartComplaint** — Platform Pengaduan Warga Perumahan Pesona Serpong

---

## Deskripsi Singkat

SmartComplaint menjembatani kesenjangan komunikasi antara warga, petugas lingkungan (RT/RW), dan administrator perumahan. Warga dapat mengirim laporan berbasis lokasi dengan foto, melacak status secara real-time (Pending → Diproses → Selesai), dan menerima pengumuman resmi dari pengurus — semua dalam satu platform yang modern, responsif, aman, dan terinstall sebagai PWA.

---

## Problem yang Diselesaikan

1. **Komunikasi Tersebar** — Laporan di grup WhatsApp cepat tertimbun obrolan lain, menyebabkan banyak keluhan terlewat dan tidak tertangani.
2. **Tidak Ada Transparansi** — Warga melapor tapi tidak bisa melihat apakah laporannya diterima, diproses, atau sudah selesai.
3. **Tidak Ada Riwayat Terpusat** — Pengurus RT/RW tidak memiliki catatan historis keluhan untuk evaluasi dan pengambilan keputusan.
4. **Koordinasi Manual** — Memilah laporan berdasarkan kategori (Keamanan, Kebersihan, Fasilitas, Umum) dan prioritas (Urgent/Normal) secara manual rentan salah dan memakan waktu.

SmartComplaint menyediakan **command center terpadu** di mana setiap laporan terkategori, terprioritaskan, terlacak statusnya, dan disertai thread tanggapan resmi dari petugas.

---

## Fitur Utama

### 1. Sistem Authentication & Keamanan
- Registrasi dengan email + verifikasi akun (email confirmation flow).
- Login dengan proteksi **IP-based rate limiting** (max 5 percobaan, lockout 60 detik).
- **Lupa Password / Reset Password** via email (Supabase Auth).
- Sesi aman dengan JWT + cookie HTTP-only via Supabase SSR.
- RBAC ketat: **Warga (Masyarakat)**, **Petugas**, **Admin** — setiap aksi divalidasi server-side.

### 2. Manajemen Laporan Warga
- Input detail RT/RW, alamat, dan titik koordinat (geolokasi + Leaflet map picker).
- Upload foto kejadian (JPEG/PNG/WebP/GIF, max 5MB) ke Supabase Storage.
- Toggle urgensi untuk laporan darurat.
- **Hierarchical Category**: Pilih kategori induk dan sub-kategori (Keamanan → Curanmor, Kebersihan → Sampah Liar, dll).
- **Advanced Filtering**: Filter by status, teks, RT, RW, kategori, rentang tanggal, page size (12/24/48).
- Riwayat lengkap dengan timeline tanggapan petugas.

### 3. Siklus Hidup Status & Tanggapan
- Status: `PENDING` → `PROCESSING` → `COMPLETED`.
- Petugas bisa menambahkan tanggapan, mengupload foto penyelesaian, dan mengubah status.
- Warga bisa mengedit atau menarik laporan yang masih berstatus PENDING (halaman edit + tombol hapus).
- Admin dapat menghapus laporan dengan audit trail (notifikasi DELETE ke warga terkait).
- Petugas dapat mengupload foto pada tanggapan (ResponseFileHandler).
- Setiap laporan memiliki tombol cetak tanda terima (PDF receipt).
- Toggle urgensi oleh petugas.
- Notifikasi otomatis ke pembuat laporan saat ada perubahan status atau tanggapan baru.

### 4. Eskalasi SLA Otomatis
- Sistem otomatis menaikkan level eskalasi berdasarkan aturan SLA yang dapat dikonfigurasi:
  - **LEVEL_1**: 24 jam di PENDING.
  - **LEVEL_2**: 48 jam di PENDING (notifikasi ke semua admin).
  - **LEVEL_3**: 72 jam di PROCESSING.
- Riwayat eskalasi lengkap dengan log (EscalationLog).
- Eskalasi otomatis di-reset ke `NONE` saat laporan ditangani (perubahan status atau tanggapan baru).
- Cron endpoint aman dengan `CRON_SECRET` (Bearer token).

### 5. Sistem Pengumuman Resmi
- Admin dapat membuat, mengedit, dan menghapus pengumuman.
- 6 kategori pengumuman: umum, kegiatan, darurat, kebersihan, kesehatan, keagamaan.
- Tampilan arsip dengan pagination.
- Pengumuman muncul di dashboard seluruh warga.
- Pengumuman kegiatan otomatis tampil di halaman **Agenda**.

### 6. Sistem Notifikasi In-App
- Notifikasi persisten berbasis database dengan tipe `INFO`, `WARNING`, `DELETE`.
- **Polling real-time** setiap 30 detik dari NotificationDropdown.
- Badge jumlah notifikasi belum dibaca.
- Mark as read (single atau semua).
- Notifikasi otomatis pada: perubahan status, tanggapan baru, eskalasi, penghapusan laporan oleh admin.

### 7. Dashboard & Navigasi Berbasis Role
- **Warga**: Beranda (statistik pribadi), Peta, Lapor Masalah, Aduan Saya, Pengaturan Profil.
- **Petugas**: Monitor semua laporan, Peta, Tugas, Proses, Profil.
- **Admin**: Stats (analitik lengkap — `/dashboard/admin/stats`), Peta, Manajemen Warga, Manajemen Pengumuman, Audit Log, Export.
- **Desktop Sidebar** + **Mobile Bottom Navigation** yang adaptif per role.
- Navigasi dengan shortcut keyboard (skip-to-content link).

### 8. Dashboard Statistik & Peta Interaktif
- **Grafik distribusi status** (bar chart) — real-time dari database.
- **Grafik per-RT** — distribusi laporan berdasarkan RT.
- **7-day trend chart** — tren laporan 7 hari terakhir.
- **Map interaktif** dengan Leaflet + marker clustering (ribuan marker).
- Panel detail laporan saat marker diklik.
- **KPI Cards**: Total laporan, tingkat penyelesaian, response time rata-rata.

### 9. Manajemen Pengguna (Admin)
- Cari user by nama/username, filter by role/RT/RW.
- Ubah role pengguna, toggle verifikasi akun.
- Hapus akun (dengan audit log).
- Pagination (20 user per halaman).
- Banner peringatan untuk akun belum terverifikasi.

### 10. Audit Log (Aktivitas Admin)
- Mencatat semua aksi admin: `DELETE_REPORT`, `DELETE_USER`, `UPDATE_ROLE`, `VERIFY_USER`, `UPDATE_STATUS`.
- Filter berdasarkan jenis aksi.
- Pagination dengan riwayat lengkap.

### 11. Ekspor Data
- Unduh laporan dalam format **PDF** (ringkasan eksekutif via PDFKit), **CSV** (dengan proteksi CSV injection), dan **XLSX** (2 sheet: data + summary via exceljs).
- Limit paginasi (max 5000 record) untuk keamanan.
- Halaman ekspor khusus untuk Admin.

### 12. Cetak Tanda Terima
- Setiap laporan bisa dicetak sebagai bukti tanda terima resmi.

### 13. Halaman Informasi Publik
- **Darurat**: Kontak darurat (Pos Keamanan, Pemadam Kebakaran 113, Ambulans 118/119, Polisi 110) dengan tautan klik-untuk-telepon.
- **Keamanan**: Pos jaga (3 pos, 24h/18-06), jadwal ronda malam (22:00-05:00).
- **Agenda**: Kalender kegiatan dari pengumuman, filter 5 kategori.
- **Struktur Organisasi**: Bagan kepengurusan RW (Ketua RW, Sekretaris, Bendahara, Keamanan, Kebersihan, 3 Ketua RT).
- **Panduan**: Panduan penggunaan aplikasi langkah demi langkah.
- **Kebijakan Privasi**: Penjelasan pengumpulan, penggunaan, penyimpanan data, dan hak pengguna.
- **Kontak**: Email, telepon, alamat, jam operasional.
- **Alur Pengaduan**: Diagram alur 5 langkah (Kirim → Verifikasi → Ditinjau → Proses → Selesai).

### 14. PWA (Progressive Web App)
- **Service Worker** untuk caching aset statis dan fallback offline.
- **Manifest** (`display: standalone`, icons maskable, `orientation: portrait-primary`).
- **Halaman Offline** ("Koneksi Terputus" dengan tombol coba lagi).
- Mobile meta tags (`apple-mobile-web-app-capable`).
- Registrasi SW otomatis setelah halaman dimuat.

### 15. Komponen UI Reusable
- `ThemeToggle` — Toggle gelap/terang dengan deteksi preferensi sistem dan persistensi localStorage.
- `ConfirmModal` — Modal konfirmasi (danger/default variant) via Portal.
- `EmptyState` — Tampilan kosong dengan ikon dan pesan.
- `SubmitButton` — Tombol dengan indikator loading spinner.
- `SuccessToast` — Toast notifikasi sukses dengan animasi.
- `MobileBottomNav` — Navigasi bawah floating khusus mobile (3 varian role).
- `NotificationDropdown` — Dropdown notifikasi in-app dengan polling 30 detik dan badge unread count.

### 16. CI/CD & Quality Assurance
- **GitHub Actions CI**: `pnpm install` → `pnpm audit` (high severity) → secret scanning → `prisma generate` → `tsc --noEmit` → ESLint → `pnpm test`.
- **Vitest** untuk unit test (validasi input).
- **TypeScript strict** dengan zero toleransi error.
- **ESLint** konfigurasi ketat.
- **Patch-package** untuk patching dependencies.

---

## Tech Stack

| Teknologi | Peran | Alasan |
|:---|:---|:---|
| **Next.js 16 (App Router)** | Framework | SSR optimal, Server Actions bawaan, routing intuitif, build size kecil. |
| **React 19** | Frontend Engine | Concurrent rendering, form native state, ekosistem luas. |
| **TypeScript (Strict Mode)** | Bahasa | Type safety, self-documenting code, mencegah runtime error. |
| **Tailwind CSS v4** | Styling | Utility-first, kustomisasi desain cepat, bundle kecil. |
| **Supabase (Auth + Storage)** | Keamanan & Media | Auth JWT built-in, storage terenkripsi, integrasi mudah dengan Next.js. |
| **Prisma ORM** | Database | Type-safe query, migrasi mudah, dukungan PostgreSQL penuh. |
| **PostgreSQL** | Database | Reliabel, transaksional, performa index lookup tinggi. |
| **Leaflet + react-leaflet** | Peta Interaktif | Open-source, ringan, marker clustering (leaflet.markercluster). |
| **Lucide React** | Ikon | Ringan, modern, aksesibel. |
| **PDFKit** | Generate PDF | Library PDF server-side yang stabil dan ringan. |
| **exceljs** | Generate XLSX | Membuat file Excel dengan 2 sheet (data + ringkasan). |
| **Vitest** | Testing | Fast, compatible dengan Vite/Next.js, jsdom environment. |
| **patch-package** | Dependency Mgmt | Memperbaiki bug library tanpa menunggu maintainer. |

---

## Kelebihan & Kekurangan

### Kelebihan
- **Performa Tinggi**: Server Actions + Prisma select minimal → query database efisien, N+1 hampir tidak ada.
- **Keamanan**: RBAC ketat, validasi server-side, IP rate limiting, header keamanan (CSP, HSTS), proteksi CSV injection, proteksi IP spoofing, tidak ada stack trace bocor ke client.
- **UI/UX Premium**: Desain terinspirasi Wise (TransferWise), dark mode, mikro-animasi, PWA-ready, responsif di semua perangkat.
- **Code Quality**: TypeScript strict, lint ketat, zero ESLint errors, reusable components, CI pipeline.
- **Offline Support**: Service worker + halaman offline fallback.
- **Audit Trail**: Semua aksi admin tercatat untuk akuntabilitas.

### Kekurangan
- **Belum Ada Real-time**: Notifikasi dan update status masih polling-based (30 detik), belum WebSocket/SSE.
- **Mobile App**: Belum ada versi native Android/iOS (hanya PWA-compatible web).
- **Multi-Bahasa**: Hanya mendukung Bahasa Indonesia untuk saat ini.
- **Ketergantungan Eksternal**: Membutuhkan Supabase (Auth + Storage) dan koneksi internet aktif.

---

## Cara Install / Run

### Prasyarat
- Node.js v18+
- pnpm (recommended) atau npm
- Database PostgreSQL (via Supabase atau lokal)
- Project Supabase (Auth + Storage bucket `complaints`)

### Langkah-Langkah

```bash
# 1. Clone repositori
git clone https://github.com/WahyutegarNugroho/smart-complaint.git
cd smart-complaint

# 2. Install dependencies
pnpm install

# 3. Buat file .env
# Salin dari .env.example dan isi konfigurasi:
cp .env.example .env

# 4. Inisialisasi database
npx prisma db push
npx prisma generate

# 5. Jalankan development server
pnpm run dev
# Buka http://localhost:3000

# Build untuk production
pnpm run build
pnpm start
```

### Environment Variables (.env)

```env
# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# === DATABASE (Supabase Pooler) ===
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# === CRON ===
CRON_SECRET="your-random-cron-secret"

# === APP ===
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Scripts yang Tersedia

| Script | Deskripsi |
|:---|:---|
| `pnpm run dev` | Jalankan development server |
| `pnpm run build` | Build untuk production (dengan Prisma generate) |
| `pnpm start` | Jalankan production server |
| `pnpm run lint` | Jalankan ESLint |
| `pnpm test` | Jalankan unit test (Vitest) |
| `pnpm run migrate:dev` | Buat migrasi database baru |
| `pnpm run migrate:deploy` | Terapkan migrasi ke database |
| `pnpm run migrate:status` | Cek status migrasi |
| `npx prisma studio` | Buka Prisma Studio (GUI database) |
| `npx prisma db seed` | Seed database (kategori default) |

---

## Struktur Dataset (Prisma Schema)

### Models
- **Profile** — Data pengguna (nama, NIK, telepon, alamat, RT/RW, role, verifikasi)
- **Category** — Kategori laporan hirarkis (parent-child, 4 induk + 16 sub-kategori)
- **Complaint** — Laporan warga (judul, konten, lokasi, koordinat, foto, status, urgensi, kategori, level eskalasi, petugas assigned)
- **Response** — Tanggapan petugas (konten, foto, waktu)
- **Announcement** — Pengumuman resmi (6 kategori)
- **Notification** — Notifikasi in-app (INFO/WARNING/DELETE, read status)
- **EscalationLog** — Riwayat eskalasi (fromLevel → toLevel, reason)
- **LoginAttempt** — Rate limiting berbasis IP
- **AuditLog** — Catatan aktivitas admin

---

## Lisensi

**MIT License** — © 2026 whtsn dev.
