'use client'

import { Download, FileText, FileBarChart, FileSpreadsheet } from 'lucide-react'

export function ExportButtons() {
  const handlePrint = () => {
    const originalTitle = document.title
    document.title = ''
    window.onafterprint = () => { document.title = originalTitle; window.onafterprint = null }
    window.print()
  }

  const handleCsv = () => {
    window.location.href = '/api/admin/export/complaints'
  }

  const handleExcel = () => {
    window.location.href = '/api/admin/export/complaints/xlsx'
  }

  const handlePdf = () => {
    window.location.href = '/api/admin/export/complaints/pdf'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* CSV Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 mb-8 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white">
          <FileText size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">CSV</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors">Data mentah dalam format CSV — kompatibel dengan Excel/Spreadsheet apapun.</p>
        <button 
          onClick={handleCsv} 
          className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-normal hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <Download size={18} /> Unduh CSV
        </button>
      </div>

      {/* Excel Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 mb-8 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
          <FileSpreadsheet size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Excel (.xlsx)</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors">Format Excel dengan 2 sheet (data + ringkasan), lebih rapi dan terstruktur.</p>
        <button 
          onClick={handleExcel} 
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-normal hover:opacity-90 transition-all shadow-xl shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <Download size={18} /> Unduh Excel
        </button>
      </div>

      {/* PDF Export */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <FileBarChart size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">PDF (Server)</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10 leading-relaxed transition-colors">Dokumen PDF terformat dengan cover, ringkasan, dan tabel detail — generated server-side.</p>
        <button 
          onClick={handlePdf} 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-normal hover:opacity-90 transition-all shadow-xl shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <FileBarChart size={18} /> Unduh PDF
        </button>
        <div className="mt-4 text-center">
          <button 
            onClick={handlePrint} 
            className="text-[10px] font-bold text-slate-400 dark:text-slate-500 underline hover:text-slate-700 dark:hover:text-slate-300 transition-all"
          >
            Atau cetak via browser (browser print)
          </button>
        </div>
      </div>
    </div>
  )
}
