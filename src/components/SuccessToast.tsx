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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-6 duration-300">
       <div className="bg-brand-canvas border border-brand-hairline rounded-xl p-4 shadow-lg flex items-center gap-3 relative overflow-hidden">
           <div className="h-9 w-9 bg-brand-primary text-[#0e0f0c] rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-ink truncate">{message}</p>
           </div>
           <button 
             onClick={() => setIsVisible(false)}
             aria-label="Tutup notifikasi berhasil"
             className="h-8 w-8 rounded-lg hover:bg-brand-canvas-soft flex items-center justify-center text-brand-ink/50 hover:text-brand-ink transition-colors"
           >
              <X size={16} />
           </button>
           
           {/* Progress Bar */}
           <div className="absolute bottom-0 left-0 h-0.5 bg-brand-hairline w-full">
              <div className="h-full bg-brand-primary animate-shrink-width" style={{ animationDuration: '5000ms' }} />
          </div>
       </div>
    </div>
  )
}

