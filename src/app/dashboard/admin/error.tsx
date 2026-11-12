'use client'

import { useEffect } from 'react'
import ErrorPageShell from '@/components/ErrorPageShell'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Segment Error:', error)
  }, [error])

  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 500"
      statusLabel="Kendala Modul Admin"
      kicker="Administrasi RW 08"
      title="Modul Administrasi Mengalami Kendala"
      description="Terjadi kesalahan saat memproses data administrasi, statistik, atau log aktivitas."
      guidance="Coba muat ulang modul ini. Jika kendala berlanjut saat mengekspor atau mengelola data, catat kode referensi masalah di bawah."
      referenceId={error.digest}
      tone="rose"
      icon="server-error"
      onRetry={() => reset()}
      actions={[
        { label: 'Coba Muat Ulang', kind: 'retry', icon: 'reload', tone: 'primary' },
        { label: 'Beranda Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'secondary' },
      ]}
    />
  )
}

