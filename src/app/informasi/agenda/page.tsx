import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ArrowLeft, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Agenda Kegiatan | Smart Complaint',
}

const CATEGORY_MAP: Record<string, { label: string; cls: string }> = {
  umum: { label: 'Umum', cls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
  kegiatan: { label: 'Kegiatan', cls: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' },
  darurat: { label: 'Darurat', cls: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
  kebersihan: { label: 'Kebersihan', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
  kesehatan: { label: 'Kesehatan', cls: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800' },
  keagamaan: { label: 'Keagamaan', cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
}

export default async function AgendaPage() {
  let announcements: Array<{
    id: string
    title: string
    content: string
    category: string
    createdAt: Date
  }> = []

  try {
    announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (err) {
    console.error('AgendaPage Error:', err)
  }

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <Calendar size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">Agenda Kegiatan</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Jadwal kegiatan dan acara warga Perumahan Pesona Serpong.</p>
        </div>

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-16 text-center">
              <Calendar size={48} className="text-brand-ink/10 mx-auto mb-4" />
              <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-normal">Belum ada agenda</p>
            </div>
          ) : (
            announcements.map((item) => {
              const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.umum
              return (
                <div key={item.id} className="bg-brand-canvas border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-primary shrink-0 border border-brand-hairline">
                      <Calendar size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={"text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg border " + cat.cls}>{cat.label}</span>
                      </div>
                      <h3 className="text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
                      {item.content && (
                        <p className="text-sm text-brand-ink/60 font-medium mb-3 leading-relaxed">{item.content}</p>
                      )}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-ink/60 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-ink/40" />
                          {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}


