'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export default function PrintReceiptButton() {
  return (
    <button
      onClick={() => window.print()}
      aria-label="Cetak tanda terima bukti laporan"
      className="no-print py-2.5 px-4 text-xs font-semibold rounded-lg bg-brand-canvas border border-brand-hairline text-brand-ink hover:bg-brand-canvas-soft transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <Printer size={15} /> Cetak Tanda Terima
    </button>
  )
}
