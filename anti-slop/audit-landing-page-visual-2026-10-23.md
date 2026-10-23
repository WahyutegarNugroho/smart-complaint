# Laporan Audit Visual UI Landing Page (6-Pilar Anti-Slop & TypeUI)

> **Subjek Audit:** Landing Page Utama ([`src/app/page.tsx`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx))  
> **Tanggal:** 23 Oktober 2026  
> **Metode:** Evaluasi Visual Berbasis Screenshot + Analisis Kode Sumber  
> **Standar Keahlian:** `typeui-fundamentals`, `antislop-ui`, `antislop-layoutmobile`, `antislop-human`, `antislop-copywriting`, `antislop`

---

## 1. Ringkasan Eksekutif

Landing page saat ini telah memiliki fondasi **Modern Civic Tech** yang solid:
- Komposisi warna dominan Slate/Navy Blue/Emerald yang bersih dan berwibawa.
- Struktur semantik jelas (`LandingNavbar`, Hero dengan kartu bukti nyata, Floating Tracker, Statistik Akuntabilitas, Stepper Alur, Grid Kategori, Feed Laporan Publik, FAQ Accordion, Callout Warga, dan Civic Footer).
- Tidak menggunakan gradien ungu-biru generik atau glow berlebihan.

Namun demikian, audit visual mendalam menemukan **7 anomali desain spesifik** yang menurunkan kredibilitas profesional dan menciptakan *cognitive dissonance* bagi warga.

---

## 2. Temuan Audit Berdasarkan 6 Pilar Keahlian

