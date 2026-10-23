# Design System & UI/UX Specification: Portal Pengaduan Masyarakat

Dokumen ini merupakan panduan desain (*Design System*) untuk pengembangan antarmuka pengguna (UI) dan pengalaman pengguna (UX) pada *landing page* **Portal Pengaduan Masyarakat**. 

---

## 1. Filosofi & Tema Desain
* **Tema Utama:** *Modern Civic Tech (Clean, Trustworthy & Accessible)*
* **Prinsip Utama:**
  1. **Clarity over Complexity:** Warga yang datang ke situs ini umumnya sedang mengalami kendala/masalah. Antarmuka harus tenang, jelas, dan langsung mengarahkan mereka ke solusi tanpa kebingungan.
  2. **Transparansi Visual:** Menampilkan data, status, dan alur kerja secara terbuka melalui komponen visual yang rapi.
  3. **Inklusivitas & Aksesibilitas (WCAG AA):** Kontras warna tinggi, ukuran teks yang nyaman dibaca oleh lintas generasi (termasuk lansia), dan struktur navigasi yang ramah perangkat *mobile* (*Mobile-First*).
  4. **Default Light Mode:** Memberikan kesan bersih, resmi, terbuka, dan mudah dibaca di bawah sinar matahari saat warga melapor langsung dari lokasi kejadian menggunakan ponsel.

---

## 2. Palet Warna (Color Tokens)

Hindari penggunaan warna merah secara dominan agar tidak menimbulkan efek panik atau kesan agresif. Gunakan biru/hijau *teal* untuk membangun rasa percaya.

### A. Brand & Primary Colors
| Token | Hex Code | Tailwind Equivalent | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#1E40AF` | `blue-800` | Warna identitas utama, *header*, elemen aktif, tombol sekunder. |
| `--color-primary-hover` | `#1E3A8A` | `blue-900` | *State hover* pada elemen primer. |
| `--color-primary-light` | `#EFF6FF` | `blue-50` | Latar belakang *badge*, *highlight card*, atau *icon container*. |
| `--color-accent` | `#10B981` | `emerald-500` | Tombol Call-to-Action (CTA) utama ("Buat Laporan"), aksen positif. |
| `--color-accent-hover` | `#059669` | `emerald-600` | *State hover* untuk CTA utama. |

### B. Neutral & Surface Colors
| Token | Hex Code | Tailwind Equivalent | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F8FAFC` | `slate-50` | Warna latar belakang utama halaman (tidak membuat mata cepat lelah). |
| `--bg-surface` | `#FFFFFF` | `white` | Latar belakang *card*, *modal*, *navbar*, dan *input field*. |
| `--bg-subtle` | `#F1F5F9` | `slate-100` | Latar belakang seksi alternatif (*alternating section*). |
| `--text-primary` | `#0F172A` | `slate-900` | Warna teks judul (*heading*) dan teks utama. |
| `--text-secondary` | `#475569` | `slate-600` | Subjudul, deskripsi, dan label form. |
| `--text-muted` | `#94A3B8` | `slate-400` | *Placeholder* input, teks *caption*, atau *timestamp*. |
| `--border-default` | `#E2E8F0` | `slate-200` | Garis pembatas (*divider*), *border card*, dan *input default*. |

### C. Semantic / Status Colors (Pelacakan Laporan)
| Status Laporan | Text & Icon Hex | Background Hex | Border Hex | Makna |
| :--- | :--- | :--- | :--- | :--- |
| **Menunggu Verifikasi** | `#475569` (`slate-600`) | `#F1F5F9` (`slate-100`) | `#CBD5E1` | Laporan baru masuk antrean. |
| **Sedang Diproses** | `#B45309` (`amber-700`) | `#FEF3C7` (`amber-100`) | `#FDE68A` | Sedang ditindaklanjuti petugas di lapangan. |
| **Selesai Ditangani** | `#047857` (`emerald-700`) | `#D1FAE5` (`emerald-100`) | `#A7F3D0` | Masalah telah diselesaikan beserta bukti. |
| **Ditolak / Tidak Valid**| `#B91C1C` (`red-700`) | `#FEE2E2` (`red-100`) | `#FECACA` | Laporan duplikat, *spam*, atau di luar wewenang. |

---

## 3. Tipografi (Typography)

### Font Family
* **Heading & Body (`--font-sans`):** `'Plus Jakarta Sans'`, `'Inter'`, atau `system-ui, sans-serif`. Karakter huruf modern, terbuka, dan sangat jelas di layar resolusi rendah maupun tinggi.
* **Nomor Tiket / Kode Laporan (`--font-mono`):** `'JetBrains Mono'` atau `monospace`. Wajib digunakan untuk menampilkan ID Laporan (misal: `#LP-2026-0891`) agar angka `0` dan huruf `O` tidak tertukar.

