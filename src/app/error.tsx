'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Segment Error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-center">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 flex items-center justify-center">
            <AlertCircle size={28} aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Kendala Pemuatan Halaman
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Halaman Mengalami Masalah
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Terjadi kendala saat memuat konten pada halaman ini. Anda dapat mencoba memuat ulang atau kembali ke halaman utama.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 mt-2 inline-block">
              ID Masalah: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="min-h-[44px] flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="min-h-[44px] flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Home size={15} aria-hidden="true" />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
