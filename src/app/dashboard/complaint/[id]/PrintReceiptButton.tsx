'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export default function PrintReceiptButton() {
  return (
    <button
      onClick={() => window.print()}
      aria-label="Cetak tanda terima bukti laporan"
      className="no-print min-h-[44px] px-4 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <Printer size={16} /> Cetak Tanda Terima
    </button>
  )
}
