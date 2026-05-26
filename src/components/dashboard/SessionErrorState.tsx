'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface SessionErrorStateProps {
  error?: string
}

export default function SessionErrorState({ error }: SessionErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-canvas-soft p-6 text-brand-ink relative overflow-hidden">
      {/* 🌓 Theme switcher accessibility on error pages */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="bg-brand-canvas p-8 rounded-[2rem] border border-brand-hairline shadow-xl max-w-md w-full text-center space-y-6 relative z-10">
         <div className="h-20 w-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-500 mx-auto">
            <AlertTriangle size={40} />
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-bold">Koneksi Terputus</h2>
            <p className="text-sm text-brand-ink/60 leading-relaxed font-medium">
              Kami kesulitan memvalidasi profil Anda saat ini karena beban server yang tinggi. 
              Sesi Anda <strong>tetap aktif</strong>, silakan muat ulang halaman.
            </p>
         </div>

         {error && (
           <div className="text-left bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-2">
             <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Detail Error (Debug):</p>
             <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">{error}</p>
           </div>
         )}

         <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
         >
            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            Coba Muat Ulang
         </button>
      </div>
    </div>
  )
}
