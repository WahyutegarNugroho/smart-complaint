'use client'

import { useEffect } from 'react'
import ErrorPageShell from '@/components/ErrorPageShell'

export default function ComplaintDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Complaint Detail Error:', error)
  }, [error])

  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 500"
      statusLabel="Gagal Memuat Laporan"
      kicker="Detail Laporan Warga"
      title="Rincian Laporan Gagal Dimuat"
      description="Terjadi kendala saat mengambil rincian laporan atau linimasa tanggapan dari server."
      guidance="Silakan coba muat ulang halaman ini atau kembali ke daftar pengaduan."
      referenceId={error.digest}
      tone="rose"
      icon="server-error"
      onRetry={() => reset()}
      actions={[
        { label: 'Muat Ulang Rincian', kind: 'retry', icon: 'reload', tone: 'primary' },
        { label: 'Daftar Pengaduan', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'secondary' },
      ]}
    />
  )
}

