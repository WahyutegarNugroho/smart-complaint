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
  { name: 'Kepolisian', phone: '110', icon: Shield, color: 'bg-indigo-500' },
]

export default function DaruratPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
              <PhoneCall size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-ink">Kontak Darurat</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Nomor kontak penting untuk situasi darurat di lingkungan Pesona Serpong.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map((item, i) => (
            <div key={i} className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 ${item.color} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-ink">{item.name}</h3>
                  <a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`} className="text-xl font-extrabold text-brand-primary hover:underline mt-1 block">
                    {item.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">Penggunaan Darurat</h2>
          <ul className="space-y-2 text-sm text-brand-ink/70 font-medium">
            {['Gunakan nomor di atas hanya untuk keadaan darurat yang membutuhkan respon cepat.', 'Untuk laporan non-darurat, gunakan platform Smart Complaint agar tercatat dengan baik.', 'Pastikan Anda berada di lokasi yang aman saat menghubungi kontak darurat.'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
