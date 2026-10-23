import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Building2,
  FileCheck2,
  Coins,
  Wrench,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Struktur Pengurus RT/RW | Portal Pengaduan Pesona Serpong',
  description: 'Bagan dan susunan kepengurusan Rukun Warga (RW 08) dan Rukun Tetangga (RT) Perumahan Pesona Serpong.',
};

const DIVISIONS = [
  {
    role: 'Sekretariat RW',
    duty: 'Administrasi kependudukan, surat pengantar, dan dokumentasi rapat warga.',
    icon: FileCheck2,
  },
  {
    role: 'Keuangan & Bendahara',
    duty: 'Pengelolaan iuran pengelolaan lingkungan (IPL) dan transparansi anggaran operasional.',
    icon: Coins,
  },
  {
    role: 'Keamanan & Ketertiban',
    duty: 'Supervisi pos satpam 24 jam, patroli malam, dan koordinasi Babinsa/Bhabinkamtibmas.',
    icon: ShieldCheck,
  },
  {
    role: 'Pembangunan & Sarpras',
    duty: 'Pemeliharaan jalan paving, lampu penerangan (PJU), dan saluran air got/drainase.',
    icon: Wrench,
  },
  {
    role: 'Kebersihan & Sanitasi',
    duty: 'Jadwal pengangkutan truk sampah lingkungan dan kerja bakti rutin berkala.',
    icon: Building2,
  },
  {
    role: 'Sosial & Kehumasan',
    duty: 'Agenda perayaan hari besar, santunan warga, dan mediasi kerukunan bertetangga.',
    icon: HeartHandshake,
  },
];

const RT_LIST = [
  { code: 'RT 01', zone: 'Blok A & B', leader: 'Koordinator RT 01' },
  { code: 'RT 02', zone: 'Blok C & D', leader: 'Koordinator RT 02' },
  { code: 'RT 03', zone: 'Blok E & F', leader: 'Koordinator RT 03' },
  { code: 'RT 04', zone: 'Blok G & H', leader: 'Koordinator RT 04' },
  { code: 'RT 05', zone: 'Blok I & J', leader: 'Koordinator RT 05' },
  { code: 'RT 06', zone: 'Blok K & Fasum', leader: 'Koordinator RT 06' },
];

export default function StrukturPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Informasi', href: '/#kategori' },
            { label: 'Struktur Pengurus' },
          ]}
          kicker="Tata Kelola Lingkungan"
          title="Struktur Kepengurusan RW 08"
          description="Susunan penanggung jawab organisasi Rukun Warga dan Rukun Tetangga Perumahan Pesona Serpong, Kelurahan Serpong."
        />

        {/* Chairperson Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-md shadow-blue-800/20 shrink-0">
              <Users size={28} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
                Pimpinan Wilayah
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ketua Rukun Warga (RW 08)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Sekretariat: Balai Pertemuan Warga RW 08 Pesona Serpong
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold font-mono">
            Periode Aktif 2024 - 2027
          </span>
        </div>

        {/* Section Divisions */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Seksi &amp; Bidang Operasional RW
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIVISIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 hover:border-blue-300 dark:hover:border-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                    {item.duty}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RT Zones */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Wilayah Rukun Tetangga (RT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {RT_LIST.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1.5 text-center hover:border-slate-300 transition-colors"
              >
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-800 dark:text-blue-300">
                  {item.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.leader}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {item.zone}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact RW Action */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Perlu Berkoordinasi dengan Pengurus?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Kunjungi halaman kontak pengelola atau kirimkan aspirasi langsung melalui portal.
            </p>
          </div>
          <Link
            href="/bantuan/kontak"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs transition-colors shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span>Hubungi Sekretariat</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
