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
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-brand-canvas p-4 md:p-5 rounded-lg border border-brand-hairline flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-medium text-brand-ink/60">{item.label}</span>
            <item.icon size={16} className="text-brand-ink/40" />
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink font-mono tabular-nums">{item.val}</p>
        </div>
      ))}
    </section>
  )
}

