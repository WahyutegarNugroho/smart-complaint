import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Kontak Kami | Smart Complaint',
}

const CONTACTS = [
  { icon: Mail, label: 'Email', value: 'info@pesonaserpong.com', href: 'mailto:info@pesonaserpong.com', type: 'link' as const },
  { icon: Phone, label: 'Telepon', value: '(021) 1234-5678', href: 'tel:+6282112345678', type: 'link' as const },
  { icon: MapPin, label: 'Alamat', value: 'Kantor RW 09, Perumahan Pesona Serpong, Tangerang Selatan', type: 'text' as const },
  { icon: Clock, label: 'Jam Operasional', value: 'Senin - Jumat: 08.00 - 16.00 WIB', secondary: 'Sabtu: 08.00 - 12.00 WIB', type: 'text' as const },
]

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Kontak Kami</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Hubungi pengelola Smart Complaint Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline shadow-sm">
          {CONTACTS.map((item, i) => (
            <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:w-44 shrink-0">
                <item.icon size={16} className="text-brand-ink/30 shrink-0" />
                <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">{item.label}</span>
              </div>
              {item.type === 'link' ? (
                <a href={item.href} className="text-sm font-bold text-brand-primary hover:underline break-all">
                  {item.value}
                </a>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-brand-ink/70">{item.value}</p>
                  {'secondary' in item && item.secondary && (
                    <p className="text-sm font-medium text-brand-ink/70">{item.secondary}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
