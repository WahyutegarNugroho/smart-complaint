import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck2,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Kebijakan Privasi & Perlindungan Data | Portal Pengaduan Pesona Serpong',
  description: 'Komitmen perlindungan data pribadi dan jaminan kerahasiaan identitas pelapor pada Portal Pengaduan Warga Pesona Serpong.',
};

const POLICIES = [
  {
    icon: Database,
    title: '1. Pengumpulan Data Kependudukan',
    desc: 'Kami hanya mengumpulkan data yang relevan untuk verifikasi domisili warga: Nama Lengkap sesuai KTP, Nomor Induk Kependudukan (NIK), alamat blok/nomor rumah di Pesona Serpong, dan nomor kontak WhatsApp aktif. Data dikumpulkan secara sukarela saat warga mendaftarkan akun.',
  },
  {
    icon: FileCheck2,
    title: '2. Tujuan & Penggunaan Informasi',
    desc: 'Data kependudukan warga digunakan semata-mata untuk administrasi pengaduan, verifikasi kebenaran pelapor, serta penugasan petugas teknis ke titik kejadian. Pengurus RW tidak pernah membagikan atau mengomersialkan data warga kepada pihak ketiga mana pun.',
  },
  {
    icon: EyeOff,
    title: '3. Fitur Kerahasiaan & Jaminan Anonim',
    desc: 'Warga memiliki hak penuh untuk memilih opsi "Laporkan Secara Rahasia/Anonim". Pada feed publik dan papan informasi warga, nama pelapor otomatis disamarkan (contoh: "A*** P***"). Identitas lengkap hanya dapat diakses oleh Ketua RW demi kebutuhan klarifikasi faktual.',
  },
  {
    icon: Lock,
    title: '4. Keamanan Penyimpanan & Enkripsi',
    desc: 'Seluruh kredensial kata sandi diamankan menggunakan algoritma hash standar industri. Komunikasi data antara perangkat warga dan server dilindungi protokol enkripsi HTTPS/TLS 1.3 serta akses basis data dengan otentikasi ketat berbasis peran (Role-Based Access Control).',
  },
  {
    icon: KeyRound,
    title: '5. Hak Kontrol & Perbaikan Data Warga',
    desc: 'Warga berhak meninjau, memperbarui, atau mengajukan permohonan penonaktifan akun beserta riwayat laporan pribadi kapan saja melalui menu Pengaturan Profil atau dengan menghubungi Sekretariat RW 08.',
  },
];

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Bantuan', href: '/#faq' },
            { label: 'Kebijakan Privasi' },
          ]}
          kicker="Standar Perlindungan Data Warga"
          title="Kebijakan Privasi & Jaminan Anonim"
          description="Transparansi tata kelola data pribadi dan jaminan perlindungan identitas pelapor di lingkungan Perumahan Pesona Serpong."
        />

        {/* Security Assurance Badge Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Kepatuhan Prinsip Perlindungan Data Pribadi (UU PDP)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Data Anda dilindungi dengan standar keamanan informasi mutakhir dan diawasi langsung oleh Pengurus RW 08.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            Revisi: Oktober 2026
          </span>
        </div>

        {/* Policy Articles */}
        <div className="space-y-4">
          {POLICIES.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>

        {/* Contact RW for Data Questions */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ada Pertanyaan Mengenai Privasi Anda?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tim sekretariat siap memberikan penjelasan lebih lanjut mengenai tata cara penyimpanan data warga.
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
