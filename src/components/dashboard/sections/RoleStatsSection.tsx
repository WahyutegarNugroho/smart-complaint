import React from 'react'
import { Inbox, Zap, Activity, Clock, CheckCircle2 } from 'lucide-react'
import { getRoleStatsData } from '@/lib/dal'

type Role = 'admin' | 'petugas'

const colorStyles: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string }> = {
  slate: { bg: 'bg-slate-50', darkBg: 'dark:bg-slate-800', text: 'text-slate-700', darkText: 'dark:text-slate-300', border: 'border-slate-200', darkBorder: 'dark:border-slate-700' },
  red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-950/40', text: 'text-red-700', darkText: 'dark:text-red-300', border: 'border-red-200', darkBorder: 'dark:border-red-900' },
  blue: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-950/40', text: 'text-blue-800', darkText: 'dark:text-blue-300', border: 'border-blue-200', darkBorder: 'dark:border-blue-900' },
  amber: { bg: 'bg-amber-50', darkBg: 'dark:bg-amber-950/40', text: 'text-amber-700', darkText: 'dark:text-amber-300', border: 'border-amber-200', darkBorder: 'dark:border-amber-900' },
  emerald: { bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-950/40', text: 'text-emerald-700', darkText: 'dark:text-emerald-300', border: 'border-emerald-200', darkBorder: 'dark:border-emerald-900' },
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
  const config = roleStats[role]
  const data = await getRoleStatsData(role)
  if (!data) return null

  const stats: StatItem[] = [
    { label: 'Total Laporan', val: data.total, icon: Inbox, color: 'slate' },
    { label: config.label, val: data.second, icon: config.icon, color: config.color },
    { label: 'Menunggu', val: data.pending, icon: Clock, color: 'amber' },
    { label: 'Selesai', val: data.completed, icon: CheckCircle2, color: 'emerald' }
  ]

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Accent/Core Metric Block (spans 5 cols on desktop) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-blue-800 to-blue-950 text-white p-5 md:p-6 rounded-2xl shadow-sm border border-blue-900 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">{stats[0].label}</span>
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200">
            <Inbox aria-hidden="true" size={18} />
          </div>
        </div>
        <div>
          <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{stats[0].val}</p>
          <p className="text-xs text-blue-100/80 mt-1">
            {role === 'petugas' ? 'Total pengaduan terdata di sistem' : 'Akumulasi seluruh laporan wilayah'}
          </p>
        </div>
      </div>

      {/* Grid of details (spans 7 cols on desktop) */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.slice(1).map((item, idx) => {
          const cs = colorStyles[item.color] || colorStyles.slate
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className={`h-8 w-8 rounded-lg ${cs.bg} ${cs.darkBg} flex items-center justify-center ${cs.text} ${cs.darkText} border ${cs.border} ${cs.darkBorder}`}>
                  <item.icon aria-hidden="true" size={16} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cs.bg} ${cs.darkBg} ${cs.text} ${cs.darkText} border ${cs.border} ${cs.darkBorder}`}>
                  {item.label}
                </span>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">{item.val}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.label === 'Diproses' ? 'Dalam penanganan' : item.label === 'Menunggu' ? 'Belum ditindak' : item.label === 'Selesai' ? 'Telah dituntaskan' : 'Prioritas tinggi'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

