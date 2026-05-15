import Link from 'next/link'
import Image from 'next/image'
import {
   Plus,
   Search,
   Megaphone,
   Bell,
   Camera,
   Zap,
   MapPin,
   ArrowRight,
   Inbox,
   CheckCircle2,
   ShieldCheck,
   Clock,
   Activity,
   CalendarDays
} from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import SuccessToast from '@/components/SuccessToast'

interface MasyarakatDashboardProps {
   profile: any
   announcements: any[]
   complaints: any[]
   stats: any
   currentStatus?: string
   searchQuery?: string
   currentPage: number
   totalPages: number
   successMessage?: string
}

export default function MasyarakatDashboard({
   profile,
   announcements,
   complaints,
   stats,
   currentStatus,
   searchQuery,
   currentPage,
   totalPages,
   successMessage
}: MasyarakatDashboardProps) {

   return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
         
         {/* Toast Notification */}
         {successMessage && <SuccessToast message={successMessage} />}

         <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
           
           {/* 👋 HEADER SECTION */}
           <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-1">
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Halo, {profile.name}</h1>
               <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Ada yang bisa kami bantu untuk lingkungan hari ini?</p>
             </div>
             
             <div className="flex items-center gap-3">
                <Link
                   href="/dashboard/create"
                   className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all active:scale-95"
                >
                   <Plus size={16} /> Buat Laporan
                </Link>
             </div>
            </section>
            {/* 📊 KPI DASHBOARD CARDS */}
           {!currentStatus && (
             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {[
                 { label: 'Total Laporan', val: stats.total, icon: Inbox, color: 'slate' },
                 { label: 'Menunggu', val: stats.pending, icon: Clock, color: 'amber' },
                 { label: 'Diproses', val: stats.processing, icon: Activity, color: 'blue' },
                 { label: 'Selesai', val: stats.completed, icon: CheckCircle2, color: 'emerald' }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                       <div className={`h-9 w-9 md:h-10 md:w-10 rounded-xl bg-${item.color}-50 dark:bg-${item.color === 'slate' ? 'slate-800' : `${item.color}-900/20`} flex items-center justify-center text-${item.color}-600 dark:text-${item.color === 'slate' ? 'slate-300' : `${item.color}-300`} border border-${item.color}-100 dark:border-${item.color === 'slate' ? 'slate-700' : `${item.color}-800`} transition-colors`}>
                          <item.icon size={18} />
                       </div>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.val}</p>
                    <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 mt-1">{item.label}</p>
                 </div>
               ))}
             </section>
           )}

           {/* 📢 ANNOUNCEMENTS SECTION */}
           {!currentStatus && announcements.length > 0 && (
             <section id="announcements" className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Informasi Warga</h3>
                   <Bell size={16} className="text-blue-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                   {announcements.map((ann, idx) => (
                      <div key={ann.id} className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 ${idx === 0 ? 'bg-slate-900 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                         <div className="flex items-center gap-2 mb-4">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${idx === 0 ? 'text-slate-500' : 'text-slate-500'}`}>
                               {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                            </span>
                         </div>
                         <h4 className="font-bold text-lg mb-3 leading-tight">{ann.title}</h4>
                         <p className={`text-sm line-clamp-2 leading-relaxed opacity-70 italic`}>
                            "{ann.content}"
                         </p>
                      </div>
                   ))}
                </div>
             </section>
           )}

           {/* 📋 WORKSPACE: REPORT LIST */}
           <section className="space-y-6 md:space-y-8 pt-4 md:pt-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
                 <div className="flex items-center gap-4">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Riwayat Laporan</h2>
                 </div>

                 <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
                   <Link
                      href="/dashboard"
                      className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${!currentStatus ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-500' : 'text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                   >
                      Semua
                   </Link>
                   {[
                     { id: 'PENDING', label: 'Menunggu' },
                     { id: 'PROCESSING', label: 'Diproses' },
                     { id: 'COMPLETED', label: 'Selesai' }
                   ].map((t) => (
                     <Link
                       key={t.id}
                       href={`/dashboard?status=${t.id}`}
                       className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                         currentStatus === t.id 
                           ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-500' 
                           : 'text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                       }`}
                     >
                       {t.label}
                     </Link>
                   ))}
                 </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 transition-colors group-focus-within:text-blue-500" size={16} />
                 <form>
                    <input 
                      name="q"
                      type="text" 
                      defaultValue={searchQuery}
                      placeholder="Cari laporan Anda..." 
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-sm font-medium dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                 </form>
              </div>

              {/* REPORT GRID */}
              {complaints.length === 0 ? (
                 <EmptyState 
                    icon={Inbox}
                    title="Laporan Kosong"
                    description="Belum ada laporan yang sesuai dengan kriteria filter Anda."
                    actionHref={(currentStatus || searchQuery) ? "/dashboard" : undefined}
                    actionLabel="Reset Filter"
                 />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                  {complaints.map((item: any) => (
                    <Link key={item.id} href={`/dashboard/complaint/${item.id}`} className="group h-full">
                      <div className={`h-full bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col gap-4 md:gap-5 relative overflow-hidden ${
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
                           <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                             <Camera size={16} />
                           </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2">
                           {item.imageUrl && (
                              <div className="relative h-32 md:h-40 w-full rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                                 <Image 
                                    src={item.imageUrl} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                 />
                              </div>
                           )}
                           <h4 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight italic truncate pl-5">
                              {item.title}
                           </h4>
                           <p className={`text-[12px] md:text-[13px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-2 italic pl-5 border-l-2 border-slate-100 dark:border-slate-800 transition-colors`}>
                              "{item.content}"
                           </p>
                        </div>

                        <div className="mt-auto pt-4 md:pt-5 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between transition-colors">
                           <div className="flex items-center gap-2.5">
                              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[12px] uppercase tracking-wider transition-colors">
                                 <MapPin size={12} /> RT {item.rt}/{item.rw}
                              </div>
                              <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
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
                       href={`/dashboard?page=${i + 1}${currentStatus ? `&status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
