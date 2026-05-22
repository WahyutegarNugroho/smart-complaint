'use client'

import { Download, FileText, FileBarChart } from 'lucide-react'

export function ExportButtons() {
  const handlePrint = () => {
    window.print()
  }

  const handleExcel = () => {
    window.location.href = '/api/admin/export/complaints'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Excel Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mb-8 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
          <FileBarChart size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Format Spreadsheet</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors">Ekspor data mentah untuk pengolahan lebih lanjut di Microsoft Excel atau Google Sheets.</p>
        
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">
            Semua laporan (data mentah)
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
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Laporan Siap Cetak</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors">Dokumen PDF rapi dengan ringkasan visual untuk bahan presentasi rapat warga.</p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-5 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
            Semua laporan (siap cetak)
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
