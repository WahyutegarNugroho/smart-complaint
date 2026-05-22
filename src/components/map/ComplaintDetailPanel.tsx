'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Calendar, MapPin, User, AlertTriangle, ArrowUpRight } from 'lucide-react'
import type { ComplaintMarker } from './MapPageClient'

interface ComplaintDetailPanelProps {
  complaint: ComplaintMarker | null
  onClose: () => void
}

const statusConfig = {
  PENDING: { label: 'Menunggu', bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  PROCESSING: { label: 'Diproses', bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  COMPLETED: { label: 'Selesai', bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
}

const escalationLabels: Record<string, string> = {
  NONE: '',
  LEVEL_1: 'Menunggu >24 jam',
  LEVEL_2: 'Menunggu >48 jam',
  LEVEL_3: 'Diproses >72 jam',
}

export default function ComplaintDetailPanel({ complaint, onClose }: ComplaintDetailPanelProps) {
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
  const date = new Date(complaint.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  const incidentDate = new Date(complaint.incidentDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const escalationLabel = escalationLabels[complaint.escalationLevel] || ''

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-canvas shadow-2xl z-[1001] overflow-y-auto transition-transform duration-300 focus:outline-none"
      >
        <div className="sticky top-0 bg-brand-canvas/90 backdrop-blur-md border-b border-brand-hairline px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-bold text-brand-ink truncate pr-2">Detail Laporan</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/50 hover:text-brand-ink transition-all shrink-0"
            aria-label="Tutup panel"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {complaint.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-brand-hairline">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0 ${status.bg}`}>
              {status.label}
            </span>
            {complaint.isUrgent && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-1 shrink-0">
                <AlertTriangle size={10} />
                Prioritas
              </span>
            )}
            {escalationLabel && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 shrink-0">
                {escalationLabel}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-brand-ink leading-snug">{complaint.title}</h3>

          <p className="text-sm text-brand-ink/70 leading-relaxed line-clamp-4">
            {complaint.content}
          </p>

          <div className="space-y-3 text-sm">
            {complaint.categoryName && (
              <div className="flex items-center gap-3 text-brand-ink/60">
                <span className="h-7 w-7 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold">{complaint.categoryName.charAt(0)}</span>
                </span>
                <span className="font-medium">{complaint.categoryName}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-brand-ink/60">
              <User size={14} className="shrink-0 opacity-50" />
              <span className="font-medium">{complaint.author?.name || 'Anonim'}</span>
            </div>

            <div className="flex items-center gap-3 text-brand-ink/60">
              <MapPin size={14} className="shrink-0 opacity-50" />
              <span className="font-medium">
                {complaint.location}
                {complaint.rt && complaint.rw && (
                  <span className="text-brand-ink/40"> (RT {complaint.rt}/{complaint.rw})</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 text-brand-ink/60">
              <Calendar size={14} className="shrink-0 opacity-50" />
              <span className="font-medium">Kejadian: {incidentDate}</span>
            </div>

            <div className="flex items-center gap-3 text-brand-ink/60">
              <Calendar size={14} className="shrink-0 opacity-50" />
              <span className="font-medium">Dilaporkan: {date}</span>
            </div>
          </div>

          <Link
            href={`/dashboard/complaint/${complaint.id}`}
            className="w-full flex items-center justify-center gap-2 bg-brand-ink text-brand-canvas dark:bg-brand-primary dark:text-[#0e0f0c] font-bold py-3 px-6 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Lihat Detail Lengkap
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
