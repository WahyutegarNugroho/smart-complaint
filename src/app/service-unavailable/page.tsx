import type { Metadata } from 'next'
import ErrorPageShell from '@/components/ErrorPageShell'

export const metadata: Metadata = {
  title: 'Layanan Terganggu - Smart Complaint',
}

export default function ServiceUnavailablePage() {
  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 503"
      statusLabel="Layanan Sibuk"
      kicker="Koneksi Basis Data"
      title="Layanan Sedang Tidak Tersedia"
      description="Server basis data sedang mengalami gangguan sementara atau antrean beban tinggi. Data pengaduan warga tetap aman."
      guidance="Tunggu beberapa saat lalu muat ulang halaman. Untuk laporan bersifat darurat, hubungi Hotline Pos Keamanan melalui tautan bantuan di bawah."
      tone="amber"
      icon="unavailable"
      actions={[
        { label: 'Muat Ulang Halaman', kind: 'reload', icon: 'reload', tone: 'primary' },
        { label: 'Ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}

