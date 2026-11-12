'use client'

import React from 'react'
import ErrorPageShell from '@/components/ErrorPageShell'

interface SessionErrorStateProps {
  error?: string
}

export default function SessionErrorState({ error }: SessionErrorStateProps) {
  const showTechnicalDetail = process.env.NODE_ENV === 'development' && Boolean(error)

  return (
    <ErrorPageShell
      variant="public"
      showCivicLinks={false}
      statusCode="HTTP 503"
      statusLabel="Validasi Sesi Terganggu"
      kicker="Keamanan & Sesi Akun"
      title="Koneksi Profil Terhambat"
      description="Sistem mengalami kendala sementara saat memvalidasi profil akun Anda di basis data. Sesi masuk Anda tetap aman."
      guidance="Silakan muat ulang halaman ini untuk mencoba menyinkronkan profil kembali, atau keluar lalu masuk ulang bila kendala bertahan."
      technicalDetail={showTechnicalDetail ? error : undefined}
      tone="amber"
      icon="unavailable"
      actions={[
        { label: 'Muat Ulang Halaman', kind: 'reload', icon: 'reload', tone: 'primary' },
        { label: 'Masuk Ulang', kind: 'link', href: '/login', icon: 'login', tone: 'secondary' },
      ]}
    />
  )
}
