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
    { 
      label: 'Menunggu Verifikasi', 
      val: stats.pending, 
      icon: Clock,
      colorClass: 'text-slate-600 dark:text-slate-300',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    },
    { 
      label: 'Sedang Ditindaklanjuti', 
      val: stats.processing, 
      icon: Activity,
      colorClass: 'text-amber-700 dark:text-amber-400',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
    },
    { 
      label: 'Selesai Ditangani', 
      val: stats.completed, 
      icon: CheckCircle2,
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
    }
  ]

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Hero metric - Total Laporan (spans 5 cols on desktop) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-blue-800 to-blue-950 text-white p-5 md:p-6 rounded-2xl shadow-sm border border-blue-900 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Total Laporan Anda</span>
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200">
            <Inbox aria-hidden="true" size={18} />
          </div>
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{stats.total}</p>
          <p className="text-xs text-blue-100/80 mt-1">Laporan terkirim ke sistem RT/RW</p>
        </div>
      </div>

      {/* Status breakdown - dense list on remaining 7 cols */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
        {items.map((item, idx) => (
          <div key={idx} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${item.badgeClass}`}>
                <item.icon aria-hidden="true" size={16} />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.label}</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${item.val > 0 ? item.colorClass : 'text-slate-400 dark:text-slate-600'}`}>
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
