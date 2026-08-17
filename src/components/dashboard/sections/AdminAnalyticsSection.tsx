import React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function AdminAnalyticsSection() {
  let completionRate = 0
  let unverifiedUsers = 0
  let chartData: { day: string; count: number }[] = []
  let maxChart = 1

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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      {/* Analytics Chart */}
      <div className="lg:col-span-8 bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Aktivitas Mingguan</p>
              <h2 className="text-base font-bold text-brand-ink">Tren Masuk Aduan</h2>
            </div>
        </div>
        
        <div className="flex-1 flex items-end justify-between gap-2 md:gap-3">
            {chartData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-brand-canvas-soft rounded-lg relative flex items-end p-0.5" style={{ height: `${(item.count / maxChart) * 100}%`, minHeight: '6px' }}>
                    <div className="w-full bg-brand-primary rounded-md h-full opacity-30 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-[10px] font-mono tabular-nums text-brand-ink/50">{item.day}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Info & Health */}
      <div className="lg:col-span-4 flex flex-col">
          <div className="flex-1 bg-brand-panel p-5 md:p-6 rounded-xl text-brand-panel-fg border border-brand-hairline flex flex-col justify-between">
            <div className="space-y-4">
                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Tingkat Penanganan</p>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight font-mono tabular-nums">{completionRate}%</p>
                  <p className="text-xs text-brand-panel-fg/60">Aduan Tuntas</p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full" style={{ width: `${completionRate}%` }}></div>
                </div>
            </div>

            <Link href="/dashboard/admin/users" className="mt-6 flex items-center justify-between p-3 bg-brand-panel-fg/10 hover:bg-brand-panel-fg/20 text-brand-panel-fg rounded-lg transition-colors border border-brand-panel-fg/10">
                <span className="text-xs font-semibold tabular-nums font-mono">{unverifiedUsers} Warga Menunggu Verifikasi</span>
                <ChevronRight size={14} />
            </Link>
          </div>
      </div>
    </section>
  )
}

