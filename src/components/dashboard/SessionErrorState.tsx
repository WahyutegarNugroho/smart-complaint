'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface SessionErrorStateProps {
  error?: string
}

export default function SessionErrorState({ error }: SessionErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 text-slate-900 dark:text-slate-100 relative transition-colors">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-md w-full space-y-6 text-center relative z-10" role="alert">
        <div className="h-14 w-14 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Validasi Sesi Pengguna
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Koneksi Profil Terhambat
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Sistem mengalami kendala saat memvalidasi profil akun Anda karena beban antrean server. Sesi akun Anda tetap aman, silakan muat ulang halaman.
          </p>
        </div>

        {error && (
          <div className="text-left bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-xl space-y-1">
            <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Keterangan Teknis:</p>
            <p className="text-xs font-mono text-rose-700 dark:text-rose-300 break-all">{error}</p>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()} 
          className="min-h-[44px] w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-xs hover:opacity-95 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Coba Muat Ulang Halaman
        </button>
      </div>
    </div>
  )
}
