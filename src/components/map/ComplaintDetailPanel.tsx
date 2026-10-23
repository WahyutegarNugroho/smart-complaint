'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Calendar, MapPin, User, AlertTriangle, ArrowUpRight, LockKeyhole } from 'lucide-react'
import type { ComplaintMarker } from './MapPageClient'
import { STATUS_LABELS } from '@/lib/constants'

interface ComplaintDetailPanelProps {
  complaint: ComplaintMarker | null
  onClose: () => void
  userRole: string
  currentUserId: string
}

const statusConfig = {
  PENDING: { bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  PROCESSING: { bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  COMPLETED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
}

const escalationLabels: Record<string, string> = {
  NONE: '',
  LEVEL_1: 'Menunggu >24 jam',
  LEVEL_2: 'Menunggu >48 jam',
  LEVEL_3: 'Diproses >72 jam',
}

export default function ComplaintDetailPanel({ complaint, onClose, userRole, currentUserId }: ComplaintDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!complaint) return
    panelRef.current?.focus()

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [complaint, onClose])

  useEffect(() => {
    if (complaint) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [complaint])

  if (!complaint) return null

  const status = statusConfig[complaint.status as keyof typeof statusConfig] || statusConfig.PENDING
  const date = complaint.createdAt 
    ? new Date(complaint.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '-'
  const incidentDate = complaint.incidentDate 
    ? new Date(complaint.incidentDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '-'
  const escalationLabel = escalationLabels[complaint.escalationLevel] || ''
  const isOwnComplaint = complaint.authorId === currentUserId
  const canViewFull = userRole !== 'MASYARAKAT' || isOwnComplaint

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[1000] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[1001] overflow-y-auto transition-transform duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-slate-900 dark:text-white truncate pr-2">Detail Laporan</h2>
          <button
            onClick={onClose}
            className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0 cursor-pointer"
            aria-label="Tutup panel detail laporan"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {canViewFull ? (
            <>
              {complaint.imageUrl && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-start gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 ${status.bg}`}>
                  {STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                </span>
                {complaint.isUrgent && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 shrink-0">
                    <AlertTriangle size={11} />
                    Prioritas
                  </span>
                )}
                {escalationLabel && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shrink-0">
                    {escalationLabel}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">{complaint.title}</h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                {complaint.content}
              </p>

              <div className="space-y-3 text-sm">
                {complaint.categoryName && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center shrink-0 text-blue-800 dark:text-blue-300 font-bold text-xs">
                      {complaint.categoryName.charAt(0)}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{complaint.categoryName}</span>
                  </div>
                )}

                {userRole !== 'MASYARAKAT' ? (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="font-medium">{complaint.author?.name || 'Anonim'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="font-medium">Warga Pelapor</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin size={15} className="shrink-0 text-slate-400" />
                  {userRole !== 'MASYARAKAT' ? (
                    <span className="font-medium">
                      {complaint.location}
                      {complaint.rt && complaint.rw && (
                        <span className="text-slate-500 font-mono tabular-nums"> (RT {complaint.rt}/RW {complaint.rw})</span>
                      )}
                    </span>
                  ) : (
                    <span className="font-medium">
                      {complaint.rt && complaint.rw ? `RT ${complaint.rt}/RW ${complaint.rw}` : 'Lokasi tidak tersedia'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Calendar size={15} className="shrink-0 text-slate-400" />
                  <span className="font-medium">Kejadian: {incidentDate}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Calendar size={15} className="shrink-0 text-slate-400" />
                  <span className="font-medium">Dilaporkan: {date}</span>
                </div>
              </div>

              <Link
                href={`/dashboard/complaint/${complaint.id}`}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Lihat Detail Lengkap
                <ArrowUpRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 ${status.bg}`}>
                  {STATUS_LABELS[complaint.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                </span>
                {complaint.isUrgent && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 shrink-0">
                    <AlertTriangle size={11} />
                    Prioritas
                  </span>
                )}
              </div>

              {complaint.categoryName && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center shrink-0 text-blue-800 dark:text-blue-300 font-bold text-xs">
                    {complaint.categoryName.charAt(0)}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{complaint.categoryName}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={15} className="shrink-0 text-slate-400" />
                <span className="font-medium">
                  {complaint.rt && complaint.rw ? `RT ${complaint.rt}/RW ${complaint.rw}` : 'Lokasi tidak tersedia'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300">
                <LockKeyhole size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold leading-snug">
                  Detail lengkap laporan hanya dapat dilihat oleh pelapor
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

