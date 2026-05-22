'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface SuccessToastProps {
  message: string
}

export default function SuccessToast({ message }: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible || !message) return null

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-10 duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
       <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-5 relative overflow-hidden">
          <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-emerald-500/20 rotate-3">
             <CheckCircle2 size={24} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">Sistem Berhasil</p>
             <p className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">{message}</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            aria-label="Tutup notifikasi"
            className="h-10 w-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
          >
             <X size={18} />
          </button>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-slate-50 dark:bg-slate-800/50 w-full">
             <div className="h-full bg-emerald-500 animate-shrink-width" style={{ animationDuration: '5000ms' }} />
          </div>
       </div>
    </div>
  )
}
