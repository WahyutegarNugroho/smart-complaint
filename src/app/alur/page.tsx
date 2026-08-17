import React from 'react'
import Link from 'next/link'
import { Zap, ArrowLeft, FileText, MapPin, ClipboardCheck, CheckCircle2, Users, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Alur Pengaduan | Smart Complaint',
}

const STEPS = [
  {
    icon: FileText,
    title: 'Kirim Laporan',
    desc: 'Warga mengirimkan laporan melalui platform dengan mengisi detail masalah, foto, dan lokasi kejadian. Laporan akan langsung tercatat di sistem.',
    color: 'bg-blue-500',
  },
  {
    icon: MapPin,
    title: 'Verifikasi Lokasi',
    desc: 'Sistem mendeteksi otomatis blok dan nomor rumah berdasarkan koordinat GPS. Pengurus RT/RW dapat memverifikasi kebenaran data domisili pelapor.',
    color: 'bg-amber-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Ditinjau Petugas',
    desc: 'Petugas menerima notifikasi dan meninjau laporan yang masuk. Laporan akan divalidasi dan dikategorikan sebelum ditindaklanjuti ke tahap penanganan.',
    color: 'bg-purple-500',
  },
  {
    icon: CheckCircle2,
    title: 'Proses Penanganan',
    desc: 'Petugas lapangan melakukan investigasi dan perbaikan sesuai dengan jenis laporan. Perkembangan penanganan dapat dipantau secara real-time oleh warga.',
    color: 'bg-brand-primary',
  },
  {
    icon: Users,
    title: 'Selesai & Evaluasi',
    desc: 'Laporan ditutup setelah masalah teratasi. Warga mendapat notifikasi penyelesaian dan dapat memberikan umpan balik untuk evaluasi kinerja pengurus.',
    color: 'bg-emerald-500',
  },
]

export default function AlurPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-12 sm:space-y-16">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <Zap size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">
              Alur Pengaduan Warga
            </h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
            Pelajari bagaimana proses pengaduan berjalan — dari laporan masuk hingga penyelesaian. Transparan, cepat, dan terintegrasi.
          </p>
        </div>

        <ol className="relative divide-y divide-brand-hairline border-y border-brand-hairline">
          {STEPS.map((step, i) => (
            <li key={i} className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              <div className="flex items-center gap-3 sm:w-44 shrink-0">
                <span className="font-mono text-sm font-bold text-brand-primary tabular-nums">0{i + 1}.</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-ink/50">Langkah</span>
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-brand-ink">{step.title}</h2>
                <p className="text-xs sm:text-sm text-brand-ink/70 leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="bg-brand-panel rounded-3xl p-8 sm:p-12 text-center border border-brand-hairline shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-panel-fg mb-4 tracking-tight">
            Siap Melapor?
          </h2>
          <p className="text-brand-panel-fg/60 font-medium text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Bergabunglah dengan 500+ warga Pesona Serpong yang telah menggunakan platform ini untuk lingkungan yang lebih baik.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 bg-brand-primary text-[#0e0f0c] font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all"
          >
            Buat Laporan Sekarang <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  )
}


