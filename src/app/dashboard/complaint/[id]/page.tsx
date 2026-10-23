import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { respondToComplaint } from '@/app/dashboard/actions'
import { getCachedProfile } from '@/lib/profile'
import { 
  Calendar, 
  ShieldAlert,
  Zap,
  MessageSquare,
  Send,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
import ComplaintStatusStepper from '@/components/dashboard/ComplaintStatusStepper'
import { getEscalationInfo } from '@/lib/escalation'
import { isStaff, isAdmin as checkIsAdmin } from '@/lib/authorization'
import ErrorToast from '@/components/ErrorToast'
import SuccessToast from '@/components/SuccessToast'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function safeFormatDate(dateVal: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!dateVal) return '-'
  const date = new Date(dateVal)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', options)
}

export default async function ComplaintDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const errorMessage = sp.error
  const successMessage = sp.message
  
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

  if (!complaint) notFound()

  const canManage = isStaff(profile)
  const isAdmin = checkIsAdmin(profile)
  const isAuthor = complaint.authorId === profile.id

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-32">
      {errorMessage && <ErrorToast key={errorMessage} message={errorMessage} />}
      {successMessage && <SuccessToast key={successMessage} message={successMessage} />}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1 no-print">
              <Link 
                href="/dashboard" 
                aria-label="Kembali ke beranda pengaduan"
                className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ChevronLeft size={20} />
              </Link>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Detail Laporan Warga
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Informasi Pengaduan
              </h1>
              <span className="font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                #LP-{complaint.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base no-print">
              Pantau tahapan verifikasi, tindakan lapangan, dan diskusi petugas penindak.
            </p>
          </div>
          
          <div className="flex items-center gap-3 no-print shrink-0">
            <PrintReceiptButton />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6 print-full-width">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              {complaint.imageUrl && (
                <div className="aspect-video w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                  <Image src={complaint.imageUrl} alt={complaint.title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
                  {complaint.isUrgent && complaint.status !== 'COMPLETED' && (
                    <div className="absolute top-4 left-4 bg-rose-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Zap size={14} fill="currentColor" /> Prioritas Mendesak
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider border ${STATUS_BADGE_CLASSES[complaint.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                    {STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                  </span>
                  <span className="text-xs font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    RT {complaint.rt} / RW {complaint.rw}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                    {complaint.categoryRel?.name || complaint.category}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                    {complaint.title}
                  </h2>
                  <div className="pl-4 border-l-2 border-blue-600/40 py-0.5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                      {complaint.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                    <div className="h-8 w-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-blue-800 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Lapor</p>
                      <p className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {safeFormatDate(complaint.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Information Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-base shadow-xs">
                {(complaint.author?.name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {complaint.author?.name || 'Anonim'}
                  </h3>
                  {complaint.author?.isVerified && (
                    <ShieldAlert size={15} className="text-emerald-600" fill="currentColor" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    Warga RT {complaint.author?.rt || '-'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="font-mono text-slate-500 dark:text-slate-500">
                    @{complaint.author?.username || 'user'}
                  </span>
                </div>
              </div>
            </div>

            {/* Linimasa Tahapan Status & Panel Aksi Petugas (Khusus Mobile) */}
            <div className="lg:hidden no-print space-y-4">
              {canManage && (
                <StaffActionsPanel
                  complaintId={complaint.id}
                  currentStatus={complaint.status}
                  isAdmin={isAdmin}
                />
              )}
              {canManage && (
                <EscalationStatus
                  escalationLevel={complaint.escalationLevel}
                  escalationLogs={escalationLogs}
                />
              )}
              <ComplaintStatusStepper 
                currentStatus={complaint.status} 
                createdAt={complaint.createdAt} 
                responses={complaint.responses} 
              />
            </div>

            {/* Discussion / Responses Section */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={17} className="text-blue-800 dark:text-blue-400" /> Linimasa Diskusi & Tanggapan
                </h3>
                <span className="text-xs font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {complaint.responses.length} Pesan
                </span>
              </div>

              {complaint.responses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Belum ada tanggapan atau pembaruan status untuk laporan ini.
                  </p>
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

              {/* Response Input Form */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print space-y-3">
                <form action={respondToComplaint} className="space-y-3">
                  <input type="hidden" name="complaintId" value={complaint.id} />
                  <textarea 
                    name="content" 
                    required 
                    placeholder="Tulis pesan atau pertanyaan tanggapan Anda di sini..." 
                    rows={3}
                    aria-label="Tulis tanggapan laporan"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                  />
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <ResponseFileHandler />
                    
                    <SubmitButton 
                      className="bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      loadingText="Mengirim..."
                      icon={<Send size={15} />}
                    >
                      Kirim Tanggapan
                    </SubmitButton>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-4 space-y-6 no-print">
            {/* Desktop Status Stepper: Tampil di kolom kanan pada layar desktop */}
            <div className="hidden lg:block">
              <ComplaintStatusStepper 
                currentStatus={complaint.status} 
                createdAt={complaint.createdAt} 
                responses={complaint.responses} 
              />
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Lokasi Kejadian</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[200px]">
                <LocationView
                  latitude={complaint.latitude}
                  longitude={complaint.longitude}
                  address={complaint.location}
                  complaintId={complaint.id}
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {complaint.location}
              </p>
            </div>

            {canManage ? (
              <div className="hidden lg:block space-y-6">
                <StaffActionsPanel
                  complaintId={complaint.id}
                  currentStatus={complaint.status}
                  isAdmin={isAdmin}
                />
                <EscalationStatus
                  escalationLevel={complaint.escalationLevel}
                  escalationLogs={escalationLogs}
                />
              </div>
            ) : (
              <EscalationStatus
                escalationLevel={complaint.escalationLevel}
                escalationLogs={escalationLogs}
              />
            )}

            {isAuthor && complaint.status === 'PENDING' && (
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Batalkan Laporan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Laporan belum diverifikasi dan dapat dibatalkan jika sudah tidak diperlukan.</p>
                  </div>
                  <CitizenDeleteButton id={complaint.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 📄 PRINT RECEIPT - muncul saat Cetak Tanda Terima */}
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
            <p className="text-[8pt] font-bold uppercase tracking-normal text-slate-400">SmartComplaint - Pengaduan Masyarakat</p>
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
              <p className="meta-value">{safeFormatDate(complaint.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
                  <p className="text-[7pt] text-slate-400 mt-0.5">{safeFormatDate(res.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          )}

          {/* Signature */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-[9pt] text-slate-500 mb-8">Dicetak pada {safeFormatDate(new Date(), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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


