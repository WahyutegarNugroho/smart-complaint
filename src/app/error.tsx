'use client'

import { useEffect } from 'react'
import ErrorPageShell from '@/components/ErrorPageShell'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Segment Error:', error)
  }, [error])

  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 500"
      statusLabel="Kendala Server"
      kicker="Gangguan Pemrosesan"
      title="Halaman Mengalami Masalah"
      description="Terjadi kendala saat memuat halaman ini. Data laporan Anda tetap aman tersimpan di sistem."
      guidance="Coba muat ulang halaman ini. Jika kendala terus berulang, catat kode referensi masalah di bawah untuk disampaikan ke pengurus."
      referenceId={error.digest}
      tone="rose"
      icon="server-error"
      onRetry={() => reset()}
      actions={[
        { label: 'Coba Muat Ulang', kind: 'retry', icon: 'reload', tone: 'primary' },
        { label: 'Kembali ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}
