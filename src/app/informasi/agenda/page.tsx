import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Agenda Kegiatan | Smart Complaint',
}

const AGENDAS = [
  {
    title: 'Rapat Bulanan Warga',
    date: 'Setiap Sabtu Pertama',
    time: '19.00 - 21.00 WIB',
    location: 'Balai Warga RW 09',
    category: 'Rutin',
  },
  {
    title: 'Kerja Bakti Lingkungan',
    date: 'Setiap Minggu Kedua',
    time: '06.00 - 09.00 WIB',
    location: 'Area Lingkungan Pesona Serpong',
    category: 'Kebersihan',
  },
  {
    title: 'Posyandu Balita',
    date: 'Setiap Rabu',
    time: '08.00 - 12.00 WIB',
    location: 'Posyandu RW 09',
    category: 'Kesehatan',
  },
  {
    title: 'Pengajian Akbar',
    date: 'Jumat Terakhir Bulan',
    time: '16.00 - 18.00 WIB',
    location: 'Masjid Pesona Serpong',
    category: 'Keagamaan',
  },
]

export default function AgendaPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <Calendar size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-ink">Agenda Kegiatan</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Jadwal kegiatan dan acara warga Perumahan Pesona Serpong.</p>
        </div>

        <div className="space-y-4">
          {AGENDAS.map((item, i) => (
            <div key={i} className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-primary shrink-0 border border-brand-hairline">
                  <Calendar size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded-lg">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-ink/60 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-brand-ink/40" /> {item.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-ink/40" /> {item.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-ink/40" /> {item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
