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
    <aside aria-label="Pemberitahuan berhasil" className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-6 duration-300">
      <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 shadow-lg flex items-center gap-3 relative overflow-hidden">
        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">{message}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          aria-label="Tutup notifikasi berhasil"
          className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <X size={16} aria-hidden="true" />
        </button>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-emerald-100 dark:bg-emerald-950 w-full">
          <div className="h-full bg-emerald-500 dark:bg-emerald-400 animate-shrink-width" style={{ animationDuration: '5000ms' }} />
        </div>
      </div>
    </aside>
  )
}
