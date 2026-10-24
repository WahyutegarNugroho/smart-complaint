import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  PhoneCall,
  Wrench,
  Lightbulb,
  Trash2,
  Droplets,
  Building2,
  ArrowRight,
  Plus,
  MapPin,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import TicketTrackerWidget from '@/components/landing/TicketTrackerWidget';
// [SEMENTARA DISEMBUNYIKAN - Buka comment ini jika section Jelajah Laporan diaktifkan kembali]
// import PublicReportsFeed, { FeedComplaintItem } from '@/components/landing/PublicReportsFeed';
import FaqAccordion from '@/components/landing/FaqAccordion';
import { getPublicLandingStats } from '@/lib/dal';

export const revalidate = 60;

/* [SEMENTARA DISEMBUNYIKAN - Buka comment ini jika section Jelajah Laporan diaktifkan kembali]
function maskName(name: string): string {
  if (!name) return 'Warga';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '*'.repeat(Math.max(2, part.length - 2)) + part[part.length - 1];
    })
    .join(' ');
}
*/

export default async function LandingPage() {
  const {
    totalReports,
    processingReports,
    completedReports,
    averageResponseHours,
    successRate,
    formattedResponseTime,
    // recentComplaints, // [SEMENTARA DISEMBUNYIKAN]
  } = await getPublicLandingStats();

  /* [SEMENTARA DISEMBUNYIKAN - Buka comment ini jika section Jelajah Laporan diaktifkan kembali]
  const initialComplaints: FeedComplaintItem[] = recentComplaints.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    status: item.status as 'PENDING' | 'PROCESSING' | 'COMPLETED',
    imageUrl: item.imageUrl,
    rt: item.rt,
    rw: item.rw,
    createdAt: item.createdAt.toISOString(),
    maskedAuthor: maskName(item.author?.name || 'Warga'),
  }));
  */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Skip to Main Content Link for Keyboard & Screen Readers (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-blue-800 focus:text-white focus:font-semibold focus:text-xs focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-white"
      >
        Lewati ke Konten Utama
      </a>

      {/* Sticky Navbar (Section 5.1) */}
      <LandingNavbar />

      <main id="main-content">
        {/* =========================================================================
            SECTION 5.2: HERO SECTION (Civic Command Hub)
            ========================================================================= */}
        <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-20 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Kolom Kiri: Narasi Utama & Akses Cepat */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Institutional Notice Line */}
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300">
                  <ShieldCheck size={16} className="text-blue-700 dark:text-blue-400 shrink-0" />
                  <span>Kanal Resmi Layanan Warga RW 08 Pesona Serpong</span>
                </div>

                {/* Headline H1 (Bold, authoritative, confident) */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
                  Suara Warga, Langkah Nyata Perubahan Lingkungan.
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Sampaikan laporan infrastruktur jalan, sanitasi, dan sarana umum. Pengurus RT/RW memvalidasi langsung dengan tindak lanjut transparan hingga tuntas.
                </p>

                {/* Dual-Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus size={18} />
                    <span>+ Buat Pengaduan Baru</span>
                  </Link>

                  <Link
                    href="/informasi/darurat"
                    className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all shrink-0"
                  >
                    <PhoneCall size={16} className="text-rose-600" />
                    <span>Kontak Darurat & Hotline</span>
                  </Link>
                </div>

                {/* Integrated Ticket Tracker Directly in Left Column (No floating bar) */}
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Lacak Progres Tiket Laporan Anda</span>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">Format: LP-2026-0001</span>
                  </div>
                  <TicketTrackerWidget />
                </div>
              </div>

              {/* Kolom Kanan: The Unified Civic Showcase & Live Dispatch Monitor */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 overflow-hidden bg-white dark:bg-slate-900 text-left">
                  
                  {/* Top Part: Authentic Neighborhood Photography */}
                  <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src="/images/hero-neighborhood.jpg"
                      alt="Dokumentasi Lingkungan Warga Perumahan Pesona Serpong"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Geotag Tag */}
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-sm text-xs font-medium text-white shadow-md border border-white/10">
                      <MapPin size={13} className="text-emerald-400" />
                      <span>Cluster Pesona Serpong • RW 08</span>
                    </div>

                    {/* Live Dispatch Indicator */}
                    <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-sm text-xs font-medium text-slate-200 shadow-md border border-white/10">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[11px]">Sistem Terhubung</span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
                        Pemantauan Sarana Lingkungan Terpadu
                      </span>
                      <p className="text-xs font-medium text-slate-200 mt-0.5 drop-shadow-sm">
                        Kondisi jalan, drainase got, dan lampu penerangan dipantau secara berkala oleh pengurus.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Console Panel (Seamlessly Integrated) */}
                  <div className="p-5 space-y-3.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          DISPOSISI TERAKHIR
                        </span>
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                          #LP-2026-0891
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-semibold">
                        Sedang Ditindak
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        Perbaikan Lampu Penerangan Jalan (PJU) Padam Blok C
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Lokasi: RT 03 / RW 08 • Pelapor: <strong className="text-slate-700 dark:text-slate-300">A*** W******</strong>
                      </p>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Tindak Lanjut Lapangan</span>
                        <span className="font-mono font-bold text-blue-800 dark:text-blue-400">Tahap 2 dari 3</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-2/3 rounded-full" />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-0.5">
                        Petugas teknis seksi sarana sedang melakukan pergantian fitting lampu di lokasi.
                      </span>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Target SLA: Maksimal 24 Jam Kerja
                      </span>
                      <Link
                        href="/alur"
                        className="text-blue-800 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Lihat Alur 4 Tahapan
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      {/* =========================================================================
          SECTION 5.3: STRIP AKUNTABILITAS DATA (Civic Ledger Strip)
          ========================================================================= */}
      <section id="statistik" className="py-12 lg:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Akuntabilitas & Keterbukaan Data Warga
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Data resmi penanganan aduan lingkungan Pesona Serpong yang diperbarui secara transparan.
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
              Sinkronisasi Sistem • Terbuka untuk Umum
            </div>
          </div>

          {/* Single Unified Ledger Strip with Clean Dividers (No 4 Floating Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 overflow-hidden text-left">
            
            {/* Ledger Item 1: Total */}
            <div className="p-6 space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Total Laporan Masuk
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-slate-900 dark:text-white block tracking-tight">
                {totalReports}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block pt-1">
                Seluruh laporan tercatat resmi
              </span>
            </div>

            {/* Ledger Item 2: Active */}
            <div className="p-6 space-y-1">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                Sedang Ditangani
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-amber-600 dark:text-amber-400 block tracking-tight">
                {processingReports}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block pt-1">
                Tindak lanjut tim lapangan aktif
              </span>
            </div>

            {/* Ledger Item 3: Success Rate */}
            <div className="p-6 space-y-1">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                Tingkat Penyelesaian
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-emerald-600 dark:text-emerald-400 block tracking-tight">
                {completedReports > 0 ? `${successRate}%` : '100%'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block pt-1">
                {completedReports > 0 ? `${completedReports} aduan tuntas diperbaiki` : 'Target efektivitas penanganan'}
              </span>
            </div>

            {/* Ledger Item 4: Response Time */}
            <div className="p-6 space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Rata-rata Waktu Respons
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-blue-800 dark:text-blue-400 block tracking-tight">
                {formattedResponseTime}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block pt-1">
                {averageResponseHours >= 48 ? 'Rata-rata verifikasi ke penuntasan' : 'Rata-rata verifikasi ke disposisi'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5.4: ALUR PENANGANAN (Continuous Civic Pipeline)
          ========================================================================= */}
      <section id="alur" className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-left mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Standar Operasional Penanganan Aduan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Empat langkah praktis yang menjamin setiap aspirasi warga terkelola secara terstruktur dan terukur dari awal hingga tuntas.
            </p>
          </div>

          {/* Connected Process Timeline Pipeline (No isolated card boxes) */}
          <div className="relative">
            {/* Horizontal Track Line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-left">
              
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-800 text-blue-800 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-lg shadow-sm shrink-0">
                    01
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Langkah Awal
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tulis & Unggah Bukti
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Warga menuliskan kendala riil di perumahan, melampirkan foto kondisi lapangan, dan menentukan RT terkait.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-lg shadow-sm shrink-0">
                    02
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    &lt; 24 Jam
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Verifikasi Pengurus RT
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Pengurus RT/RW memvalidasi keabsahan data, menentukan tingkat urgensi, dan menerbitkan disposisi ke seksi kerja.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-lg shadow-sm shrink-0">
                    03
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Aksi Lapangan
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tindak Lanjut Lapangan
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Petugas teknis atau seksi lingkungan diterjunkan ke lokasi untuk perbaikan fisik dan update progres berkala.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-14 w-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md shadow-emerald-700/20 shrink-0">
                    04
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Hasil Tuntas
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Selesai & Evaluasi Warga
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Laporan ditutup dengan dokumentasi hasil kerja. Pelapor menerima notifikasi dan konfirmasi kepuasan.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5.5: DIREKTORI SEKTOR PENGADUAN (Civic Service Directory)
          ========================================================================= */}
      <section id="kategori" className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Direktori Sektor Pengaduan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Pilih klasifikasi bidang laporan untuk mempermudah delegasi ke seksi kerja lingkungan yang berwenang.
              </p>
            </div>
            <Link
              href="/register"
              className="text-xs font-semibold text-blue-800 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1 shrink-0"
            >
              Buka Form Pelaporan Lengkap
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Two-Column Civic Service Directory Index (No 6 floating cards with circle icons) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            
            {/* Column 1 */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {CIVIC_CATEGORIES.slice(0, 3).map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/register?category=${cat.slug}`}
                  className="py-5 px-4 sm:px-6 flex items-start justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {cat.title}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0 pt-0.5">
                    Lapor <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>

            {/* Column 2 */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {CIVIC_CATEGORIES.slice(3, 6).map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/register?category=${cat.slug}`}
                  className="py-5 px-4 sm:px-6 flex items-start justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {cat.title}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0 pt-0.5">
                    Lapor <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5.6: FEED LAPORAN TERKINI (Transparansi Publik - Jelajah Laporan)
          [SEMENTARA DISEMBUNYIKAN - Hapus tanda komentar di bawah jika ingin mengaktifkan kembali]
          ========================================================================= */}
      {/*
      <section id="jelajah" className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-left mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Jelajah Laporan Terkini Warga
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Pantau aduan lingkungan yang sedang ditindaklanjuti. Dukung laporan serupa agar penanganan dapat diprioritaskan tanpa membuat aduan ganda.
            </p>
          </div>

          <PublicReportsFeed initialComplaints={initialComplaints} />
        </div>
      </section>
      */}

      {/* =========================================================================
          SECTION 5.7: JAMINAN KEAMANAN & FAQ (Clean Civic Accordion)
          ========================================================================= */}
      <section id="faq" className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Penjelasan mengenai jaminan kerahasiaan identitas pelapor, batas waktu tindak lanjut, dan standar operasional layanan.
            </p>
          </div>

          {/* Interactive Accordion Component */}
          <FaqAccordion />
        </div>
      </section>

      {/* =========================================================================
          SECTION: CALLOUT WARGA / CIVIC NOTICE
          ========================================================================= */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-950/10">
            <div className="space-y-3 text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-blue-200 text-xs font-semibold">
                <MapPin size={13} />
                <span>Kanal Resmi Perumahan Pesona Serpong</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                Ada kendala atau kerusakan sarana di lingkungan Anda?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Laporkan sekarang untuk membantu pengurus RT/RW mempercepat perbaikan sarana jalan, drainase, lampu penerangan, dan ketertiban bersama.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-600/30 active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
              >
                <Plus size={16} />
                <span>Buat Pengaduan Baru</span>
              </Link>
              <Link
                href="/informasi/darurat"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg border border-white/25 text-white hover:bg-white/10 font-semibold text-xs tracking-wider uppercase transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
              >
                <PhoneCall size={14} />
                <span>Hotline 24 Jam</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}

const CIVIC_CATEGORIES = [
  {
    title: 'Jalan & Paving Amblas',
    slug: 'infrastruktur',
    icon: Wrench,
    description: 'Paving block jalan berlubang, aspal rusak, atau kerusakan fisik penutup akses pemukiman.',
  },
  {
    title: 'Lampu Jalan (PJU) Padam',
    slug: 'pju',
    icon: Lightbulb,
    description: 'Penerangan Jalan Umum padam atau kabel instalasi yang membahayakan keselamatan warga.',
  },
  {
    title: 'Sampah & Sanitasi Got',
    slug: 'kebersihan',
    icon: Trash2,
    description: 'Pengangkutan sampah terlambat, tumpukan sampah liar, dan pembersihan saluran drainase.',
  },
  {
    title: 'Saluran Air & Banjir',
    slug: 'drainase',
    icon: Droplets,
    description: 'Got mampet, genangan air saat hujan lebat, dan perbaikan dinding selokan lingkungan.',
  },
  {
    title: 'Keamanan & Pos Ronda',
    slug: 'keamanan',
    icon: ShieldCheck,
    description: 'Laporan gangguan ketertiban malam, parkir menutup akses darurat, dan koordinasi satpam.',
  },
  {
    title: 'Fasilitas Balai Warga',
    slug: 'fasilitas',
    icon: Building2,
    description: 'Kerusakan sarana bermain anak, balai pertemuan RT/RW, dan area olahraga bersama.',
  },
];
