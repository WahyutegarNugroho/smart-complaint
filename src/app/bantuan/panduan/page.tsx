import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Activity,
  BellRing,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Panduan Penggunaan Portal | Portal Pengaduan Pesona Serpong',
  description: 'Petunjuk lengkap cara membuat laporan, memantau penanganan teknis, dan mengelola akun di Portal Pengaduan Warga Pesona Serpong.',
};

const GUIDES = [
  {
    icon: FileText,
    title: 'Cara Membuat Laporan Baru',
    badge: 'Fitur Utama',
    steps: [
      'Masuk ke portal menggunakan akun warga yang sudah terdaftar.',
      'Klik tombol "Buat Laporan" pada menu atas atau dashboard.',
      'Tulis judul permasalahan dan deskripsikan kendala secara jelas.',
      'Pilih kategori yang sesuai (Infrastruktur, PJU, Kebersihan, Drainase, dll).',
      'Tentukan lokasi kejadian pada peta interaktif perumahan.',
      'Unggah foto bukti dokumentasi fisik di lokasi agar penanganan akurat.',
      'Tekan "Kirim Laporan" untuk meneruskannya langsung ke petugas RT/RW.',
    ],
  },
  {
    icon: Activity,
    title: 'Memantau Status Penanganan',
    badge: 'Transparansi',
    steps: [
      'Buka dashboard warga untuk melihat daftar seluruh laporan yang diajukan.',
      'Status laporan: Menunggu Verifikasi, Sedang Diproses, atau Selesai.',
      'Buka detail laporan untuk membaca catatan investigasi dari petugas lapangan.',
      'Gunakan fitur Quick Tracker di beranda bila ingin melacak tanpa harus login.',
    ],
  },
  {
    icon: BellRing,
    title: 'Notifikasi & Respons Petugas',
    badge: 'Pembaruan Real-Time',
    steps: [
      'Setiap perubahan status dan tanggapan petugas akan memicu notifikasi sistem.',
      'Klik ikon lonceng pada bilah navigasi untuk melihat riwayat aktivitas terkini.',
      'Laporan yang membutuhkan klarifikasi tambahan dari warga akan ditandai khusus.',
      'Gunakan tombol "Tandai Semua Dibaca" untuk merapikan daftar notifikasi.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Pengaturan & Verifikasi Profil',
    badge: 'Identitas Warga',
    steps: [
      'Akses menu Profil Pengguna melalui foto profil di pojok kanan dashboard.',
      'Lengkapi identitas: Nomor KTP (NIK), nomor WhatsApp aktif, dan blok rumah.',
      'Data kependudukan warga diverifikasi secara berkala oleh pengurus RW.',
      'Profil yang terverifikasi memastikan laporan diprioritaskan oleh petugas.',
    ],
  },
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Bantuan', href: '/#faq' },
            { label: 'Panduan Pengguna' },
          ]}
          kicker="Pusat Bantuan & Regulasi"
          title="Panduan Penggunaan Portal"
          description="Petunjuk operasional lengkap bagi warga untuk melaporkan kendala lingkungan, memantau progres lapangan, dan mengelola data kependudukan."
        />

        {/* Modular Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <section
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-800/20">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                      {guide.badge}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {guide.title}
                  </h2>

                  <ol className="space-y-2.5">
                    {guide.steps.map((step, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="h-4.5 w-4.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Tahap {i + 1} dari 4</span>
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </section>
            );
          })}
        </div>

        {/* Emergency vs Normal Guidance Callout */}
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <ShieldAlert size={22} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Laporan Situasi Genting
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/90 leading-relaxed">
                Untuk kebakaran, pipa gas bocor, atau ancaman keselamatan mendesak, segera hubungi Hotline Darurat 24 Jam.
              </p>
            </div>
          </div>
          <Link
            href="/informasi/darurat"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4.5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 whitespace-nowrap"
          >
            <span>Lihat Kontak Darurat</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
