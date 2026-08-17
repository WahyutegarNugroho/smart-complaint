import React from 'react'
import Link from 'next/link'
import { ArrowLeft, PhoneCall, Shield, Ambulance, Flame } from 'lucide-react'

export const metadata = {
  title: 'Kontak Darurat | Smart Complaint',
}

const EMERGENCY_CONTACTS = [
  { name: 'Pos Keamanan Pesona Serpong', phone: '(021) 1234-5678', icon: Shield, color: 'bg-blue-500' },
  { name: 'Pemadam Kebakaran', phone: '113', icon: Flame, color: 'bg-red-500' },
  { name: 'Ambulans / Rumah Sakit', phone: '118 / 119', icon: Ambulance, color: 'bg-emerald-500' },
  { name: 'Kepolisian', phone: '110', icon: Shield, color: 'bg-brand-primary' },
]

export default function DaruratPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
              <PhoneCall size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">Kontak Darurat</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Nomor kontak penting untuk situasi darurat di lingkungan Pesona Serpong.</p>
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
                className="px-4 py-2 bg-brand-canvas-soft hover:bg-brand-hairline border border-brand-hairline rounded-lg text-sm font-bold font-mono tabular-nums text-brand-primary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {item.phone}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl p-5 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-ink">Ketentuan Penggunaan Darurat</h2>
          <ul className="space-y-1.5 text-xs text-brand-ink/70 leading-relaxed list-disc list-inside">
            <li>Gunakan nomor di atas khusus keadaan darurat yang membutuhkan tindakan segera.</li>
            <li>Untuk laporan pemeliharaan rutin/non-darurat, kirim aduan melalui aplikasi agar terdokumentasi.</li>
            <li>Pastikan Anda berada di posisi aman saat melakukan panggilan.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}


