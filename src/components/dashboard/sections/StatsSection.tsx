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

  let stats = { total: 0, pending: 0, processing: 0, completed: 0 };

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
        <div key={idx} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 transition-colors`}>
              <item.icon size={18} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.val}</p>
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 mt-1">{item.label}</p>
        </div>
      ))}
    </section>
  )
}
