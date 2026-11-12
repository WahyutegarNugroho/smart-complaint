'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface SectionErrorFallbackProps {
  title?: string
  message?: string
}

export default function SectionErrorFallback({
  title = 'Gagal Memuat Data',
  message = 'Koneksi ke basis data sedang terganggu sehingga data bagian ini tidak dapat ditampilkan saat ini.',
}: SectionErrorFallbackProps) {
  const router = useRouter()

  return (
    <div
      role="alert"
      className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.refresh()}
        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <RotateCcw size={14} aria-hidden="true" />
        <span>Muat Ulang Data</span>
      </button>
    </div>
  )
}

