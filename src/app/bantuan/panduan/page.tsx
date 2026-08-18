import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Panduan Pengguna | Smart Complaint',
}

const GUIDES = [
  {
    title: 'Cara Membuat Laporan',
    steps: [
      'Login ke akun Smart Complaint.',
      'Klik "Buat Laporan" di dashboard.',
      'Isi judul, deskripsi, dan kategori masalah.',
      'Pilih lokasi melalui peta interaktif.',
      'Lampirkan foto jika diperlukan.',
      'Klik "Kirim Laporan" untuk mengirimkan.',
    ],
  },
  {
    title: 'Memantau Progres Laporan',
    steps: [
      'Buka Dashboard untuk melihat daftar laporan.',
      'Status: Menunggu, Diproses, atau Selesai.',
      'Klik laporan untuk melihat detail dan riwayat.',
      'Notifikasi muncul saat status berubah.',
    ],
  },
  {
    title: 'Mengelola Notifikasi',
    steps: [
      'Klik ikon lonceng di pojok kanan atas.',
      'Notifikasi baru ditandai dengan latar berbeda.',
      'Klik centang untuk menandai sudah dibaca.',
      'Gunakan "Tandai Semua" untuk penandaan massal.',
    ],
  },
  {
    title: 'Memperbarui Profil',
    steps: [
      'Buka halaman Pengaturan Profil.',
      'Lengkapi nama, NIK, nomor WhatsApp, dan alamat.',
      'NIK untuk verifikasi data kependudukan.',
      'Profil lengkap mempercepat verifikasi pengurus.',
    ],
  },
]

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Panduan Pengguna</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Petunjuk penggunaan Smart Complaint untuk warga Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          {GUIDES.map((guide, i) => (
            <div key={i} className="p-5 sm:p-6">
              <h2 className="text-sm font-bold text-brand-ink mb-3">{guide.title}</h2>
              <ol className="space-y-2">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-xs text-brand-ink/70 font-medium">
                    <span className="font-mono tabular-nums text-[10px] font-semibold text-brand-ink/30 mt-0.5 shrink-0">
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
