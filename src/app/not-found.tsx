import Link from 'next/link'
import { FileQuestion, Home, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-center">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 flex items-center justify-center">
            <FileQuestion size={32} aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Kesalahan 404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Alamat web yang Anda tuju tidak tersedia, telah dipindahkan, atau tautan yang digunakan sudah kedaluwarsa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="min-h-[44px] flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Home size={15} aria-hidden="true" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/bantuan/panduan"
            className="min-h-[44px] flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <HelpCircle size={15} aria-hidden="true" />
            Panduan Warga
          </Link>
        </div>
      </div>
    </div>
  )
}
