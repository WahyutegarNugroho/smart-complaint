'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface SessionErrorStateProps {
  error?: string
}

export default function SessionErrorState({ error }: SessionErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-canvas-soft p-6 text-brand-ink relative">
      {/* 🌓 Theme switcher accessibility on error pages */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="bg-brand-canvas p-6 rounded-xl border border-brand-hairline shadow-sm max-w-md w-full space-y-5 relative z-10" role="alert">
         <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-500">
            <AlertTriangle size={24} />
         </div>
         <div className="space-y-1.5">
            <h2 className="text-base font-bold">Koneksi Terputus</h2>
            <p className="text-sm text-brand-ink/60 leading-relaxed font-medium">
              Kami kesulitan memvalidasi profil Anda saat ini karena beban server yang tinggi. 
              Sesi Anda <strong>tetap aktif</strong>, silakan muat ulang halaman.
            </p>
         </div>

         {error && (
           <div className="text-left bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg space-y-1.5">
             <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Detail Error (Debug):</p>
             <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">{error}</p>
           </div>
         )}

         <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3 rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
         >
            <RefreshCw size={16} />
            Coba Muat Ulang
         </button>
      </div>
    </div>
  )
}

