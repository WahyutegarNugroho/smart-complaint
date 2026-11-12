import type { Metadata } from 'next'
import ErrorPageShell from '@/components/ErrorPageShell'

export const metadata: Metadata = {
  title: 'Offline - Smart Complaint',
}

export default function OfflinePage() {
  return (
    <ErrorPageShell
      variant="public"
      statusCode="OFFLINE"
      statusLabel="Jaringan Terputus"
      kicker="Status Sambungan"
      title="Perangkat Sedang Offline"
      description="Perangkat Anda tidak terhubung ke internet sehingga pembaruan data dan pengiriman laporan belum dapat diproses."
      guidance="Periksa koneksi Wi-Fi atau data seluler Anda, lalu tekan tombol Coba Sambungkan untuk memuat ulang halaman."
      tone="slate"
      icon="offline"
      actions={[
        { label: 'Coba Sambungkan', kind: 'reload', icon: 'reload', tone: 'primary' },
        { label: 'Ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}
