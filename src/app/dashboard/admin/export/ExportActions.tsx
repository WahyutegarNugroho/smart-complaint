'use client'

import { Printer } from 'lucide-react'

export default function ExportActions() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
    >
      <Printer size={18} />
      Cetak PDF
    </button>
  )
}