### Temuan 1: Disonansi Kognitif pada Kartu Tingkat Penyelesaian (0.0% Hijau)
- **Pilar Terkait:** `typeui-fundamentals` (UX Feedback Loops) & `antislop-human` (Color-as-Information)
- **Lokasi:** Section 1 (Statistik Transparansi) - Kartu 3 ([`src/app/page.tsx:307-318`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx#L307-L318))
- **Masalah Visual:** Angka **`0.0%`** ditampilkan dalam warna hijau perayaan (`text-emerald-700`, `bg-emerald-50`, ikon `CheckCircle2` hijau). Menampilkan angka 0% penyelesaian dengan warna hijau sukses bertentangan secara psikologis dan membingungkan warga (tampak seperti anomali data/sistem).
- **Rekomendasi Perbaikan:** Terapkan pewarnaan adaptif kondisional:
  - Jika penyelesaian >= 75%: Hijau Emerald (`text-emerald-700`).
  - Jika 25% - 74%: Amber (`text-amber-700`).
  - Jika < 25% atau 0%: Slate Netral / Biru Otoritas (`text-slate-800 dark:text-slate-200`) dengan label keterangan "Sedang dalam proses pengerjaan", atau fokuskan kartu pada "Komitmen Penyelesaian: 100% Tuntas".

---

### Temuan 2: Ilusi Optik Angka Minus pada Rata-rata Respons (~12 Jam)
- **Pilar Terkait:** `typeui-fundamentals` (Typography Foundations) & `antislop-copywriting`
- **Lokasi:** Section 1 (Statistik Transparansi) - Kartu 4 ([`src/app/page.tsx:328-330`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx#L328-L330))
- **Masalah Visual:** Tanda tilde `~` pada font monospace berada tepat di tengah dengan ketebalan identik dengan tanda minus (**`-12 Jam`**). Warga yang membaca sekilas akan mengira sistem mengalami error angka negatif ("Minus 12 Jam").
- **Rekomendasi Perbaikan:** Ganti tanda tilde dengan copy yang lebih jelas:
  ```diff
  - ~{averageResponseHours} Jam
  + < {averageResponseHours} Jam
  ```
  atau `Rata-rata 12 Jam` / `< 24 Jam Kerja`.

---

### Temuan 3: Ikon Dolar US pada FAQ Biaya Pelayanan RT/RW
- **Pilar Terkait:** `antislop-ui` (Generic AI Icons) & `antislop-copywriting` (Civic Context)
- **Lokasi:** Section 5 (FAQ Accordion) - Item 3 ([`src/components/landing/FaqAccordion.tsx:26-30`](file:///c:/xampp/htdocs/smart-complaint-app/src/components/landing/FaqAccordion.tsx#L26-L30))
- **Masalah Visual:** Pertanyaan *"Apakah layanan pelaporan ini dipungut biaya?"* menggunakan ikon **`DollarSign` (`$`)**. Dalam konteks RT/RW di Tangerang Selatan, simbol mata uang Dolar adalah ciri khas template AI SaaS komersial dari Silicon Valley, bukan layanan sipil warga Indonesia.
- **Rekomendasi Perbaikan:** Ganti ikon `DollarSign` dengan ikon yang mencerminkan pelayanan sosial/gratis seperti `HeartHandshake`, `BadgePercent`, atau `ShieldCheck`.

---

### Temuan 4: Citra "Testing" Hitam Merusak Kredibilitas Feed Laporan
- **Pilar Terkait:** `antislop` (C-5 Evidence Over Claims) & `antislop-ui`
- **Lokasi:** Section 4 (Jelajah Laporan Terkini Warga) ([`src/components/landing/PublicReportsFeed.tsx`](file:///c:/xampp/htdocs/smart-complaint-app/src/components/landing/PublicReportsFeed.tsx))
- **Masalah Visual:** Pada kartu ke-2 dan ke-3, gambar laporan menampilkan kotak hitam bertuliskan "testing" dengan judul "Sampah" dan "Testing map". Hal ini menandakan data dummy pengujian developer bocor ke halaman depan publik, yang secara drastis menurunkan kesan profesionalitas portal.
- **Rekomendasi Perbaikan:** 
  1. Bersihkan record dummy di basis data dengan data aduan warga yang realistis (misal: "Genangan Saluran Air Got Mampet Blok B", "Paving Jalan Berlubang Depan Balai Warga").
  2. Berikan fallback banner visual terstandarisasi untuk laporan tanpa foto asli, menampilkan ilustrasi kategori resmi dan badge verifikasi.

---

### Temuan 5: Kurangnya Kontinuitas Visual (Gestalt) pada Stepper Alur
- **Pilar Terkait:** `typeui-fundamentals` (Gestalt Continuity & Process Steppers)
- **Lokasi:** Section 2 (Alur Penanganan) ([`src/app/page.tsx:355-419`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx#L355-L419))
- **Masalah Visual:** Keempat kartu langkah berdiri sendiri sebagai 4 kotak terpisah. Langkah 1 s/d 3 menggunakan lencana biru (`bg-blue-800`), sedangkan langkah 4 tiba-tiba berubah menjadi hijau (`bg-emerald-600`). Tidak ada garis penghubung linear (connector line) yang menunjukkan alur berurutan dari kiri ke kanan.
- **Rekomendasi Perbaikan:** Tambahkan garis indikator penghubung (connector arrow/line) antar langkah di layar desktop, serta pertahankan keharmonisan hierarki penomoran langkah 01 -> 02 -> 03 -> 04.

---

### Temuan 6: Margin Negatif Floating Ticket Tracker pada Layar Kecil
- **Pilar Terkait:** `antislop-layoutmobile` (Scale & Spacing Rhythm)
- **Lokasi:** Transisi Hero ke Section 1 ([`src/app/page.tsx:253-255`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx#L253-L255))
- **Masalah Visual:** Penggunaan `mt-14 -mb-10 sm:-mb-14` dapat menekan judul seksi statistik pada layar sempit (< 380px) jika tidak dikompensasi dengan padding atas yang fleksibel.
- **Rekomendasi Perbaikan:** Ubah menjadi `-mb-6 sm:-mb-10 lg:-mb-12` dengan kompensasi padding section `pt-16 sm:pt-20 lg:pt-24`.

---

### Temuan 7: Redundansi Label pada Bagian Bawah Kartu Kategori
- **Pilar Terkait:** `typeui-fundamentals` (Fitts' Law & Interactive Affordance)
- **Lokasi:** Section 3 (Sektor Pengaduan) ([`src/app/page.tsx:470-473`](file:///c:/xampp/htdocs/smart-complaint-app/src/app/page.tsx#L470-L473))
- **Masalah Visual:** Garis bawah kartu memuat dua teks berdampingan: *"Ajukan Aduan di Sektor Ini"* di kiri dan *"Pilih Kategori"* di kanan. Ini menciptakan mikro-teks berulang yang tidak menambah nilai interaktif.
- **Rekomendasi Perbaikan:** Sederhanakan menjadi satu tombol aksi jelas dengan ikon panah yang bergeser dinamis saat hover:
  ```tsx
  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-800 dark:text-blue-400 group-hover:text-blue-900 dark:group-hover:text-blue-300">
    <span>Ajukan Laporan Sektor Ini</span>
    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
  </div>
  ```

---

## 3. Matriks Prioritas Perbaikan

| No | Temuan | Pilar | Dampak | Prioritas |
|---|---|---|---|---|
| 1 | Kartu `0.0%` hijau di seksi statistik | `typeui-fundamentals` / `antislop-human` | Disonansi logika warna & membingungkan warga | **TINGGI** |
| 2 | Citra `testing` hitam pada feed laporan terkini | `antislop` (C-5) / `antislop-ui` | Menurunkan kredibilitas publik portal | **TINGGI** |
| 3 | Tanda tilde menyerupai minus (`-12 Jam`) | `antislop-copywriting` / `typeui-fundamentals` | Salah tafsir waktu penanganan | **SEDANG** |
| 4 | Ikon Dolar (`$`) pada FAQ layanan warga | `antislop-ui` / `antislop-copywriting` | Ketidaksesuaian konteks lokal RT/RW | **SEDANG** |
| 5 | Redundansi teks di kartu kategori | `typeui-fundamentals` (Fitts' Law) | Polusi visual mikro-copy | **SEDANG** |
| 6 | Kurangnya garis alur stepper 01-04 | `typeui-fundamentals` (Gestalt) | Alur langkah terputus-putus | **RENDAH** |
| 7 | Margin tracker responsif mobile | `antislop-layoutmobile` | Kerapatan vertikal di layar kecil | **RENDAH** |
