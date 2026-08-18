import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { 
  ArrowLeft,
  PieChart as PieIcon,
  Map,
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Status Distribution */}
          <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Distribusi Status</p>
                   <h2 className="text-base font-bold text-brand-ink">Arus Penyelesaian</h2>
                </div>
                <div className="h-8 w-8 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary border border-brand-hairline">
                   <PieIcon size={16} />
                </div>
             </div>

             <div className="flex-1 space-y-6">
                {statusCounts.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-brand-ink/50 py-8">
                      <Inbox size={28} className="mb-3 opacity-20" />
                      <p className="text-xs font-medium">Belum ada data laporan</p>
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
                       <div key={item.status} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">
                                  {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                               </span>
                               <span className="text-xs font-mono tabular-nums font-bold text-brand-ink">{item._count._all} Laporan</span>
                            </div>
                            <span className="text-base font-mono tabular-nums font-bold text-brand-ink">{percentage}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-brand-canvas-soft rounded-full overflow-hidden border border-brand-hairline">
                            <div 
                             className={`h-full rounded-full transition-all duration-700 ${statusBgMap[item.status] || 'bg-slate-500 dark:bg-slate-400'}`}
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
          <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Peta Wilayah</p>
                   <h2 className="text-base font-bold text-brand-ink">Laporan per RT</h2>
                </div>
                <div className="h-8 w-8 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-positive border border-brand-hairline">
                   <Map size={16} />
                </div>
             </div>

             <div className="flex-1 flex items-end justify-between gap-2 md:gap-3 h-52 px-1">
                {rtCounts.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center text-brand-ink/50">
                      <p className="text-xs font-medium">Data wilayah belum tersedia</p>
                   </div>
                ) : (
                   rtCounts.map(item => {
                     const height = total > 0 ? (item._count._all / maxRTCount) * 100 : 0
                     return (
                       <div key={item.rt} className="flex-1 flex flex-col items-center gap-3 group">
                          <div className="w-full bg-brand-canvas-soft rounded-lg relative flex items-end p-0.5 transition-colors group-hover:bg-brand-primary/10" style={{ height: `${height}%`, minHeight: '6px' }}>
                             <div className="w-full bg-brand-panel rounded-md h-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-panel text-brand-panel-fg text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-brand-panel-fg/10">
                               <span className="font-mono tabular-nums">{item._count._all}</span> Laporan
                            </div>
                         </div>
                          <span className="text-[10px] font-mono tabular-nums font-semibold text-brand-ink/50 uppercase">RT {item.rt || '?'}</span>
                       </div>
                     )
                   })
                )}
             </div>
          </div>
        </section>

        {/* 📋 SUMMARY — Dense Data Strip */}
        <section className="bg-brand-canvas rounded-xl border border-brand-hairline divide-y sm:divide-y-0 sm:divide-x divide-brand-hairline grid grid-cols-1 sm:grid-cols-3">
            <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Rata-rata Laporan / RT</p>
                <p className="text-base font-mono tabular-nums font-bold text-brand-ink">{(total / Math.max(rtCounts.length, 1)).toFixed(1)}</p>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Total Entri</p>
                <p className="text-base font-mono tabular-nums font-bold text-brand-ink">{total}</p>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Cakupan Wilayah</p>
                <p className="text-base font-mono tabular-nums font-bold text-brand-ink">{rtCounts.length} RT</p>
            </div>
        </section>

        {/* 🗺️ COMPLAINT MAP */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-negative border border-brand-hairline">
                 <MapPin size={16} />
               </div>
               <div>
                 <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Visualisasi</p>
                <h2 className="text-base font-bold text-brand-ink">Peta Sebaran Laporan</h2>
              </div>
            </div>
            <span className="text-[10px] font-mono tabular-nums font-semibold text-brand-ink/50 uppercase tracking-wider">
              {mapComplaints.length} titik
            </span>
          </div>
          <ComplaintMapView complaints={mapComplaints} />
        </section>

      </main>
    </div>
  )
}

