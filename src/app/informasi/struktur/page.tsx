import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Building2, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Struktur Pengurus | Smart Complaint',
}

export default function StrukturPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <Building2 size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-ink">Struktur Pengurus</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Susunan kepengurusan Perumahan Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="text-center border-b border-brand-hairline pb-8">
            <div className="h-16 w-16 bg-brand-primary rounded-2xl flex items-center justify-center text-[#0e0f0c] mx-auto mb-4">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-ink">Ketua RW</h2>
            <p className="text-sm text-brand-ink/50 font-medium">Bapak Bambang Susilo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { role: 'Sekretaris', name: 'Ibu Dewi Sartika' },
              { role: 'Bendahara', name: 'Bapak Ahmad Fauzi' },
              { role: 'Keamanan', name: 'Bapak Hendra Gunawan' },
              { role: 'Kebersihan', name: 'Bapak Rudi Hartono' },
            ].map((item, i) => (
              <div key={i} className="bg-brand-canvas-soft rounded-xl p-5 border border-brand-hairline">
                <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">{item.role}</h3>
                <p className="text-base font-bold text-brand-ink mt-1">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-canvas-soft rounded-xl p-5 border border-brand-hairline flex items-start gap-3">
            <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
            <p className="text-sm text-brand-ink/60 font-medium">Setiap RT memiliki Ketua RT yang bertanggung jawab langsung kepada Ketua RW. Hubungi pengurus RT/RW Anda untuk informasi lebih lanjut.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
