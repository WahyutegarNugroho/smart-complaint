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
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-negative/[0.08] rounded-3xl flex items-center justify-center text-negative shadow-lg shadow-negative/10 animate-bounce">
            <AlertCircle size={48} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-brand-ink tracking-tight">Oops! Terjadi Kesalahan</h1>
          <p className="text-brand-ink/50 font-medium leading-relaxed">
            &quot;Kami mengalami kendala saat memuat data dashboard Anda.&quot;
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-brand-ink/40 bg-brand-canvas-soft py-2 rounded-lg border border-brand-hairline">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={reset}
            className="flex-1 bg-brand-ink text-brand-canvas py-4 rounded-2xl font-bold text-xs uppercase tracking-normal shadow-lg shadow-brand-ink/10 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <RotateCcw size={18} /> Coba Lagi
          </button>
          <Link
            href="/"
            className="flex-1 bg-brand-canvas border border-brand-hairline text-brand-ink/50 py-4 rounded-2xl font-bold text-xs uppercase tracking-normal hover:text-brand-ink transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Home size={18} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
