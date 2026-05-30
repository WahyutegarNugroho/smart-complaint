import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Kontak Kami | Smart Complaint',
}

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <Mail size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">Kontak Kami</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Hubungi pengelola Smart Complaint Pesona Serpong.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <Mail size={22} />
            </div>
            <h3 className="text-sm font-bold text-brand-ink mb-2">Email</h3>
            <a href="mailto:info@pesonaserpong.com" className="text-base font-bold text-brand-primary hover:underline">
              info@pesonaserpong.com
            </a>
          </div>
          <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <Phone size={22} />
            </div>
            <h3 className="text-sm font-bold text-brand-ink mb-2">Telepon</h3>
            <a href="tel:+6282112345678" className="text-base font-bold text-brand-primary hover:underline">
              (021) 1234-5678
            </a>
          </div>
          <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <MapPin size={22} />
            </div>
            <h3 className="text-sm font-bold text-brand-ink mb-2">Alamat</h3>
            <p className="text-sm text-brand-ink/60 font-medium leading-relaxed">Kantor RW 09, Perumahan Pesona Serpong, Tangerang Selatan</p>
          </div>
          <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="h-12 w-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4">
              <Clock size={22} />
            </div>
            <h3 className="text-sm font-bold text-brand-ink mb-2">Jam Operasional</h3>
            <p className="text-sm text-brand-ink/60 font-medium leading-relaxed">Senin - Jumat: 08.00 - 16.00 WIB<br />Sabtu: 08.00 - 12.00 WIB</p>
          </div>
        </div>
      </main>
    </div>
  )
}