### Skala Tipografi (Type Scale)
| Elemen | Ukuran (Desktop) | Ukuran (Mobile) | Ketebalan (Weight) | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `44px` (`2.75rem`) | `32px` (`2.0rem`) | Bold (`700`) | `1.2` |
| **Section Title (H2)**| `32px` (`2.0rem`) | `24px` (`1.5rem`) | Bold (`700`) | `1.3` |
| **Card Title (H3)** | `20px` (`1.25rem`) | `18px` (`1.125rem`)| SemiBold (`600`) | `1.4` |
| **Body Large** | `18px` (`1.125rem`)| `16px` (`1.0rem`) | Regular (`400`) | `1.6` |
| **Body Default** | `16px` (`1.0rem`) | `16px` (`1.0rem`) | Regular (`400`) | `1.5` |
| **Caption / Badge** | `14px` (`0.875rem`)| `12px` (`0.75rem`) | Medium (`500`) | `1.4` |

---

## 4. Layout, Grid & Spacing

* **Container Max-Width:** `1280px` dengan *padding* horizontal `24px` (Mobile) dan `48px` (Desktop).
* **Grid System:** 
  * Desktop: 12 kolom (`gap: 24px`).
  * Tablet: 8 kolom (`gap: 20px`).
  * Mobile: 4 kolom (`gap: 16px`).
* **Section Spacing:** `80px` (`5rem`) vertikal untuk Desktop, `48px` (`3rem`) vertikal untuk Mobile.
* **Border Radius:**
  * Tombol & Input: `8px` (`rounded-lg`)
  * Card & Modal: `16px` (`rounded-2xl`)
  * Badge Status: `9999px` (`rounded-full`)
* **Box Shadow (Elevasi Halus):**
  * Default Card: `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)`
  * Hover / Floating Widget: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`

---

## 5. Struktur Anatomi Landing Page (Wireframe Spec)

### 5.1. Sticky Navbar
* **Kiri:** Logo Instansi/Portal + Nama Sistem.
* **Tengah:** Navigasi Jangkar (*Anchor Links*): *Cara Melapor*, *Statistik*, *Jelajah Laporan*, *FAQ*.
* **Kanan:** Tombol Sekunder *"Masuk"* & Tombol Primer *"Buat Laporan"*.

### 5.2. Hero Section (Dual-Action Focus)
* **Layout:** *Split 2 Kolom* pada desktop (Kiri: Teks & Aksi, Kanan: Ilustrasi Interaktif/Status Card).
* **Konten Kiri:**
  * *Trust Pill Badge:* `"🔒 Identitas Pelapor Dijamin Aman & Rahasia"`
  * *Headline (H1):* `"Suara Anda, Langkah Awal Perubahan Lingkungan Kita."`
  * *Subheadline:* `"Sampaikan keluhan infrastruktur, layanan publik, atau ketertiban lingkungan dengan cepat dan pantau penanganannya secara transparan."`
  * *Primary Action:* Tombol besar **"+ Buat Pengaduan Baru"** (Warna Emerald `#10B981`) berdampingan dengan tombol **"Lapor Darurat / Hotline"**.
* **Widget Lacak Cepat (Floating Search Bar di bawah Hero):**
  * Kolom input langsung tanpa harus *login*: *"Sudah melapor? Masukkan Nomor Tiket (Contoh: LP-2026-XXXX)"* + Tombol **"Lacak Status"**.

### 5.3. Statistik Transparansi (Trust Indicators)
* **Layout:** 4 Kartu metrik sejajar (*Bento/Counter Cards*).
* **Metrik yang Ditampilkan:**
  1. **Total Laporan Masuk** (Angka besar + indikator bulan ini).
  2. **Sedang Ditindaklanjuti** (Menunjukkan sistem sedang bekerja aktif).
  3. **Laporan Selesai** (Persentase penyelesaian, misal: `94.2%`).
  4. **Rata-rata Waktu Respons** (Misal: `< 24 Jam`).

### 5.4. Alur Pengaduan (How It Works)
* **Layout:** 4 Langkah Horizontal (Desktop) / Stepper Vertikal (Mobile).
* **Tahapan:**
  1. **Tulis & Unggah Bukti:** Isi kronologi singkat, titik lokasi peta, dan foto bukti.
  2. **Verifikasi (< 24 Jam):** Tim admin memvalidasi kelengkapan laporan dan meneruskan ke dinas/unit terkait.
  3. **Tindak Lanjut Lapangan:** Petugas menangani masalah dan memperbarui progres secara berkala.
  4. **Selesai & Evaluasi:** Laporan ditutup dengan bukti foto hasil pengerjaan (*Before-After*), pelapor dapat memberi *rating*.

