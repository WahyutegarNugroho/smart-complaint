'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Download,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react'

type ExportFormat = 'csv' | 'xlsx' | 'pdf'

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback
  const match = /filename="?([^";\n]+)"?/i.exec(contentDisposition)
  return match?.[1] ? match[1].trim() : fallback
}

export function ExportButtons() {
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const handlePrint = () => {
    const originalTitle = document.title
    document.title = ''
    window.onafterprint = () => { document.title = originalTitle; window.onafterprint = null }
    window.print()
  }

  const downloadExport = async (
    url: string,
    format: ExportFormat,
    fallbackFilename: string
  ) => {
    if (loadingFormat) return
    setLoadingFormat(format)
    setExportError(null)
    setIsRateLimited(false)

    try {
      const res = await fetch(url)
      if (!res.ok) {
        const body = await res.json().catch(() => null) as {
          error?: string | { message?: string }
          message?: string
        } | null
        const serverMsg =
          typeof body?.error === 'object' && body.error !== null
            ? body.error.message
            : body?.message || (typeof body?.error === 'string' ? body.error : undefined)

        if (res.status === 429) {
          setIsRateLimited(true)
          setExportError(
            'Terlalu banyak permintaan ekspor dalam waktu singkat. Tunggu beberapa saat sebelum mengunduh ulang.'
          )
        } else if (res.status === 401) {
          setExportError('Sesi Anda telah berakhir. Silakan login kembali untuk mengunduh laporan.')
        } else if (res.status === 403) {
          setExportError('Anda tidak memiliki hak akses Admin untuk mengekspor laporan.')
        } else {
          setExportError(
            serverMsg || 'Gagal mengunduh dokumen ekspor. Silakan coba kembali beberapa saat lagi.'
          )
        }
        return
      }

      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = parseFilename(
        res.headers.get('content-disposition'),
        fallbackFilename
      )
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      setExportError(
        'Koneksi terganggu saat mengunduh dokumen. Periksa jaringan internet Anda lalu coba lagi.'
      )
    } finally {
      setLoadingFormat(null)
    }
  }

  const dateSuffix = new Date().toISOString().split('T')[0]
  const handleCsv = () =>
    downloadExport('/api/admin/export/complaints', 'csv', `laporan-smart-complaint-${dateSuffix}.csv`)
  const handleExcel = () =>
    downloadExport('/api/admin/export/complaints/xlsx', 'xlsx', `laporan-smart-complaint-${dateSuffix}.xlsx`)
  const handlePdf = () =>
    downloadExport('/api/admin/export/complaints/pdf', 'pdf', `laporan-smart-complaint-${dateSuffix}.pdf`)

  const isBusy = loadingFormat !== null

  return (
    <div className="space-y-4">
      {exportError && (
        <div
          role="alert"
          className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 dark:text-rose-200 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <AlertCircle aria-hidden="true" size={18} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold">Ekspor Gagal Dijalankan</p>
              <p className="font-medium leading-relaxed">{exportError}</p>
            </div>
          </div>
          {isRateLimited && (
            <Link
              href="/too-many-requests"
              className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Info Batas Akses
            </Link>
          )}
        </div>
      )}

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
            type="button"
            disabled={isBusy}
            aria-busy={loadingFormat === 'csv'}
            onClick={handleCsv}
            className="min-h-[44px] w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingFormat === 'csv' ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Download size={15} aria-hidden="true" />
            )}
            {loadingFormat === 'csv' ? 'Mengunduh...' : 'Unduh CSV'}
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
            type="button"
            disabled={isBusy}
            aria-busy={loadingFormat === 'xlsx'}
            onClick={handleExcel}
            className="min-h-[44px] w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingFormat === 'xlsx' ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Download size={15} aria-hidden="true" />
            )}
            {loadingFormat === 'xlsx' ? 'Mengunduh...' : 'Unduh Excel'}
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
                type="button"
                onClick={handlePrint}
                className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Atau cetak langsung melalui browser
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={isBusy}
            aria-busy={loadingFormat === 'pdf'}
            onClick={handlePdf}
            className="min-h-[44px] w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingFormat === 'pdf' ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileBarChart size={15} aria-hidden="true" />
            )}
            {loadingFormat === 'pdf' ? 'Menyiapkan PDF...' : 'Unduh PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

