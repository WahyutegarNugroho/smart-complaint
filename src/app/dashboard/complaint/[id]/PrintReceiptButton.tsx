'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export default function PrintReceiptButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print btn-secondary py-3 sm:py-4 px-6 sm:px-8 text-[10px] sm:text-[11px] tracking-normal uppercase shadow-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer font-bold"
    >
      <Printer size={16} /> Cetak Tanda Terima
    </button>
  )
}
