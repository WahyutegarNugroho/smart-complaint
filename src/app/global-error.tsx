'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, Megaphone, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col">
        <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-800 text-white">
              <Megaphone size={17} aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Portal Pengaduan
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                Warga Pesona Serpong
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <section
            role="alert"
            aria-labelledby="global-error-title"
            className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 overflow-hidden text-left"
          >
            <div className="h-1.5 w-full bg-rose-600" />
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                STATUS LAYANAN: HTTP 500
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Gangguan Sistem Kritis
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                  <AlertTriangle size={28} aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider block">
                    Pemulihan Sistem
                  </span>
                  <h1 id="global-error-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Terjadi Kesalahan Aplikasi
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Aplikasi mengalami kendala tak terduga saat memuat tata letak utama. Muat ulang halaman atau kembali ke beranda.
                  </p>
                </div>
              </div>

              {error.digest && (
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Kode Referensi</span>
                  <code className="text-xs font-mono font-bold text-slate-900 dark:text-white">{error.digest}</code>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="min-h-[44px] flex-1 bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  <span>Muat Ulang</span>
                </button>
                <Link
                  href="/"
                  className="min-h-[44px] flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Home size={16} aria-hidden="true" />
                  <span>Beranda</span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
