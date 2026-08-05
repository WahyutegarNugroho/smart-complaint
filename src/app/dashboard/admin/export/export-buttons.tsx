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
      <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-ink/50 border border-brand-hairline mb-8 transition-colors group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-[#0e0f0c]">
          <FileText size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-ink mb-2 transition-colors">CSV</h2>
        <p className="text-sm text-brand-ink/50 font-medium mb-10 leading-relaxed transition-colors">Data mentah dalam format CSV — kompatibel dengan Excel/Spreadsheet apapun.</p>
        <button 
          onClick={handleCsv} 
          className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:opacity-90 transition-all shadow-lg shadow-brand-ink/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <Download size={18} /> Unduh CSV
        </button>
      </div>

      {/* Excel Export */}
      <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-positive border border-brand-hairline mb-8 transition-colors group-hover:bg-positive group-hover:text-white">
          <FileSpreadsheet size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-ink mb-2 transition-colors">Excel (.xlsx)</h2>
        <p className="text-sm text-brand-ink/50 font-medium mb-10 leading-relaxed transition-colors">Format Excel dengan 2 sheet (data + ringkasan), lebih rapi dan terstruktur.</p>
        <button 
          onClick={handleExcel} 
          className="w-full bg-positive text-white py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:opacity-90 transition-all shadow-lg shadow-positive/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <Download size={18} /> Unduh Excel
        </button>
      </div>

      {/* PDF Export */}
      <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline shadow-sm transition-all hover:shadow-xl group">
        <div className="h-14 w-14 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-primary border border-brand-hairline mb-8 transition-colors group-hover:bg-brand-primary group-hover:text-brand-ink">
          <FileBarChart size={28} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-ink mb-2 transition-colors">PDF (Server)</h2>
        <p className="text-sm text-brand-ink/50 font-medium mb-10 leading-relaxed transition-colors">Dokumen PDF terformat dengan cover, ringkasan, dan tabel detail — generated server-side.</p>
        <button 
          onClick={handlePdf} 
          className="w-full bg-brand-primary text-brand-ink py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:opacity-90 transition-all shadow-lg shadow-brand-primary/10 active:scale-95 flex items-center justify-center gap-3"
        >
          <FileBarChart size={18} /> Unduh PDF
        </button>
        <div className="mt-4 text-center">
          <button 
            onClick={handlePrint} 
            className="text-[10px] font-semibold text-brand-ink/50 underline hover:text-brand-ink/70 transition-all"
          >
            Atau cetak via browser (browser print)
          </button>
        </div>
      </div>
    </div>
  )
}

