import React from 'react'
import Link from 'next/link'
import { Shield, Ambulance, Flame } from 'lucide-react'

export const metadata = {
  title: 'Kontak Darurat | Smart Complaint',
}

const EMERGENCY_CONTACTS = [
  { name: 'Pos Keamanan Pesona Serpong', phone: '(021) 1234-5678', icon: Shield },
  { name: 'Pemadam Kebakaran', phone: '113', icon: Flame },
  { name: 'Ambulans / Rumah Sakit', phone: '118 / 119', icon: Ambulance },
  { name: 'Kepolisian', phone: '110', icon: Shield },
]

export default function DaruratPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Kontak Darurat</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Nomor penting untuk situasi darurat di Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          {EMERGENCY_CONTACTS.map((item, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-brand-ink">{item.name}</h2>
                <p className="text-xs text-brand-ink/50 mt-0.5">Layanan Tanggap Darurat</p>
              </div>
              <a 
                href={`tel:${item.phone.replace(/[^+\d]/g, '')}`} 
                aria-label={`Hubungi ${item.name} di ${item.phone}`}
                className="px-3 py-2 bg-brand-canvas-soft hover:bg-brand-hairline border border-brand-hairline rounded-lg text-sm font-bold font-mono tabular-nums text-brand-primary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {item.phone}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl p-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-ink">Penggunaan Darurat</h2>
          <ul className="space-y-1 text-xs text-brand-ink/70 leading-relaxed list-disc list-inside">
            <li>Hanya gunakan nomor di atas untuk keadaan darurat yang membutuhkan tindakan segera.</li>
            <li>Untuk laporan non-darurat, gunakan platform agar terdokumentasi.</li>
            <li>Pastikan Anda di posisi aman saat melakukan panggilan.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}


