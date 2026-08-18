import Link from 'next/link'
import prisma from '@/lib/prisma'

export const revalidate = 60

export const metadata = {
  title: 'Agenda Kegiatan | Smart Complaint',
}

const CATEGORY_MAP: Record<string, { label: string; cls: string }> = {
  umum: { label: 'Umum', cls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
  kegiatan: { label: 'Kegiatan', cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
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
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Agenda Kegiatan</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Jadwal kegiatan warga Perumahan Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          {announcements.length === 0 ? (
            <div className="p-10 text-center text-xs text-brand-ink/50">
              Belum ada agenda yang dijadwalkan.
            </div>
          ) : (
            announcements.map((item) => {
              const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.umum
              return (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={"text-[10px] font-semibold uppercase px-2 py-0.5 rounded border " + cat.cls}>{cat.label}</span>
                      <h2 className="text-sm font-bold text-brand-ink truncate">{item.title}</h2>
                    </div>
                    {item.content && (
                      <p className="text-xs text-brand-ink/70 leading-relaxed line-clamp-2">{item.content}</p>
                    )}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-brand-ink/50 shrink-0 pt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}


