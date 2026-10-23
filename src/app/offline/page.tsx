import type { Metadata } from 'next'
import Link from 'next/link'
import { WifiOff, RotateCcw, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offline - Smart Complaint',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 mx-auto">
          <WifiOff size={28} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Status Jaringan
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Perangkat Sedang Offline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Perangkat Anda sedang tidak terhubung ke jaringan internet. Silakan periksa koneksi data seluler atau Wi-Fi untuk melanjutkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="min-h-[44px] flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Coba Sambungkan
          </Link>
          <Link
            href="/"
            className="min-h-[44px] flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Home size={15} aria-hidden="true" />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
