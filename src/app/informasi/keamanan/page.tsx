import React from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  Car,
  BellRing,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Pos & Jadwal Keamanan | Portal Pengaduan Pesona Serpong',
  description: 'Jadwal shift satpam, lokasi pos ronda, dan standar operasional keamanan lingkungan Perumahan Pesona Serpong.',
};

const POSTS = [
  {
    title: 'Pos Keamanan Gerbang Utama',
    location: 'Akses Masuk Depan (Jalan Boulevard)',
    schedule: '24 Jam Non-Stop',
    officers: '2 Personel per Shift',
    icon: ShieldCheck,
    isPrimary: true,
  },
  {
    title: 'Pos Jaga 2 (Sektor Barat)',
    location: 'Persimpangan Jalan Flamboyan & Blok D',
    schedule: '24 Jam Non-Stop',
    officers: '1 Personel per Shift',
    icon: MapPin,
    isPrimary: false,
  },
  {
    title: 'Pos Ronda 3 (Taman Belakang)',
    location: 'Area Fasum Balai Warga & Lapangan',
    schedule: '18.00 - 06.00 WIB',
    officers: 'Patroli Terjadwal + Warga',
    icon: Clock,
    isPrimary: false,
  },
  {
    title: 'Patroli Bergerak (Mobile Patrol)',
    location: 'Keliling Blok A hingga Blok K',
    schedule: '22.00 - 05.00 WIB (Interval 1 Jam)',
    officers: 'Regu Patroli Bermotor',
    icon: Car,
    isPrimary: false,
  },
];

const RULES = [
  {
    title: 'Tamu Wajib Lapor',
    desc: 'Tamu atau kurir luar yang masuk setelah pukul 22.00 WIB wajib melapor di Pos Gerbang Utama dan menukar identitas.',
    icon: KeyRound,
  },
  {
    title: 'Penutupan Portal Sektor',
    desc: 'Portal sisi timur dan barat dikunci mulai pukul 23.00 WIB. Seluruh keluar-masuk kendaraan wajib melalui Gerbang Utama.',
    icon: Clock,
  },
  {
    title: 'Sterilisasi Jalur Darurat',
    desc: 'Dilarang keras memarkir kendaraan di tikungan sempit atau di depan titik hidran agar mobil pemadam dan ambulans tidak terhalang.',
    icon: AlertCircle,
  },
  {
    title: 'Laporan Kehilangan / Kerusakan',
    desc: 'Bila melihat orang mencurigakan atau terjadi insiden, hubungi satpam seketika via telepon atau buat laporan dengan tag keamanan.',
    icon: BellRing,
  },
];

export default function KeamananPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Informasi', href: '/#kategori' },
            { label: 'Pos & Jadwal Keamanan' },
          ]}
          kicker="Kamtibmas Lingkungan"
          title="Pos & Jadwal Jaga Keamanan"
          description="Informasi titik pos jaga, pembagian jadwal siskamling, dan standar operasional keamanan bagi warga Perumahan Pesona Serpong."
        />

        {/* Primary Contact Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              Hotline Cepat Pos Induk
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Pos Keamanan Gerbang Depan (24 Jam)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Langsung terhubung dengan regu satpam yang sedang bertugas saat ini.
            </p>
          </div>

          <a
            href="tel:0215382345"
            aria-label="Hubungi Pos Keamanan di (021) 538-2345"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-mono text-sm font-bold shadow-md shadow-blue-800/20 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
          >
            <PhoneCall size={16} />
            <span>(021) 538-2345</span>
          </a>
        </div>

        {/* Guard Posts & Schedules */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Titik Penjagaan &amp; Shift Petugas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POSTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.schedule}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {item.location}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Kekuatan: {item.officers}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Rules */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Peraturan &amp; Tata Tertib Keamanan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map((rule, i) => {
              const Icon = rule.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5"
                >
                  <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-800 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={17} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rule.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
