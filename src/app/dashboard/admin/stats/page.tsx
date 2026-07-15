import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { 
  ArrowLeft,
  Activity,
  PieChart as PieIcon,
  Map,
  TrendingUp,
  Inbox,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { ComplaintMapView } from '@/components/map'
import { STATUS_LABELS } from '@/lib/constants'

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { role: true } })
  if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

  // Parallel queries
  const [statusCounts, rtCounts, total, mappedComplaints] = await Promise.all([
    prisma.complaint.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    prisma.complaint.groupBy({
      by: ['rt'],
      _count: { _all: true },
      orderBy: { rt: 'asc' }
    }),
    prisma.complaint.count(),
    prisma.complaint.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        status: true,
        rt: true,
        rw: true,
        isUrgent: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 500
    }),
  ])

  const maxRTCount = Math.max(...rtCounts.map(r => r._count._all), 1)

  const mapComplaints = mappedComplaints.map(c => ({
    ...c,
    latitude: c.latitude!,
    longitude: c.longitude!
  }))

  return (
    <div className="min-h-screen bg-brand-canvas text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/50 hover:text-brand-ink transition-all shadow-sm">
                  <ArrowLeft size={20} />
               </Link>
               <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal">Pusat Data</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Analitik & Statistik</h1>
            <p className="text-brand-ink/50 font-medium text-sm md:text-base">Wawasan mendalam mengenai performa operasional perumahan.</p>
          </div>
        </section>

        {/* 📊 ANALYTICS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Status Distribution */}
          <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8 md:mb-10">
                <div>
                   <h3 className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Distribusi Status</h3>
                   <p className="text-xl font-bold text-brand-ink">Arus Penyelesaian</p>
                </div>
                <div className="h-10 w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-primary border border-brand-hairline">
                   <PieIcon size={20} />
                </div>
             </div>

             <div className="flex-1 space-y-8">
                {statusCounts.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-brand-ink/50 py-10">
                      <Inbox size={40} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">Belum ada data laporan</p>
                   </div>
                ) : (
                   statusCounts.map(item => {
                     const percentage = total > 0 ? Math.round((item._count._all / total) * 100) : 0
                      const statusBgMap: Record<string, string> = {
                         PENDING: 'bg-amber-500 dark:bg-amber-400',
                         PROCESSING: 'bg-blue-500 dark:bg-blue-400',
                         COMPLETED: 'bg-emerald-500 dark:bg-emerald-400',
                      }
                     
                     return (
                       <div key={item.status} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">
                                  {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                               </span>
                               <span className="text-sm font-bold text-brand-ink">{item._count._all} Laporan</span>
                            </div>
                            <span className="text-xl font-bold text-brand-ink">{percentage}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-brand-canvas-soft rounded-full overflow-hidden p-0.5 border border-brand-hairline">
                            <div 
                             className={`h-full rounded-full transition-all duration-1000 ${statusBgMap[item.status] || 'bg-slate-500 dark:bg-slate-400'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                             style={{ width: `${percentage}%` }}
                            />
                         </div>
                       </div>
                     )
                   })
                )}
             </div>
          </div>

          {/* Reports by RT */}
          <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8 md:mb-10">
                <div>
                   <h3 className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Peta Wilayah</h3>
                   <p className="text-xl font-bold text-brand-ink">Laporan per RT</p>
                </div>
                <div className="h-10 w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-positive border border-brand-hairline">
                   <Map size={20} />
                </div>
             </div>

             <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 px-1">
                {rtCounts.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center text-brand-ink/50">
                      <p className="text-sm font-medium">Data wilayah belum tersedia</p>
                   </div>
                ) : (
                   rtCounts.map(item => {
                     const height = total > 0 ? (item._count._all / maxRTCount) * 100 : 0
                     return (
                       <div key={item.rt} className="flex-1 flex flex-col items-center gap-4 group">
                          <div className="w-full bg-brand-canvas-soft rounded-xl relative transition-all duration-500 group-hover:bg-brand-primary/10 flex items-end p-0.5" style={{ height: `${height}%`, minHeight: '8px' }}>
                             <div className="w-full bg-brand-ink rounded-lg h-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-ink text-brand-canvas text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-brand-canvas/10">
                               {item._count._all} Laporan
                            </div>
                         </div>
                          <span className="text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal">RT {item.rt || '?'}</span>
                       </div>
                     )
                   })
                )}
             </div>
          </div>
        </section>

        {/* 📋 SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline flex items-center gap-5 shadow-sm">
               <div className="h-12 w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-primary border border-brand-hairline transition-colors">
                  <Activity size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Rata-rata Laporan</p>
                  <p className="text-xl font-bold text-brand-ink">{(total / Math.max(rtCounts.length, 1)).toFixed(1)} <span className="text-sm text-brand-ink/50 font-medium tracking-normal uppercase ml-1">Per RT</span></p>
               </div>
            </div>

            <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline flex items-center gap-5 shadow-sm">
               <div className="h-12 w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-positive border border-brand-hairline transition-colors">
                  <TrendingUp size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Total Entri</p>
                  <p className="text-xl font-bold text-brand-ink">{total} <span className="text-sm text-brand-ink/50 font-medium tracking-normal uppercase ml-1">Laporan Warga</span></p>
               </div>
            </div>

            <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline flex items-center gap-5 shadow-sm">
               <div className="h-12 w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-warning border border-brand-hairline transition-colors">
                  <Inbox size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Cakupan Wilayah</p>
                  <p className="text-xl font-bold text-brand-ink">{rtCounts.length} <span className="text-sm text-brand-ink/50 font-medium tracking-normal uppercase ml-1">RT Terdata</span></p>
               </div>
            </div>
        </section>

        {/* 🗺️ COMPLAINT MAP */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-negative border border-brand-hairline">
                 <MapPin size={20} />
               </div>
               <div>
                 <h3 className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1">Visualisasi</h3>
                <p className="text-xl font-bold text-brand-ink">Peta Sebaran Laporan</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal">
              {mapComplaints.length} titik
            </span>
          </div>
          <ComplaintMapView complaints={mapComplaints} />
        </section>

      </main>
    </div>
  )
}

