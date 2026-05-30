import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from 'lucide-react'

export const metadata = {
  title: 'Kebijakan Privasi | Smart Complaint',
}

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">Kebijakan Privasi</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Bagaimana kami melindungi data pribadi Anda.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          {[
            { icon: Lock, title: 'Pengumpulan Data', desc: 'Kami hanya mengumpulkan data yang diperlukan untuk verifikasi identitas dan domisili, seperti nama, NIK, nomor telepon, dan alamat. Data dikumpulkan dengan persetujuan Anda saat registrasi.' },
            { icon: Eye, title: 'Penggunaan Data', desc: 'Data Anda digunakan semata-mata untuk keperluan administrasi pengaduan, verifikasi warga, dan koordinasi dengan pengurus RT/RW. Data tidak akan digunakan untuk tujuan lain tanpa persetujuan Anda.' },
            { icon: Database, title: 'Penyimpanan & Keamanan', desc: 'Data disimpan dalam server terenkripsi dengan akses terbatas. Hanya pengurus RW dan petugas yang berwenang yang dapat mengakses data kependudukan warga.' },
            { icon: ShieldCheck, title: 'Hak Anda', desc: 'Anda berhak mengakses, memperbarui, dan menghapus data pribadi Anda kapan saja melalui halaman pengaturan profil. Hubungi pengurus RW jika memerlukan bantuan.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="h-10 w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-primary border border-brand-hairline shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-ink mb-1">{item.title}</h3>
                <p className="text-sm text-brand-ink/60 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}


