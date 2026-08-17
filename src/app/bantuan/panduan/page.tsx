import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Smartphone, Bell, UserCheck } from 'lucide-react'

export const metadata = {
  title: 'Panduan Pengguna | Smart Complaint',
}

const GUIDES = [
  {
    icon: FileText,
    title: 'Cara Membuat Laporan',
    steps: [
      'Login ke akun Smart Complaint Anda.',
      'Klik tombol "Buat Laporan" di halaman utama dashboard.',
      'Isi judul, deskripsi, dan kategori masalah.',
      'Pilih lokasi kejadian melalui peta interaktif.',
      'Lampirkan foto jika diperlukan.',
      'Klik "Kirim Laporan" untuk mengirimkan pengaduan.',
    ],
  },
  {
    icon: Smartphone,
    title: 'Memantau Progres Laporan',
    steps: [
      'Buka halaman Dashboard untuk melihat daftar laporan.',
      'Setiap laporan memiliki status: Menunggu, Diproses, atau Selesai.',
      'Klik laporan untuk melihat detail dan riwayat tanggapan.',
      'Notifikasi akan muncul ketika ada perubahan status atau tanggapan baru.',
    ],
  },
  {
    icon: Bell,
    title: 'Mengelola Notifikasi',
    steps: [
      'Klik ikon lonceng di pojok kanan atas untuk membuka panel notifikasi.',
      'Notifikasi baru akan muncul dengan latar belakang berbeda.',
      'Klik ikon centang untuk menandai notifikasi sebagai sudah dibaca.',
      'Gunakan tombol "Sudah Dibaca" untuk menandai semua notifikasi sekaligus.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Memperbarui Profil',
    steps: [
      'Buka halaman Pengaturan Profil dari menu navigasi.',
      'Lengkapi data diri: Nama, NIK, nomor WhatsApp, dan alamat.',
      'NIK digunakan untuk verifikasi data kependudukan.',
      'Profil yang lengkap membantu proses verifikasi oleh pengurus RT/RW.',
    ],
  },
]

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Panduan Pengguna</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Pelajari cara menggunakan platform Smart Complaint untuk warga Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline shadow-sm">
          {GUIDES.map((guide, i) => (
            <div key={i} className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <guide.icon size={18} className="text-brand-primary shrink-0" />
                <h2 className="text-sm font-bold text-brand-ink">{guide.title}</h2>
              </div>
              <ol className="space-y-2.5">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-brand-ink/70 font-medium">
                    <span className="font-mono tabular-nums text-[10px] font-semibold text-brand-ink/30 mt-1 shrink-0 w-4 text-right">
                      {j + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
