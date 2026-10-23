'use client'

import { Printer } from 'lucide-react'

export default function ExportActions() {
  return (
    <button 
      onClick={() => window.print()}
      className="min-h-[44px] flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <Printer size={16} aria-hidden="true" />
      Cetak PDF
    </button>
  )
}
