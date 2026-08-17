'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-canvas flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-14 w-14 bg-negative/[0.08] rounded-xl flex items-center justify-center text-negative border border-negative/20">
            <AlertCircle size={28} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-brand-ink tracking-tight">Terjadi Kesalahan</h1>
          <p className="text-sm text-brand-ink/50 font-medium leading-relaxed">
            Kami mengalami kendala saat memuat data dashboard Anda.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-brand-ink/40 bg-brand-canvas-soft py-1.5 rounded-lg border border-brand-hairline">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={reset}
            className="flex-1 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3 rounded-lg font-semibold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} /> Coba Lagi
          </button>
          <Link
            href="/"
            className="flex-1 bg-brand-canvas border border-brand-hairline text-brand-ink/50 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:text-brand-ink transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
