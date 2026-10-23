'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { WifiOff, X } from 'lucide-react'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return typeof navigator !== 'undefined' ? !navigator.onLine : false
}

function getServerSnapshot() {
  return false
}

export default function NetworkStatusBanner() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [dismissed, setDismissed] = useState(false)

  if (!isOffline || dismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[200] max-w-md animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-amber-600 dark:bg-amber-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-500/50">
        <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <WifiOff size={18} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight">Koneksi Internet Terputus</p>
          <p className="text-[11px] text-amber-100 mt-0.5 leading-snug">
            Pengiriman formulir atau pembaruan status mungkin tertunda hingga sambungan pulih.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Tutup pemberitahuan koneksi"
          className="h-8 w-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white/80 hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
