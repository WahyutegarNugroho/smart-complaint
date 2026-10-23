'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  system_error: 'Terjadi kendala sistem saat memproses data. Silakan coba kembali beberapa saat lagi.',
  not_found: 'Data atau laporan yang dituju tidak ditemukan dalam sistem.',
  forbidden: 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.',
  unauthorized: 'Sesi akun Anda telah berakhir. Silakan login kembali.',
  upload_failed: 'Gagal mengunggah berkas gambar. Silakan coba kembali.',
  invalid_type: 'Format berkas tidak didukung (gunakan JPG, PNG, WebP, atau GIF).',
  file_too_large: 'Ukuran berkas melebihi batas maksimal 5MB.',
}

interface ErrorToastProps {
  message: string
}

export default function ErrorToast({ message }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible || !message) return null

  const displayMessage = KNOWN_ERROR_MESSAGES[message] || message

  return (
    <aside aria-label="Pemberitahuan kesalahan" className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-6 duration-300">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 shadow-lg flex items-center gap-3 relative overflow-hidden">
        <div className="h-10 w-10 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={20} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">{displayMessage}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Tutup notifikasi kesalahan"
          className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-rose-100 dark:bg-rose-950 w-full">
          <div className="h-full bg-rose-500 dark:bg-rose-400 animate-shrink-width" style={{ animationDuration: '6000ms' }} />
        </div>
      </div>
    </aside>
  )
}
