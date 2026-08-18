import React from 'react'
import Link from 'next/link'
import { FileText, MapPin, ClipboardCheck, CheckCircle2, Users, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Alur Pengaduan | Smart Complaint',
}

const STEPS = [
  {
    num: '01',
    title: 'Kirim Laporan',
    desc: 'Warga mengirimkan laporan melalui platform dengan mengisi detail masalah, foto, dan lokasi kejadian.',
    icon: FileText,
  },
  {
    num: '02',
    title: 'Verifikasi Lokasi',
    desc: 'Sistem mendeteksi otomatis blok dan nomor rumah berdasarkan koordinat GPS.',
    icon: MapPin,
  },
  {
    num: '03',
    title: 'Ditinjau Petugas',
    desc: 'Petugas menerima notifikasi, meninjau dan mengkategorikan laporan sebelum ditindaklanjuti.',
    icon: ClipboardCheck,
  },
  {
    num: '04',
    title: 'Proses Penanganan',
    desc: 'Petugas lapangan melakukan investigasi dan perbaikan sesuai jenis laporan.',
    icon: CheckCircle2,
  },
  {
    num: '05',
    title: 'Selesai & Evaluasi',
    desc: 'Laporan ditutup setelah masalah teratasi. Warga mendapat notifikasi penyelesaian.',
    icon: Users,
  },
]

export default function AlurPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Alur Kerja Pengaduan</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">
            Dari pengiriman laporan hingga penyelesaian — semua tahap terdokumentasi dan transparan.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-brand-hairline border-y border-brand-hairline">
          {STEPS.map((step, i) => (
            <div key={i} className="py-5 flex gap-5 sm:gap-8">
              <div className="flex items-center gap-3 shrink-0 pt-0.5">
                <span className="text-xl font-bold text-brand-primary font-mono tabular-nums">{step.num}</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-brand-ink">{step.title}</h2>
                <p className="text-xs text-brand-ink/70 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-panel rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-brand-hairline">
          <div className="space-y-1 text-left">
            <h2 className="text-lg font-bold text-brand-panel-fg tracking-tight">Siap Melapor?</h2>
            <p className="text-xs text-brand-panel-fg/60">Buat akun warga untuk mulai mengirim laporan ke pengurus.</p>
          </div>
          <Link
            href="/register"
            className="bg-brand-primary text-[#0e0f0c] font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 inline-flex items-center gap-2"
          >
            Daftar Warga <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  )
}


