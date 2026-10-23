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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
      {/* CSV Export */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shrink-0">
            <FileText size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ekspor Format CSV</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data mentah yang kompatibel dengan Microsoft Excel dan aplikasi lembar kerja lainnya.
            </p>
          </div>
        </div>
        <button 
          onClick={handleCsv} 
          className="min-h-[44px] w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Download size={15} aria-hidden="true" /> Unduh CSV
        </button>
      </div>

      {/* Excel Export */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shrink-0">
            <FileSpreadsheet size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ekspor Excel (.xlsx)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Format lembar kerja terstruktur dengan dua sheet (rekapitulasi data dan ringkasan metrik).
            </p>
          </div>
        </div>
        <button 
          onClick={handleExcel} 
          className="min-h-[44px] w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Download size={15} aria-hidden="true" /> Unduh Excel
        </button>
      </div>

      {/* PDF Export */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 shrink-0">
            <FileBarChart size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dokumen PDF Terformat</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dokumen siap cetak dengan sampul resmi, ringkasan eksekutif, dan tabel detail.
            </p>
            <button 
              onClick={handlePrint} 
              className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              Atau cetak langsung melalui browser
            </button>
          </div>
        </div>
        <button 
          onClick={handlePdf} 
          className="min-h-[44px] w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <FileBarChart size={15} aria-hidden="true" /> Unduh PDF
        </button>
      </div>
    </div>
  )
}

