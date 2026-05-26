import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { respondToComplaint } from '@/app/dashboard/actions'
import { getCachedProfile } from '@/lib/profile'
import Image from 'next/image'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ShieldAlert,
  Zap,
  CheckCircle,
  MessageSquare,
  Send,
  ChevronLeft,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '@/lib/constants'
import CitizenDeleteButton from './CitizenDeleteButton'
import ResponseFileHandler from './ResponseFileHandler'
import ResponseItem from './ResponseItem'
import SubmitButton from '@/components/SubmitButton'
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import PrintReceiptButton from './PrintReceiptButton'
import EscalationStatus from './EscalationStatus'
import StaffActionsPanel from './StaffActionsPanel'
import { LocationView } from '@/components/map'
import { getEscalationInfo } from '@/lib/escalation'
import { isStaff, isAdmin as checkIsAdmin } from '@/lib/authorization'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ComplaintDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  if (data.status === 'ERROR' || !data.profile) return <SessionErrorState />
  
  const { profile } = data

  const complaint = await prisma.complaint.findUnique({
    where: { id },
  include: { 
    author: true,
    categoryRel: true,
    responses: {
      include: { officer: true },
      orderBy: { createdAt: 'asc' }
    }
  }
  })

  if (!complaint) redirect('/dashboard')

  const canManage = isStaff(profile)
  const isAdmin = checkIsAdmin(profile)
  const isAuthor = complaint.authorId === profile.id
  const escalationLogs = await getEscalationInfo(complaint.id)

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-32">
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2 no-print">
               <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Detail Operasional</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Informasi Laporan #{complaint.id.slice(-6).toUpperCase()}</h1>
            <p className="text-brand-ink/60 font-medium text-sm md:text-base no-print">Pantau riwayat penanganan dan koordinasi petugas lapangan.</p>
          </div>
          
          <div className="flex items-center gap-4 no-print shrink-0">
             <PrintReceiptButton />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-8 print-full-width">
            <div className="bg-brand-canvas rounded-[2rem] shadow-sm border border-brand-hairline overflow-hidden transition-all group">
              {complaint.imageUrl && (
                <div className="aspect-video w-full overflow-hidden border-b border-brand-hairline relative">
                  <Image src={complaint.imageUrl} alt={complaint.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  {complaint.isUrgent && complaint.status !== 'COMPLETED' && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                      <Zap size={14} fill="currentColor" /> Prioritas Tinggi
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest border transition-colors ${STATUS_BADGE_CLASSES[complaint.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                    {STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                  </span>
    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
      Blok Wilayah RT {complaint.rt} / RW {complaint.rw}
    </span>
    <span className="text-[9px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
      {complaint.categoryRel?.name || complaint.category}
    </span>
  </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">{complaint.title}</h1>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed text-[15px] font-medium whitespace-pre-wrap mb-10 transition-colors pl-6 border-l-2 border-slate-100 dark:border-slate-800">&quot;{complaint.content}&quot;</p>
                
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                  <LocationView
                    latitude={complaint.latitude}
                    longitude={complaint.longitude}
                    address={complaint.location}
                    complaintId={complaint.id}
                  />
                  <div className="flex items-center gap-3 p-4 bg-brand-canvas-soft rounded-2xl border border-brand-hairline transition-colors">
                    <div className="h-8 w-8 bg-brand-canvas rounded-xl flex items-center justify-center text-brand-ink shadow-sm border border-brand-hairline">
                       <Calendar size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-brand-ink/40 uppercase tracking-widest">Tanggal Lapor</p>
                      <p className="text-[13px] font-bold text-brand-ink">{new Date(complaint.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-brand-canvas p-6 md:p-8 rounded-2xl border border-brand-hairline flex items-center gap-6 shadow-sm transition-all hover:shadow-xl group">
               <div className="h-16 w-16 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-ink/30 font-bold text-2xl transition-all group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-[#0e0f0c] group-hover:rotate-6">
                  {(complaint.author?.name || '?').charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1.5">
                     <h4 className="text-xl font-bold text-brand-ink">{complaint.author?.name || 'Anonim'}</h4>
                     {complaint.author?.isVerified && (
                        <ShieldAlert size={18} className="text-brand-primary" fill="currentColor" />
                     )}
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="px-2.5 py-1 bg-brand-canvas-soft text-brand-ink/60 text-[9px] font-bold rounded-lg uppercase tracking-widest border border-brand-hairline">Warga RT {complaint.author?.rt || '-'}</span>
                     <span className="text-[11px] font-medium text-brand-ink/40">{complaint.author?.username || 'user'}</span>
                  </div>
               </div>
            </div>

            {/* 💬 Discussion Section */}
            <section className="space-y-6 pt-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-bold text-brand-ink flex items-center gap-3">
                     <MessageSquare size={22} className="text-brand-primary" /> Linimasa Diskusi
                  </h3>
                  <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">{complaint.responses.length} Pesan</span>
               </div>

               {complaint.responses.length === 0 ? (
                 <div className="bg-brand-canvas p-12 rounded-[2rem] border border-brand-hairline text-center transition-colors shadow-sm">
                    <div className="h-20 w-20 bg-brand-canvas-soft rounded-3xl flex items-center justify-center text-brand-ink/20 mx-auto mb-6 transition-all group-hover:scale-110">
                       <MessageSquare size={40} />
                    </div>
                    <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-widest">Belum ada tanggapan</p>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {complaint.responses.map((res) => (
                      <ResponseItem 
                        key={res.id} 
                        res={{
                          id: res.id,
                          content: res.content,
                          imageUrl: res.imageUrl,
                          officerId: res.officerId,
                          createdAt: res.createdAt,
                          officer: {
                            name: res.officer?.name,
                            role: res.officer?.role
                          }
                        }} 
                        currentProfileId={profile.id} 
                        isAdmin={profile.role === 'ADMIN'} 
                      />
                    ))}
                 </div>
               )}

               {/* Response Form */}
                <div className="mt-10 p-2 bg-brand-canvas rounded-[2rem] border border-brand-hairline shadow-xl transition-all focus-within:ring-4 focus-within:ring-brand-primary/5 no-print">
                   <form action={respondToComplaint} className="relative">
                      <input type="hidden" name="complaintId" value={complaint.id} />
                      <input type="hidden" name="status" value={complaint.status} />
                      <textarea 
                        name="content" 
                        required 
                        placeholder="Ketik tanggapan Anda di sini..." 
                        rows={4}
                        aria-label="Tulis tanggapan"
                        className="w-full bg-transparent border-none rounded-[1.5rem] px-6 py-5 text-sm text-brand-ink placeholder:text-brand-ink/30 outline-none resize-none font-medium transition-all"
                      />
                      
                      <ResponseFileHandler />
                      
                      <div className="absolute right-20 bottom-4 flex items-center gap-3">
                         <SubmitButton 
                           className="bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] h-12 px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-3 cursor-pointer"
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
          <div className="lg:col-span-5 space-y-8 no-print">
            {isAuthor && complaint.status === 'PENDING' && (
              <div className="bg-brand-canvas p-8 rounded-[2rem] border border-brand-hairline shadow-sm transition-all">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-12 w-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 border border-red-500/20">
                      <Trash2 size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-brand-ink leading-none mb-1">Batalkan Laporan</h3>
                      <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">Tarik kembali laporan Anda</p>
                   </div>
                </div>
                <CitizenDeleteButton id={complaint.id} />
              </div>
            )}

            {canManage && (
              <StaffActionsPanel
                complaintId={complaint.id}
                currentStatus={complaint.status}
                isAdmin={isAdmin}
              />
            )}

            <EscalationStatus
              escalationLevel={complaint.escalationLevel}
              escalationLogs={escalationLogs}
            />

            {/* Timeline / Progress */}
            <div className="bg-brand-canvas p-8 rounded-[2rem] border border-brand-hairline shadow-sm relative overflow-hidden transition-all group">
               <div className="absolute top-0 right-0 p-6 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                  <Activity size={120} />
               </div>
               <h3 className="text-lg font-bold text-brand-ink mb-10 flex items-center gap-3 relative z-10 transition-colors">
                 <Clock size={22} className="text-brand-primary" /> Progress Operasional
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
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-brand-primary text-[#0e0f0c] shadow-lg shadow-brand-primary/20' : 'bg-brand-canvas-soft text-brand-ink/20'} ${isActive ? 'ring-4 ring-brand-primary/30 scale-110 animate-pulse' : ''}`}>
                               <step.icon size={14} />
                            </div>
                            {i < arr.length - 1 && (
                               <div className={`w-0.5 h-10 transition-all duration-500 ${isCompleted && complaint.status !== step.status ? 'bg-brand-primary' : 'bg-brand-hairline'}`} />
                            )}
                         </div>
                         <div className="pt-0.5">
                            <h5 className={`text-[13px] font-bold uppercase tracking-widest transition-colors duration-500 ${isCompleted ? 'text-brand-ink' : 'text-brand-ink/30'}`}>{step.label}</h5>
                            <p className="text-[12px] text-brand-ink/60 mt-1.5 font-medium transition-colors duration-500">{step.desc}</p>
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 📄 PRINT RECEIPT — muncul saat Cetak Tanda Terima */}
      <div className="hidden print:block">
        <style>{`
          @page { margin: 2cm; }
          .print-receipt { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1e293b; }
          .print-receipt .response-item { border-left: 3px solid #e2e8f0; padding-left: 12px; margin-bottom: 12px; }
          .print-receipt .meta-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
          .print-receipt .meta-value { font-size: 10pt; font-weight: 600; color: #1e293b; }
        `}</style>

        <div className="print-receipt p-8 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 pb-8 border-b-2 border-slate-900">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">TANDA TERIMA LAPORAN</h1>
            <p className="text-[8pt] font-bold uppercase tracking-[0.3em] text-slate-400">SmartComplaint — Pengaduan Masyarakat</p>
          </div>

          {/* Info Laporan */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div>
              <p className="meta-label">ID Laporan</p>
              <p className="meta-value">#{complaint.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="meta-label">Status</p>
              <p className="meta-value">{(STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu').toUpperCase()}</p>
            </div>
            <div>
              <p className="meta-label">Judul</p>
              <p className="meta-value">{complaint.title}</p>
            </div>
            <div>
              <p className="meta-label">Kategori</p>
              <p className="meta-value uppercase">{complaint.category}</p>
            </div>
            <div>
              <p className="meta-label">Tanggal Lapor</p>
              <p className="meta-value">{new Date(complaint.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="meta-label">Prioritas</p>
              <p className="meta-value">{complaint.isUrgent ? 'TINGGI' : 'NORMAL'}</p>
            </div>
          </div>

          {/* Pelapor */}
          <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="meta-label mb-2">Data Pelapor</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10pt]">
              <p><span className="font-bold text-slate-600">Nama:</span> {complaint.author?.name || 'Anonim'}</p>
              <p><span className="font-bold text-slate-600">Username:</span> {complaint.author?.username || '-'}</p>
              <p><span className="font-bold text-slate-600">Domisili:</span> RT {complaint.rt}/{complaint.rw}</p>
              <p><span className="font-bold text-slate-600">Lokasi:</span> {complaint.location}</p>
            </div>
          </div>

          {/* Isi Laporan */}
          <div className="mb-8">
            <p className="meta-label mb-2">Isi Laporan</p>
            <p className="text-[10pt] text-slate-700 leading-relaxed p-4 bg-white border border-slate-200 rounded-xl">&quot;{complaint.content}&quot;</p>
          </div>

          {/* Tanggapan */}
          {complaint.responses.length > 0 && (
            <div className="mb-8">
              <p className="meta-label mb-3">Tanggapan ({complaint.responses.length})</p>
              {complaint.responses.map(res => (
                <div key={res.id} className="response-item mb-3">
                  <p className="text-[9pt] font-bold text-slate-800">{res.officer?.name || 'Petugas'}</p>
                  <p className="text-[9pt] text-slate-600 mt-0.5">{res.content}</p>
                  <p className="text-[7pt] text-slate-400 mt-0.5">{new Date(res.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          )}

          {/* Signature */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-[9pt] text-slate-500 mb-8">Dicetak pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <div className="inline-block text-center">
              <div className="w-48 border-t-2 border-slate-900 mx-auto pt-2">
                <p className="text-[9pt] font-bold text-slate-900">{complaint.author?.name || 'Pengguna'}</p>
                <p className="text-[7pt] text-slate-400 uppercase tracking-widest">Pelapor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
