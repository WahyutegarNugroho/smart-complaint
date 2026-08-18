import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Kontak Kami | Smart Complaint',
}

const CONTACTS = [
  { label: 'Email', value: 'info@pesonaserpong.com', href: 'mailto:info@pesonaserpong.com', type: 'link' as const },
  { label: 'Telepon', value: '(021) 1234-5678', href: 'tel:+6282112345678', type: 'link' as const },
  { label: 'Alamat', value: 'Kantor RW 09, Perumahan Pesona Serpong, Tangerang Selatan', type: 'text' as const },
  { label: 'Jam Kerja', value: 'Senin - Jumat: 08.00 - 16.00 WIB', secondary: 'Sabtu: 08.00 - 12.00 WIB', type: 'text' as const },
]

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Kontak Pengelola</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Hubungi pengelola Smart Complaint Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          {CONTACTS.map((item, i) => (
            <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs font-bold text-brand-ink/50 uppercase tracking-wider sm:w-32 shrink-0">{item.label}</span>
              {item.type === 'link' ? (
                <a href={item.href} className="text-sm font-bold text-brand-primary hover:underline break-all">
                  {item.value}
                </a>
              ) : (
                <div className="space-y-0.5">
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