### 5.5. Kategori Pengaduan Populer (Quick Access Grid)
* **Layout:** Grid 3x2 atau 4x2 menggunakan kartu berikon jelas. Saat diklik, langsung membuka form pengaduan dengan kategori yang sudah terpilih otomatis (*pre-filled*).
* **Contoh Kategori:** *Jalan & Jembatan Rusak*, *Lampu Penerangan Jalan*, *Sampah & Kebersihan*, *Saluran Air & Banjir*, *Fasilitas Umum*, *Pelayanan Administrasi*.

### 5.6. Feed Laporan Terkini (Transparansi Publik)
* **Layout:** 3 Kolom *Card Grid* + Filter tab sederhana (*Semua*, *Diproses*, *Selesai*).
* **Isi Kartu Laporan:**
  * *Header Card:* Kategori + Badge Status + Waktu Lapor (*"2 jam yang lalu"*).
  * *Visual:* Foto bukti laporan (dilengkapi label *Before / After* jika sudah selesai).
  * *Konten:* Judul laporan, lokasi kelurahan/kecamatan.
  * *Footer Card:* Nama pelapor disamarkan otomatis (Contoh: `"B*** S******"`) untuk menjaga privasi + jumlah dukungan (*Upvote* `"Saya juga mengalami ini"`).

### 5.7. Jaminan Keamanan & FAQ (Accordion)
* Menjawab pertanyaan krusial warga dalam bentuk *expandable accordion*:
  * *Apakah identitas saya aman jika melaporkan oknum/masalah sensitif?* (Penjelasan fitur **Lapor Anonim / Rahasia**).
  * *Berapa lama laporan saya akan direspons?*
  * *Apakah layanan ini dipungut biaya?*

### 5.8. Footer
* Informasi kontak darurat (Call Center 112 / WhatsApp Pengaduan), alamat kantor pengelola, tautan Kebijakan Privasi, dan Syarat Ketentuan.

---

## 6. Spesifikasi Komponen Kunci (UI Components)

### A. Tombol (Buttons)
* **Tinggi Minimum (Touch Target):** `48px` untuk tombol utama agar mudah ditekan oleh ibu jari di layar HP.
* **Primary CTA:** Background `#10B981`, Teks Putih `font-semibold`, dengan ikon tambah/kirim di sebelah kiri teks.
* **Focus State:** Wajib memiliki `outline: 3px solid #93C5FD` (`blue-300`) untuk aksesibilitas navigasi keyboard.

### B. Kartu Laporan Publik (Report Card)
* Memiliki rasio gambar tetap `16:9` dengan `object-fit: cover`.
* Jika laporan mengandung gambar sensitif, tambahkan efek *blur* otomatis dengan tombol *"Tampilkan Gambar"*.
* Dilengkapi fitur **Tombol Dukungan (Upvote)**: Memungkinkan warga lain menekan tombol *"Ikut Pantau / Masalah Serupa (24)"* agar warga tidak perlu membuat laporan duplikat untuk jalan berlubang yang sama.

### C. Bilah Pelacak Tiket (Ticket Tracker Input)
* Menggunakan *font monospace* saat pengguna mengetik kode tiket.
* Otomatis mengubah huruf kecil menjadi huruf kapital (*auto-uppercase*).
* Menampilkan hasil pratinjau instan (*inline modal/drawer*) berupa *timeline* progres tanpa harus berpindah halaman penuh.

---

## 7. Panduan Aksesibilitas & Micro-Interactions
1. **Kecepatan Muat (Performance):** Hindari animasi berat (seperti *video background* atau 3D *canvas*). Gunakan ilustrasi berformat `.SVG` atau `.WebP` berukuran di bawah `100KB`.
2. **Bahasa yang Empatik (UX Writing):** 
   * Gunakan kalimat aktif dan ramah. 
   * *Hindari:* `"Error 404: Tiket tidak ditemukan di database."`
   * *Gunakan:* `"Nomor tiket belum ditemukan. Pastikan kode sudah sesuai (contoh: LP-2026-0123) atau periksa kembali email/WhatsApp Anda."`
3. **Fitur Lapor Tanpa Login (Guest Reporting) vs Terdaftar:** Berikan opsi melapor cepat hanya dengan verifikasi nomor WhatsApp/Email (OTP) agar warga tidak batal melapor karena malas membuat akun baru.