import React from 'react';
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Building2,
  ArrowRight,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Kontak Pengurus RW 08 | Portal Pengaduan Pesona Serpong',
  description: 'Alamat sekretariat, nomor hotline WhatsApp pengurus, dan jam operasional pelayanan warga Perumahan Pesona Serpong.',
};

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    label: 'Telepon Hotline Pos Induk',
    value: '(021) 538-2345',
    subtext: 'Layanan 24 Jam Regu Satpam & Keamanan',
    href: 'tel:0215382345',
    actionLabel: 'Panggil',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Pelayanan Warga',
    value: '+62 812-9876-5432',
    subtext: 'Respons cepat pada jam kerja pengurus RW 08',
    href: 'https://wa.me/6281298765432',
    actionLabel: 'Chat WhatsApp',
  },
  {
    icon: Mail,
    label: 'Surat Elektronik (Email)',
    value: 'sekretariat@pesonaserpong.id',
    subtext: 'Untuk surat resmi permohonan atau dokumen kerja sama',
    href: 'mailto:sekretariat@pesonaserpong.id',
    actionLabel: 'Kirim Email',
  },
];

const WORKING_HOURS = [
  { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB', note: 'Pelayanan administrasi & surat pengantar' },
  { days: 'Sabtu', hours: '08.00 - 12.00 WIB', note: 'Piket konsultasi pengurus RW' },
  { days: 'Minggu & Hari Libur', hours: 'Tutup (Kecuali Darurat)', note: 'Dilayani via regu keamanan pos induk' },
];

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Bantuan', href: '/#faq' },
            { label: 'Kontak Pengurus' },
          ]}
          kicker="Komunikasi & Pelayanan Warga"
          title="Hubungi Pengurus Lingkungan"
          description="Sekretariat Balai Warga RW 08 siap melayani kebutuhan surat pengantar, klarifikasi aspirasi, dan koordinasi keamanan lingkungan."
        />

        {/* Contact Channels Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Saluran Komunikasi Resmi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONTACT_CHANNELS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-800/20">
                      <Icon size={19} />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                        {item.label}
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 break-all">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                        {item.subtext}
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-1.5 w-full min-h-[44px] px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secretariat Address & Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
                  Lokasi Fisik
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sekretariat Balai Warga RW 08
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Kompleks Perumahan Pesona Serpong, Kelurahan Serpong, Kecamatan Serpong, Kota Tangerang Selatan, Banten 15311.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Patokan Lokasi:</p>
              <p>Tepat di samping Lapangan Serbaguna &amp; Pos Satpam Sektor Timur.</p>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
                  Jadwal Layanan
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Jam Operasional Pelayanan
                </h3>
              </div>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {WORKING_HOURS.map((wh, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{wh.days}</span>
                    <span className="font-mono font-bold text-blue-800 dark:text-blue-400">{wh.hours}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {wh.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
