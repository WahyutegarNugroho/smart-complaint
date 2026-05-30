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
       <div className="bg-brand-canvas border border-brand-hairline rounded-3xl p-5 shadow-xl shadow-brand-ink/5 dark:shadow-black/40 flex items-center gap-5 relative overflow-hidden">
           <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center text-[#0e0f0c] shrink-0 shadow-xl shadow-brand-primary/20 rotate-3">
              <CheckCircle2 size={24} />
           </div>
           <div className="flex-1 min-w-0 pt-1">
              <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal mb-1">Sistem Berhasil</p>
              <p className="text-sm font-bold text-brand-ink truncate tracking-tight">{message}</p>
           </div>
           <button 
             onClick={() => setIsVisible(false)}
             aria-label="Tutup notifikasi"
             className="h-10 w-10 rounded-xl hover:bg-brand-canvas-soft flex items-center justify-center text-brand-ink/30 hover:text-brand-ink transition-all active:scale-90"
           >
              <X size={18} />
           </button>
           
           {/* Progress Bar */}
           <div className="absolute bottom-0 left-0 h-1 bg-brand-hairline w-full">
              <div className="h-full bg-brand-primary animate-shrink-width" style={{ animationDuration: '5000ms' }} />
          </div>
       </div>
    </div>
  )
}

