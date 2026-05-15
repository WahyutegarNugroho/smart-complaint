import React from 'react'
import { Inbox, Zap, Clock, CheckCircle2 } from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function AdminStatsSection() {
  const [total, urgent, pending, completed] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } }),
    prisma.complaint.count({ where: { status: 'PENDING' } }),
    prisma.complaint.count({ where: { status: 'COMPLETED' } })
  ])

  const stats = [
    { label: 'Total Laporan', val: total, icon: Inbox, color: 'slate' },
    { label: 'Darurat', val: urgent, icon: Zap, color: 'red' },
    { label: 'Menunggu', val: pending, icon: Clock, color: 'amber' },
    { label: 'Selesai', val: completed, icon: CheckCircle2, color: 'emerald' }
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all group relative overflow-hidden">
           <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl bg-${item.color}-50 dark:bg-${item.color === 'slate' ? 'slate-800' : `${item.color}-900/20`} flex items-center justify-center text-${item.color}-600 dark:text-${item.color === 'slate' ? 'slate-300' : `${item.color}-300`} border border-${item.color}-100 dark:border-${item.color === 'slate' ? 'slate-700' : `${item.color}-800`} transition-colors`}>
                 <item.icon size={18} />
              </div>
           </div>
           <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.val}</p>
           <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{item.label}</p>
        </div>
      ))}
    </section>
  )
}
