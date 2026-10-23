'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

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
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex items-center justify-center p-4 sm:p-6">
        <main className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Gangguan Sistem Kritis
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Terjadi Kesalahan Aplikasi
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aplikasi mengalami kendala tak terduga pada tingkat sistem. Silakan coba muat ulang atau kembali ke halaman beranda.
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-slate-500 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 mt-2 inline-block">
                Kode Referensi: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="min-h-[44px] flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Muat Ulang
            </button>
            <Link
              href="/"
              className="min-h-[44px] flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Home size={15} aria-hidden="true" />
              Beranda
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
