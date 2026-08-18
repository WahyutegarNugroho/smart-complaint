import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Kebijakan Privasi | Smart Complaint',
}

const ITEMS = [
  { title: 'Pengumpulan Data', desc: 'Kami hanya mengumpulkan data yang diperlukan untuk verifikasi identitas dan domisili: nama, NIK, nomor telepon, dan alamat. Data dikumpulkan dengan persetujuan Anda saat registrasi.' },
  { title: 'Penggunaan Data', desc: 'Data digunakan semata-mata untuk administrasi pengaduan, verifikasi warga, dan koordinasi dengan pengurus RT/RW. Tidak akan digunakan untuk tujuan lain tanpa persetujuan.' },
  { title: 'Penyimpanan & Keamanan', desc: 'Data disimpan di server terenkripsi dengan akses terbatas. Hanya pengurus RW dan petugas berwenang yang dapat mengakses data kependudukan warga.' },
  { title: 'Hak Anda', desc: 'Anda berhak mengakses, memperbarui, dan menghapus data pribadi kapan saja melalui halaman pengaturan profil. Hubungi pengurus RW jika memerlukan bantuan.' },
]

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Kebijakan Privasi</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Bagaimana kami melindungi data pribadi Anda.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          {ITEMS.map((item, i) => (
            <div key={i} className="p-5 sm:p-6 space-y-1">
              <h2 className="text-sm font-bold text-brand-ink">{item.title}</h2>
              <p className="text-sm text-brand-ink/60 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
