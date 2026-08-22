import React from 'react'
import { Inbox, Clock, Activity, CheckCircle2 } from 'lucide-react'
import prisma from '@/lib/prisma'

interface StatsSectionProps {
  profileId: string
  isWarga: boolean
}

export default async function StatsSection({ profileId, isWarga }: StatsSectionProps) {
  if (!profileId && isWarga) return null;
  const whereBase = isWarga ? { authorId: profileId } : {};

  let stats: { total: number; pending: number; processing: number; completed: number } = {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  };

  try {
    const [total, pending, processing, completed] = await Promise.all([
      prisma.complaint.count({ where: whereBase }),
      prisma.complaint.count({ where: { ...whereBase, status: 'PENDING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'PROCESSING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'COMPLETED' } }),
    ]);
    stats = { total, pending, processing, completed };
  } catch (err) {
    console.error('StatsSection Error:', err);
    return null;
  }

  const items = [
    { label: 'Menunggu', val: stats.pending, icon: Clock },
    { label: 'Diproses', val: stats.processing, icon: Activity },
    { label: 'Selesai', val: stats.completed, icon: CheckCircle2 }
  ]

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
      {/* Hero metric - Total Laporan (spans 5 cols on desktop) */}
      <div className="lg:col-span-5 bg-brand-panel p-5 md:p-6 rounded-xl text-brand-panel-fg border border-brand-hairline flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider">Total Laporan</span>
          <Inbox aria-hidden="true" size={18} className="text-brand-primary" />
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{stats.total}</p>
          <p className="text-xs text-brand-panel-fg/60 mt-1">Laporan terkirim ke sistem</p>
        </div>
      </div>

      {/* Status breakdown - dense list on remaining 7 cols */}
      <div className="lg:col-span-7 bg-brand-canvas rounded-xl border border-brand-hairline divide-y divide-brand-hairline overflow-hidden">
        {items.map((item, idx) => (
          <div key={idx} className="px-4 md:px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-brand-canvas-soft/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <item.icon aria-hidden="true" size={16} className="text-brand-ink/40 shrink-0" />
              <span className="text-sm font-semibold text-brand-ink truncate">{item.label}</span>
            </div>
            <span className={`text-lg font-bold font-mono tabular-nums ${item.val > 0 ? 'text-brand-ink' : 'text-brand-ink/30'}`}>
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
