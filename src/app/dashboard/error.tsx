'use client'

import { useEffect } from 'react'
import ErrorPageShell from '@/components/ErrorPageShell'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 500"
      statusLabel="Kendala Dashboard"
      kicker="Sistem Pengelolaan Aduan"
      title="Terjadi Kesalahan Pemuatan"
      description="Sistem mengalami kendala saat memuat halaman dashboard Anda. Sesi dan data laporan Anda tetap tersimpan aman."
      guidance="Tekan tombol Coba Lagi untuk memuat ulang segmen ini atau kembali ke beranda dashboard."
      referenceId={error.digest}
      tone="rose"
      icon="server-error"
      onRetry={() => reset()}
      actions={[
        { label: 'Coba Lagi', kind: 'retry', icon: 'reload', tone: 'primary' },
        { label: 'Beranda Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'secondary' },
      ]}
    />
  )
}
