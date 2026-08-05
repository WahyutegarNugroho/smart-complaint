import React from 'react'
import { Activity, ChevronRight } from 'lucide-react'
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
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      {/* Analytics Chart */}
      <div className="lg:col-span-8 bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm flex flex-col min-h-[350px]">
        <div className="flex items-center justify-between mb-10 md:mb-12">
            <div>
              <h3 className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal mb-1">Analisis Kerja</h3>
                   <p className="text-xl font-bold text-brand-ink">Tren Mingguan</p>
            </div>
        </div>
        
        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 transition-all">
            {chartData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-brand-canvas-soft rounded-xl relative transition-all duration-500 flex items-end p-0.5" style={{ height: `${(item.count / maxChart) * 100}%`, minHeight: '8px' }}>
                    <div className="w-full bg-brand-primary rounded-lg h-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal">{item.day}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Info & Health */}
      <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="flex-1 bg-brand-panel p-6 md:p-8 rounded-3xl text-brand-panel-fg shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 opacity-10 rotate-12">
              <Activity size={180} />
            </div>
            
            <div className="relative z-10 space-y-8">
                <h3 className="text-[9px] font-semibold text-white/50 uppercase tracking-normal">Penanganan</h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white/60 uppercase tracking-normal">Rate Selesai</p>
                  <p className="text-4xl md:text-5xl font-bold tracking-tight">{completionRate}%</p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                </div>
            </div>

            <Link href="/dashboard/admin/users" className="relative z-10 mt-8 flex items-center justify-between p-4 bg-brand-panel-fg/10 hover:bg-brand-panel-fg/20 text-brand-panel-fg rounded-2xl transition-all group backdrop-blur-md border border-brand-panel-fg/10 cursor-pointer">
                <span className="text-[9px] font-semibold uppercase tracking-normal">Verifikasi {unverifiedUsers} Warga</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
      </div>
    </section>
  )
}

