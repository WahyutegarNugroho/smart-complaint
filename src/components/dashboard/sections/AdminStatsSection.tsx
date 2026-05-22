import React from 'react'
import { Inbox, Zap, Clock, CheckCircle2 } from 'lucide-react'
import prisma from '@/lib/prisma'

const colorStyles: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string }> = {
  slate: { bg: 'bg-slate-50', darkBg: 'dark:bg-slate-800', text: 'text-slate-600', darkText: 'dark:text-slate-300', border: 'border-slate-100', darkBorder: 'dark:border-slate-700' },
  red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20', text: 'text-red-600', darkText: 'dark:text-red-300', border: 'border-red-100', darkBorder: 'dark:border-red-800' },
  amber: { bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', text: 'text-amber-600', darkText: 'dark:text-amber-300', border: 'border-amber-100', darkBorder: 'dark:border-amber-800' },
  emerald: { bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20', text: 'text-emerald-600', darkText: 'dark:text-emerald-300', border: 'border-emerald-100', darkBorder: 'dark:border-emerald-800' },
}

interface StatItem {
  label: string
  val: number
  icon: React.ElementType
  color: string
}

export default async function AdminStatsSection() {
  let stats: StatItem[] = []

  try {
    const [total, urgent, pending, completed] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } }),
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'COMPLETED' } })
    ])

    stats = [
      { label: 'Total Laporan', val: total, icon: Inbox, color: 'slate' },
      { label: 'Darurat', val: urgent, icon: Zap, color: 'red' },
      { label: 'Menunggu', val: pending, icon: Clock, color: 'amber' },
      { label: 'Selesai', val: completed, icon: CheckCircle2, color: 'emerald' }
    ]
  } catch (err) {
    console.error('AdminStatsSection Error:', err)
    return null
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((item, idx) => {
        const cs = colorStyles[item.color] || colorStyles.slate
        return (
        <div key={idx} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl ${cs.bg} ${cs.darkBg} flex items-center justify-center ${cs.text} ${cs.darkText} border ${cs.border} ${cs.darkBorder} transition-colors`}>
                <item.icon size={18} />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.val}</p>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{item.label}</p>
        </div>
        )
      })}
    </section>
  )
}
