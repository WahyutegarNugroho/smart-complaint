import React from 'react'
import { Inbox, Zap, Activity, Clock, CheckCircle2 } from 'lucide-react'
import prisma from '@/lib/prisma'

type Role = 'admin' | 'petugas'

const colorStyles: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string }> = {
  slate: { bg: 'bg-slate-50', darkBg: 'dark:bg-slate-800', text: 'text-slate-600', darkText: 'dark:text-slate-300', border: 'border-slate-100', darkBorder: 'dark:border-slate-700' },
  red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20', text: 'text-red-600', darkText: 'dark:text-red-300', border: 'border-red-100', darkBorder: 'dark:border-red-800' },
  blue: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', text: 'text-blue-600', darkText: 'dark:text-blue-300', border: 'border-blue-100', darkBorder: 'dark:border-blue-800' },
  amber: { bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', text: 'text-amber-600', darkText: 'dark:text-amber-300', border: 'border-amber-100', darkBorder: 'dark:border-amber-800' },
  emerald: { bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20', text: 'text-emerald-600', darkText: 'dark:text-emerald-300', border: 'border-emerald-100', darkBorder: 'dark:border-emerald-800' },
}

const roleStats = {
  admin: { label: 'Darurat', icon: Zap, color: 'red' },
  petugas: { label: 'Diproses', icon: Activity, color: 'blue' },
}

interface StatItem {
  label: string
  val: number
  icon: React.ElementType
  color: string
}

export default async function RoleStatsSection({ role }: { role: Role }) {
  let stats: StatItem[] = []

  try {
    const config = roleStats[role]
    const secondQuery = role === 'admin'
      ? prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } })
      : prisma.complaint.count({ where: { status: 'PROCESSING' } })

    const [total, second, pending, completed] = await Promise.all([
      prisma.complaint.count(),
      secondQuery,
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'COMPLETED' } })
    ])

    stats = [
      { label: 'Total Laporan', val: total, icon: Inbox, color: 'slate' },
      { label: config.label, val: second, icon: config.icon, color: config.color },
      { label: 'Menunggu', val: pending, icon: Clock, color: 'amber' },
      { label: 'Selesai', val: completed, icon: CheckCircle2, color: 'emerald' }
    ]
  } catch (err) {
    console.error(`StatsSection (${role}) Error:`, err)
    return null
  }

  return (
    <section className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Accent/Core Metric Block */}
      <div className="flex-1 bg-brand-panel p-5 md:p-6 rounded-xl text-brand-panel-fg border border-brand-hairline flex flex-col justify-between min-h-[150px]">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{stats[0].label}</span>
          <Inbox aria-hidden="true" size={18} className="text-brand-primary" />
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{stats[0].val}</p>
          <p className="text-xs text-brand-panel-fg/60 mt-1">Total aduan masuk</p>
        </div>
      </div>

      {/* Grid of details */}
      <div className="flex-[3] grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.slice(1).map((item, idx) => {
          const cs = colorStyles[item.color] || colorStyles.slate
          return (
            <div key={idx} className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline transition-all flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-start mb-3">
                <div className={`h-8 w-8 rounded-lg ${cs.bg} ${cs.darkBg} flex items-center justify-center ${cs.text} ${cs.darkText} border ${cs.border} ${cs.darkBorder} transition-colors`}>
                  <item.icon aria-hidden="true" size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink font-mono tabular-nums">{item.val}</p>
                <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-400 dark:text-slate-500 mt-1">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

