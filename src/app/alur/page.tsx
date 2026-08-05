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

        <div className="relative">
          <div className="absolute left-6 sm:left-7 top-0 bottom-0 w-0.5 bg-brand-hairline hidden sm:block" />
          <div className="space-y-8 sm:space-y-12">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col sm:flex-row gap-6 sm:gap-10 group">
                <div className="hidden sm:flex flex-col items-center shrink-0">
                  <div className={`h-14 w-14 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-brand-canvas relative z-10 transition-transform group-hover:scale-110`}>
                    <step.icon size={24} />
                  </div>
                </div>

                <div className="sm:hidden flex items-center gap-4">
                  <div className={`h-10 w-10 ${step.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                    <step.icon size={18} />
                  </div>
                  <span className="text-[10px] font-semibold text-brand-ink/30 uppercase tracking-wider">
                    Langkah {i + 1}
                  </span>
                </div>

                <div className="flex-1 bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm transition-all group-hover:shadow-xl group-hover:border-brand-primary/30">
                  <div className="hidden sm:flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-semibold text-brand-ink/30 uppercase tracking-wider">
                      Langkah {i + 1}
                    </span>
                    <span className="h-px flex-1 bg-brand-hairline" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-ink mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-brand-ink/70 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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


