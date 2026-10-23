import React from 'react'
import { ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function AdminAnalyticsSection() {
  let completionRate = 0
  let unverifiedUsers = 0
  let chartData: { day: string; count: number }[] = []
  let maxChart = 1
  let total7Days = 0

  try {
    const [total, completed, unverifiedUsersCount, rawChartData] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'COMPLETED' } }),
      prisma.profile.count({ where: { isVerified: false, role: 'MASYARAKAT' } }),
      prisma.complaint.findMany({
        where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
        select: { createdAt: true }
      })
    ])

    unverifiedUsers = unverifiedUsersCount
    completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    total7Days = rawChartData.length

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toLocaleDateString()
      const count = rawChartData.filter(c => new Date(c.createdAt).toLocaleDateString() === dateStr).length
      return { day: days[d.getDay()], count }
    })
    maxChart = Math.max(...chartData.map(d => d.count), 1)
  } catch (err) {
    console.error('AdminAnalyticsSection Error:', err)
    return null
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Analytics Chart */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[300px]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">Aktivitas Mingguan</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Tren Masuk Aduan</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tabular-nums text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-700 dark:text-blue-400" />
              {total7Days} Laporan 7 Hari Terakhir
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 pt-4 pb-2">
          {chartData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[11px] font-mono font-bold tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                {item.count}
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl relative flex items-end p-1 h-36">
                <div 
                  className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-all duration-300" 
                  style={{ height: `${Math.max((item.count / maxChart) * 100, 6)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono tabular-nums">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info & Health */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-blue-800 to-blue-950 text-white p-5 md:p-6 rounded-2xl shadow-sm border border-blue-900 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Tingkat Penanganan</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-700/60 text-blue-100 border border-blue-600/50 uppercase tracking-wider">
                Efektivitas RW
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-bold tracking-tight font-mono tabular-nums">{completionRate}%</p>
              <p className="text-xs text-blue-100/80">Akumulasi Aduan Dinyatakan Tuntas</p>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <Link 
            href="/dashboard/admin/users" 
            className="mt-6 flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white rounded-xl transition-all border border-white/15 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="text-xs font-semibold tabular-nums font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${unverifiedUsers > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {unverifiedUsers} Warga Menunggu Verifikasi
            </span>
            <ChevronRight size={15} className="text-blue-200 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  )
}
