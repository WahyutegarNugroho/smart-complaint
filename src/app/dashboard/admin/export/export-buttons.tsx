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
    <div className="bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm divide-y divide-brand-hairline">
      {/* CSV Export */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-10 w-10 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/60 border border-brand-hairline shrink-0">
          <FileText size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-brand-ink">CSV</h2>
          <p className="text-xs text-brand-ink/50 mt-0.5">Data mentah — kompatibel dengan Excel / Spreadsheet apapun.</p>
        </div>
        <button 
          onClick={handleCsv} 
          className="w-full sm:w-auto bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={15} /> Unduh CSV
        </button>
      </div>

      {/* Excel Export */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-10 w-10 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-positive border border-brand-hairline shrink-0">
          <FileSpreadsheet size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-brand-ink">Excel (.xlsx)</h2>
          <p className="text-xs text-brand-ink/50 mt-0.5">Format Excel dengan 2 sheet (data + ringkasan).</p>
        </div>
        <button 
          onClick={handleExcel} 
          className="w-full sm:w-auto bg-positive text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={15} /> Unduh Excel
        </button>
      </div>

      {/* PDF Export */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-10 w-10 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary border border-brand-hairline shrink-0">
          <FileBarChart size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-brand-ink">PDF (Server)</h2>
          <p className="text-xs text-brand-ink/50 mt-0.5">Dokumen PDF terformat dengan cover, ringkasan, dan tabel detail.</p>
          <button 
            onClick={handlePrint} 
            className="mt-1 text-xs font-medium text-brand-ink/50 underline hover:text-brand-ink/70 transition-colors cursor-pointer"
          >
            Atau cetak via browser
          </button>
        </div>
        <button 
          onClick={handlePdf} 
          className="w-full sm:w-auto bg-brand-primary text-brand-ink px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileBarChart size={15} /> Unduh PDF
        </button>
      </div>
    </div>
  )
}

