'use client'

import { Download, FileText, FileBarChart, ChevronDown } from 'lucide-react'

export function ExportButtons() {
  const handlePrint = () => {
    window.print()
  }

  const handleExcel = () => {
    alert('Mengunduh data dalam format CSV/Excel...')
    // In a real app, this would trigger a download from an API route
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Excel Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mb-8 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
          <FileBarChart size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors italic">Format Spreadsheet</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors italic">Ekspor data mentah untuk pengolahan lebih lanjut di Microsoft Excel atau Google Sheets.</p>
        
        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2.5 block ml-1">Periode Laporan</label>
            <div className="relative">
               <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all">
                 <option>Mei 2026</option>
                 <option>April 2026</option>
                 <option>Maret 2026</option>
               </select>
               <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={handleExcel} 
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3"
          >
            <Download size={18} /> Unduh CSV / Excel
          </button>
        </div>
      </div>

      {/* PDF Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <FileText size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors italic">Laporan Siap Cetak</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors italic">Dokumen PDF rapi dengan ringkasan visual untuk bahan presentasi rapat warga.</p>
        
        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2.5 block ml-1">Filter Kategori</label>
            <div className="relative">
               <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all">
                 <option>Semua Status Laporan</option>
                 <option>Laporan Selesai Saja</option>
                 <option>Laporan Darurat Saja</option>
               </select>
               <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button 
            onClick={handlePrint} 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-3"
          >
            <FileText size={18} /> Cetak Dokumen PDF
          </button>
        </div>
      </div>
    </div>
  )
}
