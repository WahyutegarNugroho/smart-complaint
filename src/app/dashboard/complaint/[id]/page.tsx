import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { updateComplaintStatus, adminDeleteComplaint, respondToComplaint } from '@/app/dashboard/actions'
import { getCachedProfile } from '@/lib/profile'
import Image from 'next/image'
import { 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  Trash2,
  Zap,
  CheckCircle,
  MessageSquare,
  Send,
  Camera,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import DeleteComplaintButton from './DeleteComplaintButton'
import SubmitButton from '@/components/SubmitButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ComplaintDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const data = await getCachedProfile()
  if (!data) redirect('/login')
  const { profile } = data

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { 
      author: true,
      responses: {
        include: { officer: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!complaint) redirect('/dashboard')

  const canManage = profile.role === 'ADMIN' || profile.role === 'PETUGAS'
  const isAdmin = profile.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-32">
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Detail Operasional</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Informasi Laporan #{complaint.id.slice(-6).toUpperCase()}</h1>
            <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Pantau riwayat penanganan dan koordinasi petugas lapangan.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all group">
              {complaint.imageUrl && (
                <div className="aspect-video w-full overflow-hidden border-b border-slate-100 dark:border-slate-800 relative">
                  <Image src={complaint.imageUrl} alt={complaint.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  {complaint.isUrgent && complaint.status !== 'COMPLETED' && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                      <Zap size={14} fill="currentColor" /> Prioritas Tinggi
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest border transition-colors ${
                    complaint.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                    complaint.status === 'PROCESSING' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                  }`}>
                    {complaint.status === 'PENDING' ? 'Menunggu' : complaint.status === 'PROCESSING' ? 'Diproses' : 'Selesai'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    Blok Wilayah RT {complaint.rt} / RW {complaint.rw}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight italic transition-colors italic">{complaint.title}</h1>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-[15px] font-medium whitespace-pre-wrap mb-10 transition-colors italic pl-6 border-l-2 border-slate-100 dark:border-slate-800 italic">"{complaint.content}"</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 dark:border-slate-800">
                       <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest italic">Lokasi Spesifik</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">{complaint.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 dark:border-slate-800">
                       <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest italic">Tanggal Lapor</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">{new Date(complaint.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm transition-all hover:shadow-xl group">
               <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700 font-bold text-2xl transition-all group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6">
                  {(complaint.author.name || '?').charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1.5">
                     <h4 className="text-xl font-bold text-slate-900 dark:text-white italic">{complaint.author.name || 'Anonim'}</h4>
                     {complaint.author.isVerified && (
                        <ShieldAlert size={18} className="text-blue-500" fill="currentColor" />
                     )}
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-500 text-[9px] font-bold rounded-lg uppercase tracking-widest border border-slate-100 dark:border-slate-800">Warga RT {complaint.author.rt}</span>
                     <span className="text-[11px] font-medium text-slate-500 dark:text-slate-600 italic">{complaint.author.username}</span>
                  </div>
               </div>
            </div>

            {/* 💬 Discussion Section */}
            <section className="space-y-6 pt-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white italic flex items-center gap-3">
                     <MessageSquare size={22} className="text-blue-500" /> Linimasa Diskusi
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{complaint.responses.length} Pesan</span>
               </div>

               {complaint.responses.length === 0 ? (
                 <div className="bg-white dark:bg-slate-900 p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center transition-colors shadow-sm">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto mb-6 transition-all group-hover:scale-110">
                       <MessageSquare size={40} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest italic">Belum ada tanggapan</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {complaint.responses.map((res) => {
                      const isOfficer = res.officer.role !== 'MASYARAKAT'
                      return (
                        <div key={res.id} className={`flex gap-4 ${isOfficer ? 'flex-row' : 'flex-row-reverse'}`}>
                           <div className="shrink-0 pt-1">
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${isOfficer ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                                 {(res.officer.name || '?').charAt(0).toUpperCase()}
                              </div>
                           </div>
                           <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${isOfficer ? 'items-start' : 'items-end flex flex-col'}`}>
                              <div className="flex items-center gap-3 px-1">
                                 <span className="text-[11px] font-bold text-slate-900 dark:text-white italic">{res.officer.name || 'Petugas'}</span>
                                 <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{new Date(res.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className={`p-5 rounded-[1.5rem] text-[14px] leading-relaxed font-medium transition-all shadow-sm ${isOfficer ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300' : 'bg-blue-600 dark:bg-blue-500 text-white'}`}>
                                 {res.content}
                                 {res.imageUrl && (
                                   <div className="mt-4 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 relative h-64">
                                      <Image src={res.imageUrl} alt="Lampiran" fill className="object-cover" />
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                      )
                    })}
                 </div>
               )}

               {/* Response Form */}
               <div className="mt-10 p-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl transition-all focus-within:ring-4 focus-within:ring-blue-500/5">
                  <form action={respondToComplaint} className="relative">
                     <input type="hidden" name="complaintId" value={complaint.id} />
                     <input type="hidden" name="status" value={complaint.status} />
                     <textarea 
                       name="content" 
                       required 
                       placeholder="Ketik tanggapan Anda di sini..." 
                       rows={4}
                       className="w-full bg-transparent border-none rounded-[1.5rem] px-6 py-5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 outline-none resize-none font-medium transition-all"
                     />
                     <div className="absolute right-4 bottom-4 flex items-center gap-3">
                        <label className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-inner">
                           <Camera size={20} />
                           <input type="file" name="responseImage" className="hidden" />
                        </label>
                        <SubmitButton 
                          className="bg-slate-900 dark:bg-blue-600 text-white h-12 px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                          loadingText=""
                          icon={<Send size={18} />}
                        >
                           Kirim
                        </SubmitButton>
                     </div>
                  </form>
               </div>
            </section>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-5 space-y-8">
            {canManage && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white italic leading-none mb-1">Moderasi</h3>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Kontrol Status Laporan</p>
                   </div>
                </div>
                
                <form action={updateComplaintStatus} className="space-y-6">
                  <input type="hidden" name="id" value={complaint.id} />
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1 italic">Ubah Progress</label>
                    <div className="relative group">
                       <select 
                         name="status" 
                         defaultValue={complaint.status}
                         className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-[11px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
                       >
                         <option value="PENDING" className="dark:bg-slate-900">🕒 MENUNGGU KONFIRMASI</option>
                         <option value="PROCESSING" className="dark:bg-slate-900">⚙️ SEDANG DIPROSES</option>
                         <option value="COMPLETED" className="dark:bg-slate-900">✅ DINYATAKAN SELESAI</option>
                       </select>
                    </div>
                  </div>
                  <SubmitButton 
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
                    loadingText="Menyimpan..."
                  >
                    Simpan Perubahan
                  </SubmitButton>
                </form>

                {isAdmin && (
                   <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                      <p className="text-[9px] font-bold text-red-400 dark:text-red-600 uppercase tracking-[0.2em] mb-5 ml-1 italic">Tindakan Destruktif</p>
                      <DeleteComplaintButton id={complaint.id} />
                   </div>
                )}
              </div>
            )}

            {/* Timeline / Progress */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all group">
               <div className="absolute top-0 right-0 p-6 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                  <Activity size={120} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-10 italic flex items-center gap-3 relative z-10 transition-colors">
                 <Clock size={22} className="text-blue-500" /> Progress Operasional
               </h3>
               <div className="space-y-10 relative z-10">
                  {[
                    { label: 'Laporan Diterima', desc: 'Sistem telah merekam laporan dari warga.', status: 'PENDING', icon: CheckCircle },
                    { label: 'Sedang Ditangani', desc: 'Petugas sedang melakukan investigasi/perbaikan.', status: 'PROCESSING', icon: Activity },
                    { label: 'Laporan Selesai', desc: 'Masalah telah teratasi dan laporan ditutup.', status: 'COMPLETED', icon: CheckCircle2 }
                  ].map((step, i, arr) => {
                    const isCompleted = complaint.status === 'COMPLETED' || (complaint.status === 'PROCESSING' && i <= 1) || (complaint.status === 'PENDING' && i === 0)
                    const isActive = complaint.status === step.status
                    
                    return (
                      <div key={i} className="flex gap-6 group/step">
                         <div className="flex flex-col items-center">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700'} ${isActive ? 'ring-4 ring-blue-500/10 scale-110' : ''}`}>
                               <step.icon size={14} />
                            </div>
                            {i < arr.length - 1 && (
                               <div className={`w-0.5 h-10 transition-all ${isCompleted && complaint.status !== step.status ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
                            )}
                         </div>
                         <div className="pt-0.5">
                            <h5 className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-700'}`}>{step.label}</h5>
                            <p className="text-[12px] text-slate-700 dark:text-slate-500 mt-1.5 font-medium italic transition-colors">{step.desc}</p>
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
