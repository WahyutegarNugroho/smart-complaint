import Link from 'next/link'
import { FileSearch, ArrowLeft } from 'lucide-react'

export default function DashboardNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-center">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 flex items-center justify-center">
            <FileSearch size={32} aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Data Tidak Ditemukan
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Laporan Tidak Tersedia
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Laporan atau entri yang Anda tuju tidak ditemukan, telah dihapus dari sistem, atau ID laporan yang dimasukkan tidak valid.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="min-h-[44px] w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
