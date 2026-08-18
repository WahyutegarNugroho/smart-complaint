import type { Metadata } from 'next'
import Link from 'next/link'
import { WifiOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offline | Smart Complaint',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex items-center justify-center p-6 font-sans">
      <div className="text-center max-w-sm space-y-4">
        <div className="h-12 w-12 rounded-lg bg-brand-panel text-brand-primary flex items-center justify-center mx-auto">
          <WifiOff size={24} />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Koneksi Terputus</h1>
          <p className="text-xs text-brand-ink/60 leading-relaxed">
            Perangkat Anda sedang tidak terhubung ke internet. Periksa koneksi data atau Wi-Fi untuk melanjutkan.
          </p>
        </div>
        <Link 
          href="/" 
          className="btn-primary inline-block py-2.5 px-6 text-xs uppercase tracking-wider"
        >
          Muat Ulang
        </Link>
      </div>
    </div>
  )
}
