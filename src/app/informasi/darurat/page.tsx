import React from 'react';
import {
  ShieldAlert,
  Flame,
  Ambulance,
  PhoneCall,
  Zap,
  AlertTriangle,
  Radio,
  Building,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Kontak Darurat | Portal Pengaduan Pesona Serpong',
  description: 'Daftar nomor kontak darurat terpadu 24 jam untuk warga Perumahan Pesona Serpong, Kelurahan Serpong, Tangerang Selatan.',
};

const EMERGENCY_CONTACTS = [
  {
    name: 'Pos Keamanan Utama Gerbang Depan',
    desc: 'Regu Jaga Satpam Pesona Serpong (24 Jam Non-Stop)',
    phone: '(021) 538-2345',
    cleanPhone: '0215382345',
    icon: ShieldAlert,
    tag: 'Internal Perumahan',
    isPrimary: true,
  },
  {
    name: 'Pemadam Kebakaran (Damkar Tangsel)',
    desc: 'Pos Damkar Sektor Serpong & BSD',
    phone: '113',
    cleanPhone: '113',
    icon: Flame,
    tag: 'Penanggulangan Bencana',
    isPrimary: false,
  },
  {
    name: 'Ambulans & Gawat Darurat Medis',
    desc: 'Layanan Tanggap Cepat Medis Kemenkes / PSC 119',
    phone: '119',
    cleanPhone: '119',
    icon: Ambulance,
    tag: 'Kesehatan Darurat',
    isPrimary: false,
  },
  {
    name: 'Polsek Serpong (Polres Tangerang Selatan)',
    desc: 'Layanan Pengaduan Kejahatan & Gangguan Kamtibmas',
    phone: '110',
    cleanPhone: '110',
    icon: Radio,
    tag: 'Kepolisian RI',
    isPrimary: false,
  },
  {
    name: 'Gangguan Listrik PLN Tangsel',
    desc: 'Layanan Pemadaman, Kabel Putus, Trafo Rusak',
    phone: '123',
    cleanPhone: '123',
    icon: Zap,
    tag: 'Utilitas Publik',
    isPrimary: false,
  },
];

export default function DaruratPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Informasi', href: '/#kategori' },
            { label: 'Kontak Darurat' },
          ]}
          kicker="Layanan Tanggap Cepat 24 Jam"
          title="Kontak Darurat Terpadu"
          description="Daftar nomor kontak instansi tanggap darurat resmi untuk keselamatan warga Perumahan Pesona Serpong."
        />

        {/* Warning Callout Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3.5">
          <AlertTriangle size={20} className="text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
              Protokol Keadaan Darurat
            </h2>
            <p className="text-xs text-red-700 dark:text-red-300/90 leading-relaxed">
              Khusus untuk kondisi mengancam nyawa, kebakaran, atau tindak kriminal yang membutuhkan tindakan seketika. Untuk keluhan fasilitas non-darurat, gunakan formulir pengaduan portal agar terdokumentasi dan terpantau SOP perbaikannya.
            </p>
          </div>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Daftar Hotline Instansi
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {EMERGENCY_CONTACTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                    item.isPrimary
                      ? 'border-blue-300 dark:border-blue-800/80 ring-1 ring-blue-500/20'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        item.isPrimary
                          ? 'bg-blue-800 text-white shadow-blue-800/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.tag}
                        </span>
                        {item.isPrimary && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Resmi Lingkungan
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <a
                      href={`tel:${item.cleanPhone}`}
                      aria-label={`Hubungi ${item.name} di nomor ${item.phone}`}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-mono text-sm font-bold tracking-wider shadow-sm transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
                    >
                      <PhoneCall size={15} />
                      <span>{item.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guidance for Safe Calls */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Building size={15} className="text-blue-800 dark:text-blue-400" />
            <span>Panduan Komunikasi Saat Menghubungi Petugas</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
            <li>Sebutkan nama jelas, nomor kontak aktif, dan lokasi blok rumah di Pesona Serpong.</li>
            <li>Jelaskan jenis bahaya (misal: kebakaran panel listrik, kebocoran pipa utama, orang mencurigakan).</li>
            <li>Pastikan Anda dan keluarga berada di posisi yang aman sebelum melakukan panggilan.</li>
            <li>Jangan menutup telepon sebelum petugas memastikan data lokasi sudah lengkap.</li>
          </ul>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
