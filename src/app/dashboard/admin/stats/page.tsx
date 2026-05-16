import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { 
  ArrowLeft,
  Activity,
  PieChart as PieIcon,
  Map,
  TrendingUp,
  Inbox
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
  if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

  // Data for Status Chart
  const statusCounts = await prisma.complaint.groupBy({
    by: ['status'],
    _count: { _all: true }
  })

  // Data for RT Chart
  const rtCounts = await prisma.complaint.groupBy({
    by: ['rt'],
    _count: { _all: true },
    orderBy: { rt: 'asc' }
  })

  const total = await prisma.complaint.count()
  const maxRTCount = Math.max(...rtCounts.map(r => r._count._all), 1)

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
      
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ArrowLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Pusat Data</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analitik & Statistik</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm md:text-base">Wawasan mendalam mengenai performa operasional perumahan.</p>
          </div>
        </section>

        {/* 📊 ANALYTICS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8 md:mb-10">
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Distribusi Status</h3>
                   <p className="text-xl font-bold text-slate-900 dark:text-white">Arus Penyelesaian</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                   <PieIcon size={20} />
                </div>
             </div>

             <div className="flex-1 space-y-8">
                {statusCounts.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                      <Inbox size={40} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">Belum ada data laporan</p>
                   </div>
                ) : (
                   statusCounts.map(item => {
                     const percentage = total > 0 ? Math.round((item._count._all / total) * 100) : 0
                     const colorMap = {
                        PENDING: 'amber',
                        PROCESSING: 'blue',
                        COMPLETED: 'emerald'
                     }
                     const color = colorMap[item.status as keyof typeof colorMap] || 'slate'
                     
                     return (
                       <div key={item.status} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                  {item.status === 'PENDING' ? 'Menunggu' : item.status === 'PROCESSING' ? 'Diproses' : 'Selesai'}
                               </span>
                               <span className="text-sm font-bold text-slate-900 dark:text-white">{item._count._all} Laporan</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-800">
                            <div 
                             className={`h-full rounded-full transition-all duration-1000 bg-${color}-500 dark:bg-${color}-400 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
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
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8 md:mb-10">
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Peta Wilayah</h3>
                   <p className="text-xl font-bold text-slate-900 dark:text-white">Laporan per RT</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                   <Map size={20} />
                </div>
             </div>

             <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 px-1">
                {rtCounts.length === 0 ? (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <p className="text-sm font-medium">Data wilayah belum tersedia</p>
                   </div>
                ) : (
                   rtCounts.map(item => {
                     const height = total > 0 ? (item._count._all / maxRTCount) * 100 : 0
                     return (
                       <div key={item.rt} className="flex-1 flex flex-col items-center gap-4 group">
                         <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl relative transition-all duration-500 group-hover:bg-blue-500/10 flex items-end p-0.5" style={{ height: `${height}%`, minHeight: '8px' }}>
                            <div className="w-full bg-slate-900 dark:bg-blue-600 rounded-lg h-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10">
                               {item._count._all} Laporan
                            </div>
                         </div>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">RT {item.rt || '?'}</span>
                       </div>
                     )
                   })
                )}
             </div>
          </div>
        </section>

        {/* 📋 SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 transition-colors">
                 <Activity size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rata-rata Laporan</p>
                 <p className="text-xl font-bold text-slate-900 dark:text-white">{(total / Math.max(rtCounts.length, 1)).toFixed(1)} <span className="text-sm text-slate-400 font-medium tracking-normal uppercase ml-1">Per RT</span></p>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 transition-colors">
                 <TrendingUp size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Entri</p>
                 <p className="text-xl font-bold text-slate-900 dark:text-white">{total} <span className="text-sm text-slate-400 font-medium tracking-normal uppercase ml-1">Laporan Warga</span></p>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 transition-colors">
                 <Inbox size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Cakupan Wilayah</p>
                 <p className="text-xl font-bold text-slate-900 dark:text-white">{rtCounts.length} <span className="text-sm text-slate-400 font-medium tracking-normal uppercase ml-1">RT Terdata</span></p>
              </div>
           </div>
        </section>

      </main>
    </div>
  )
}
