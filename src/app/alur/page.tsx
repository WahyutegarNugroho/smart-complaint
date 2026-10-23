import React from 'react';
import Link from 'next/link';
import {
  FileText,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const metadata = {
  title: 'Alur Pengaduan | Portal Pengaduan Pesona Serpong',
  description: 'Diagram tahapan dan alur kerja penanganan aspirasi serta pengaduan warga Perumahan Pesona Serpong.',
};

const STEPS = [
  {
    num: '01',
    title: 'Kirim Laporan',
    sla: 'Waktu: 2-3 Menit',
    desc: 'Warga mengisi formulir pengaduan secara mandiri melalui portal: menyertakan judul, rincian keluhan, foto bukti dokumentasi fisik, dan titik koordinat lokasi kejadian.',
    icon: FileText,
  },
  {
    num: '02',
    title: 'Verifikasi Lokasi & Data',
    sla: 'Otomatis Real-time',
    desc: 'Sistem memverifikasi domisili pelapor dan menandai lokasi RT/RW serta blok perumahan menggunakan koordinat GPS terintegrasi untuk akurasi penugasan.',
    icon: MapPin,
  },
  {
    num: '03',
    title: 'Ditinjau Pengurus & Disposisi',
    sla: 'Maks. 2 Jam Respons',
    desc: 'Pengurus RT/RW menerima notifikasi laporan, memvalidasi prioritas (Normal atau Darurat), lalu menugaskan petugas teknis lapangan terkait.',
    icon: ClipboardCheck,
  },
  {
    num: '04',
    title: 'Proses Penanganan Lapangan',
    sla: 'Target 1x24 - 48 Jam',
    desc: 'Petugas lapangan datang ke lokasi untuk melakukan investigasi fisik, perbaikan sarana lingkungan, dan mengunggah foto progres langsung ke sistem.',
    icon: CheckCircle2,
  },
  {
    num: '05',
    title: 'Selesai & Evaluasi Warga',
    sla: 'Penyelesaian Tuntas',
    desc: 'Laporan diverifikasi selesai oleh pengurus. Warga pelapor menerima notifikasi hasil pengerjaan serta dapat memberikan ulasan kepuasan layanan.',
    icon: Users,
  },
];

export default function AlurPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[{ label: 'Alur Pengaduan' }]}
          kicker="Transparansi Layanan Publik"
          title="Alur Kerja Penanganan Pengaduan"
          description="Dari pengiriman laporan hingga penyelesaian tuntas. Seluruh tahapan terdokumentasi secara transparan dan dapat dipantau langsung oleh warga."
          action={
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap w-full sm:w-auto"
            >
              <span>Mulai Melapor</span>
              <ArrowRight size={14} />
            </Link>
          }
        />

        {/* Step-by-Step Civic Timeline Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-800 dark:text-blue-400" />
              <span>5 Tahapan Standar Penanganan</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              SOP RT/RW 08
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-900 transition-colors flex flex-col sm:flex-row sm:items-start gap-5"
                >
                  <div className="flex items-center sm:items-start gap-4 shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-800/20">
                      <Icon size={22} />
                    </div>
                    <div className="sm:hidden flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/40">
                        Langkah {step.num}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="hidden sm:inline-block text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/40">
                          Tahap {step.num}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        <Clock size={12} className="text-blue-700 dark:text-blue-400" />
                        <span>{step.sla}</span>
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Civic Callout Section */}
        <div className="p-8 sm:p-10 rounded-2xl bg-blue-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-950/10">
          <div className="space-y-2 text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-blue-200 text-xs font-semibold">
              <Sparkles size={13} />
              <span>Akses Warga Mandiri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Siap Mengirimkan Laporan Lingkungan?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Daftarkan akun warga untuk mulai melaporkan kerusakan sarana, keluhan kebersihan, atau gangguan ketertiban secara resmi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30 active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
            >
              <span>Daftar Akun Warga</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-lg border border-white/25 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-wider transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
            >
              <span>Masuk Portal</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
