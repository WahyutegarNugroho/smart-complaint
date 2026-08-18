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
    { label: 'Total Laporan', val: stats.total, icon: Inbox, color: 'slate' },
    { label: 'Menunggu', val: stats.pending, icon: Clock, color: 'amber' },
    { label: 'Diproses', val: stats.processing, icon: Activity, color: 'blue' },
    { label: 'Selesai', val: stats.completed, icon: CheckCircle2, color: 'emerald' }
  ]

  return (
    <section className="flex flex-col md:flex-row gap-3 md:gap-4">
      {/* Primary Hero / Status Summary */}
      <div className="flex-1 bg-brand-panel p-5 md:p-6 rounded-xl text-brand-panel-fg border border-brand-hairline flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider">{items[0].label}</span>
          <Inbox size={18} className="text-brand-primary" />
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{items[0].val}</p>
          <p className="text-xs text-brand-panel-fg/60 mt-1">Laporan terkirim ke sistem</p>
        </div>
      </div>

      {/* Symmetric metrics breakdown in 1 row */}
      <div className="flex-[2] grid grid-cols-3 gap-3 md:gap-4">
        {items.slice(1).map((item, idx) => (
          <div key={idx} className="bg-brand-canvas p-4 md:p-5 rounded-xl border border-brand-hairline flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal">{item.label}</span>
              <item.icon size={16} className="text-brand-ink/40" />
            </div>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink font-mono tabular-nums">{item.val}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

