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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl bg-brand-canvas-soft flex items-center justify-center text-brand-ink/60 border border-brand-hairline`}>
              <item.icon size={18} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">{item.val}</p>
          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-normal text-brand-ink/40 mt-1">{item.label}</p>
        </div>
      ))}
    </section>
  )
}

