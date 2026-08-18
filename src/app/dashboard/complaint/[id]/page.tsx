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

  const [complaint, escalationLogs] = await Promise.all([
    prisma.complaint.findUnique({
      where: { id },
      include: { 
        author: true,
        categoryRel: true,
        responses: {
          include: { officer: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    }),
    getEscalationInfo(id),
  ])

  if (!complaint) redirect('/dashboard')

  const canManage = isStaff(profile)
  const isAdmin = checkIsAdmin(profile)
  const isAuthor = complaint.authorId === profile.id

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
               <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal">Detail Operasional</span>
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
          <div className="lg:col-span-7 space-y-6 print-full-width">
            <div className="bg-brand-canvas rounded-xl shadow-sm border border-brand-hairline overflow-hidden transition-colors">
              {complaint.imageUrl && (
                <div className="aspect-video w-full overflow-hidden border-b border-brand-hairline relative">
                  <Image src={complaint.imageUrl} alt={complaint.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                  {complaint.isUrgent && complaint.status !== 'COMPLETED' && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Zap size={14} fill="currentColor" /> Prioritas Tinggi
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider border ${STATUS_BADGE_CLASSES[complaint.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                    {STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums font-medium text-brand-ink/70 bg-brand-canvas-soft px-2.5 py-1 rounded-md border border-brand-hairline">
                    RT {complaint.rt} / RW {complaint.rw}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    {complaint.categoryRel?.name || complaint.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-brand-ink mb-4 leading-tight">{complaint.title}</h1>
                <p className="text-brand-ink/80 leading-relaxed text-sm whitespace-pre-wrap mb-8 pl-4 border-l-2 border-brand-hairline">{complaint.content}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                  <LocationView
                    latitude={complaint.latitude}
                    longitude={complaint.longitude}
                    address={complaint.location}
                    complaintId={complaint.id}
                  />
                  <div className="flex items-center gap-3 p-3 bg-brand-canvas-soft rounded-lg border border-brand-hairline">
                    <div className="h-7 w-7 bg-brand-canvas rounded-md flex items-center justify-center text-brand-ink border border-brand-hairline">
                       <Calendar size={13} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-brand-ink/50 uppercase">Tanggal Lapor</p>
                      <p className="text-xs font-mono font-bold tabular-nums text-brand-ink">{new Date(complaint.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-brand-canvas p-4 sm:p-5 rounded-xl border border-brand-hairline flex items-center gap-4 shadow-sm">
               <div className="h-11 w-11 bg-brand-canvas-soft rounded-lg border border-brand-hairline flex items-center justify-center text-brand-ink/40 font-bold text-base">
                  {(complaint.author?.name || '?').charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-0.5">
                     <h2 className="text-sm font-bold text-brand-ink">{complaint.author?.name || 'Anonim'}</h2>
                     {complaint.author?.isVerified && (
                        <ShieldAlert size={14} className="text-brand-primary" fill="currentColor" />
                     )}
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-mono tabular-nums text-brand-ink/60">Warga RT {complaint.author?.rt || '-'}</span>
                     <span className="text-[10px] font-mono text-brand-ink/40">@{complaint.author?.username || 'user'}</span>
                  </div>
               </div>
            </div>

            {/* 💬 Discussion Section */}
            <section className="space-y-4 pt-2">
               <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                     <MessageSquare size={16} className="text-brand-primary" /> Linimasa Diskusi
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-brand-ink/40">{complaint.responses.length} Pesan</span>
               </div>

               {complaint.responses.length === 0 ? (
                 <div className="bg-brand-canvas p-8 rounded-xl border border-brand-hairline text-center">
                    <p className="text-xs text-brand-ink/40">Belum ada tanggapan untuk laporan ini</p>
                 </div>
               ) : (
                 <div className="space-y-3">
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
                <div className="p-2 bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm no-print">
                   <form action={respondToComplaint} className="relative">
                      <input type="hidden" name="complaintId" value={complaint.id} />
                      <textarea 
                        name="content" 
                        required 
                        placeholder="Ketik tanggapan Anda di sini..." 
                        rows={3}
                        aria-label="Tulis tanggapan"
                        className="w-full bg-transparent border-none rounded-lg px-3 py-2 text-xs text-brand-ink placeholder:text-brand-ink/40 outline-none resize-none font-medium"
                      />
                      
                      <ResponseFileHandler />
                      
                      <div className="absolute right-20 bottom-4 flex items-center gap-3">
                         <SubmitButton 
                           className="bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] h-12 px-8 rounded-xl font-bold text-[10px] uppercase tracking-normal hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-3 cursor-pointer"
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
              <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                   <div className="h-9 w-9 bg-red-500/10 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 border border-red-500/20">
                      <Trash2 size={18} />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-brand-ink leading-tight">Batalkan Laporan</h3>
                      <p className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Tarik kembali laporan Anda</p>
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
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm">
               <h2 className="text-xs font-bold uppercase tracking-wider text-brand-ink mb-6 flex items-center gap-2">
                 <Clock size={14} className="text-brand-primary" /> Progress Operasional
               </h2>
               <div className="space-y-6">
                  {[
                    { label: 'Laporan Diterima', desc: 'Sistem telah merekam laporan dari warga.', status: 'PENDING', icon: CheckCircle },
                    { label: 'Sedang Ditangani', desc: 'Petugas sedang melakukan investigasi/perbaikan.', status: 'PROCESSING', icon: Activity },
                    { label: 'Laporan Selesai', desc: 'Masalah telah teratasi dan laporan ditutup.', status: 'COMPLETED', icon: CheckCircle2 }
                  ].map((step, i, arr) => {
                    const isCompleted = complaint.status === 'COMPLETED' || (complaint.status === 'PROCESSING' && i <= 1) || (complaint.status === 'PENDING' && i === 0)
                    const isActive = complaint.status === step.status
                    
                    return (
                      <div key={i} className="flex gap-4">
                         <div className="flex flex-col items-center">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-brand-primary text-[#0e0f0c]' : 'bg-brand-canvas-soft text-brand-ink/20'} ${isActive ? 'ring-2 ring-brand-primary/40' : ''}`}>
                               <step.icon size={12} />
                            </div>
                            {i < arr.length - 1 && (
                               <div className={`w-0.5 h-7 transition-colors ${isCompleted && complaint.status !== step.status ? 'bg-brand-primary' : 'bg-brand-hairline'}`} />
                            )}
                         </div>
                         <div className="pt-0.5">
                            <h5 className={`text-xs font-bold uppercase tracking-normal ${isCompleted ? 'text-brand-ink' : 'text-brand-ink/30'}`}>{step.label}</h5>
                            <p className="text-[11px] text-brand-ink/60 mt-1 font-medium">{step.desc}</p>
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">TANDA TERIMA LAPORAN</h1>
            <p className="text-[8pt] font-bold uppercase tracking-normal text-slate-400">SmartComplaint — Pengaduan Masyarakat</p>
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
                <p className="text-[7pt] text-slate-400 uppercase tracking-normal">Pelapor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


