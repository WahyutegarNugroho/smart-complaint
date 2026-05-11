import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Camera, 
  Zap, 
  MapPin, 
  ArrowRight, 
  Inbox, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Activity, 
  Radar, 
  Hammer, 
  AlertCircle, 
  Filter, 
  MoreVertical, 
  User, 
  FileText 
} from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import SuccessToast from '@/components/SuccessToast'

interface PetugasDashboardProps {
  profile: any
  complaints: any[]
  stats: any
  currentStatus?: string
  searchQuery?: string
  rtFilter?: string
  rwFilter?: string
  currentPage: number
  totalPages: number
  chartData: any[]
  maxChart: number
  completionRate: number
  topRT: string
  successMessage?: string
}

export default function PetugasDashboard({
  profile,
  complaints,
  stats,
  currentStatus,
  searchQuery,
  rtFilter,
  rwFilter,
  currentPage,
  totalPages,
  chartData,
  maxChart,
  completionRate,
  topRT,
  successMessage
}: PetugasDashboardProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
      
      {/* Toast Messages */}
      {successMessage && <SuccessToast message={successMessage} />}

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Halo, {profile.name}</h1>
            <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Pantau tugas lapangan dan koordinasi tim hari ini.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-sm">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Petugas Aktif</span>
             </div>
          </div>
        </section>

        {/* 📊 KPI DASHBOARD CARDS */}
        {!currentStatus && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Arus Aduan', val: stats.total, icon: Inbox, color: 'slate' },
              { label: 'Respons Cepat', val: stats.urgent, icon: Zap, color: 'red', urgent: true },
              { label: 'Dalam Proses', val: stats.processing, icon: Hammer, color: 'blue' },
              { label: 'Selesai', val: stats.completed, icon: CheckCircle2, color: 'emerald' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all group relative overflow-hidden">
                 <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl bg-${item.color}-50 dark:bg-${item.color === 'slate' ? 'slate-800' : `${item.color}-900/20`} flex items-center justify-center text-${item.color}-600 dark:text-${item.color === 'slate' ? 'slate-300' : `${item.color}-300`} border border-${item.color}-100 dark:border-${item.color === 'slate' ? 'slate-700' : `${item.color}-800`} transition-colors`}>
                       <item.icon size={18} fill={item.urgent ? "currentColor" : "none"} />
                    </div>
                 </div>
                 <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.val}</p>
                 <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{item.label}</p>
              </div>
            ))}
          </section>
        )}

        {/* 📉 TREND & ACTIVITY SECTION */}
        {!currentStatus && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* Chart Card */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-[350px]">
              <div className="flex items-center justify-between mb-10 md:mb-12">
                 <div>
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Analisis Operasional</h3>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">Tren Mingguan</p>
                 </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-2 md:gap-4">
                 {chartData.map((item, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl relative transition-all duration-500 group-hover:bg-blue-500/10 flex items-end p-0.5" style={{ height: `${(item.count / (maxChart || 1)) * 100}%`, minHeight: '8px' }}>
                         <div className="w-full bg-slate-900 dark:bg-blue-600 rounded-lg h-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.day}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
                 <div className="flex-1 bg-slate-900 dark:bg-blue-600 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-8 -top-8 opacity-10 rotate-12">
                      <Activity size={180} />
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                       <h3 className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Informasi Wilayah</h3>
                       <div className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Titik Hotspot</p>
                          <div className="flex items-center gap-3">
                             <MapPin size={22} className="text-red-400" />
                             <span className="text-2xl font-bold">{topRT}</span>
                          </div>
                       </div>
                    </div>

                    <div className="relative z-10 mt-8 flex items-center justify-between p-4 bg-white/10 text-white rounded-2xl border border-white/10">
                       <span className="text-[9px] font-bold uppercase tracking-widest">Live Monitoring</span>
                       <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                 </div>
            </div>
          </section>
        )}

        {/* 📋 WORKSPACE: OPERATIONAL LIST */}
        <section className="space-y-6 md:space-y-8 pt-4 md:pt-8">
           <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4">
                 <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Antrean Kerja</h2>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
                {[
                  { label: 'Semua', val: '' },
                  { label: 'Menunggu', val: 'PENDING' },
                  { label: 'Proses', val: 'PROCESSING' },
                  { label: 'Selesai', val: 'COMPLETED' }
                ].map((t) => (
                  <Link
                    key={t.val}
                    href={`/dashboard${t.val ? `?status=${t.val}` : ''}`}
                    className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                      (currentStatus || '') === t.val 
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-500' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
           </div>

           {/* SEARCH & FILTER BAR */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
               <div className="lg:col-span-8 relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-blue-500" size={16} />
                  <form>
                     <input 
                       name="q"
                       type="text" 
                       defaultValue={searchQuery}
                       placeholder="Cari laporan..." 
                       className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-sm font-medium dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
                     />
                  </form>
               </div>
               <div className="lg:col-span-4 flex gap-3">
                  <form className="flex gap-2 w-full">
                    <input name="rt" type="text" defaultValue={rtFilter} placeholder="RT" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-blue-500 transition-all shadow-sm" />
                    <input name="rw" type="text" defaultValue={rwFilter} placeholder="RW" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-blue-500 transition-all shadow-sm" />
                    <button type="submit" className="px-6 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:opacity-90 transition-all">
                       Filter
                    </button>
                  </form>
               </div>
            </div>

           {/* COMPLAINT GRID */}
           {complaints.length === 0 ? (
              <EmptyState 
                 icon={Inbox}
                 title="Antrean Kosong"
                 description="Tidak ada laporan yang sesuai dengan kriteria filter Anda saat ini."
                 actionHref={(currentStatus || searchQuery || rtFilter || rwFilter) ? "/dashboard" : undefined}
                 actionLabel="Reset Filter"
              />
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
               {complaints.map((item: any) => (
                 <Link key={item.id} href={`/dashboard/complaint/${item.id}`} className="group h-full">
                    <div className={`h-full bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col gap-4 md:gap-5 relative overflow-hidden ${
                      item.isUrgent && item.status !== 'COMPLETED' 
                       ? 'border-red-100 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5' 
                       : 'border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-400/30'
                    }`}>
                     
                     <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border transition-colors ${
                              item.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                              item.status === 'PROCESSING' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                              'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                           }`}>
                              {item.status === 'PENDING' ? 'Menunggu' : item.status === 'PROCESSING' ? 'Diproses' : 'Selesai'}
                        </span>
                        <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <Camera size={16} />
                        </div>
                     </div>

                     <div className="space-y-1.5 md:space-y-2">
                        {item.imageUrl && (
                           <div className="h-32 md:h-40 w-full rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                              <img src={item.imageUrl} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           </div>
                        )}
                        <h4 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight italic truncate pl-5">
                           {item.title}
                        </h4>
                         <p className="text-[12px] md:text-[13px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-2 italic pl-5 border-l-2 border-slate-100 dark:border-slate-800 transition-colors">
                            "{item.content}"
                         </p>
                      </div>

                     <div className="mt-auto pt-4 md:pt-5 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2 md:gap-3">
                           <div className="h-8 w-8 md:h-9 md:w-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-bold text-[10px] shadow-inner transition-colors">
                              {item.author?.name[0] || 'U'}
                           </div>
                           <div className="min-w-0">
                              <p className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[100px] leading-none mb-1 md:mb-1.5 transition-colors">{item.author?.name || 'Anonim'}</p>
                               <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-blue-600 dark:text-blue-400 font-bold text-[12px] uppercase tracking-wider transition-colors">
                                  <div className="flex items-center gap-1.5">
                                     <MapPin size={12} /> RT {item.rt}/{item.rw}
                                  </div>
                                  <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block" />
                                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                     {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                  </span>
                               </div>
                           </div>
                        </div>
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-200 dark:text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500 shadow-inner">
                           <ArrowRight size={18} />
                        </div>
                     </div>

                     {item.isUrgent && item.status !== 'COMPLETED' && (
                       <div className="absolute top-0 right-10">
                          <div className="bg-red-500 text-white px-3 md:px-4 py-1.5 rounded-b-xl shadow-lg flex items-center gap-2">
                             <Zap size={12} fill="currentColor" className="text-red-100" />
                             <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white">Prioritas</span>
                          </div>
                       </div>
                     )}
                   </div>
                 </Link>
               ))}
             </div>
           )}

          {/* 📄 Pagination */}
          {totalPages > 1 && (
             <div className="mt-16 flex items-center justify-center gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                   <Link
                   key={i}
                   href={`/dashboard?page=${i + 1}${currentStatus ? `&status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}${rtFilter ? `&rt=${rtFilter}` : ''}${rwFilter ? `&rw=${rwFilter}` : ''}`}
                   className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                      currentPage === i + 1 
                         ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl shadow-slate-900/10' 
                         : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800 hover:border-slate-200'
                   }`}
                   >
                   {i + 1}
                   </Link>
                ))}
             </div>
          )}
        </section>

      </main>

    </div>
  )
}
