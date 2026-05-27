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
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10 animate-bounce">
            <AlertCircle size={48} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Oops! Terjadi Kesalahan</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            &quot;Kami mengalami kendala saat memuat data dashboard Anda.&quot;
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={reset}
            className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-normal shadow-xl shadow-slate-900/10 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <RotateCcw size={18} /> Coba Lagi
          </button>
          <Link
            href="/"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-normal hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Home size={18} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
