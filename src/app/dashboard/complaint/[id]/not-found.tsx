import ErrorPageShell from '@/components/ErrorPageShell'

export default function ComplaintNotFound() {
  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 404"
      statusLabel="Laporan Tidak Ditemukan"
      kicker="Detail Laporan Warga"
      title="Laporan Tidak Tersedia"
      description="Laporan dengan kode tersebut tidak ditemukan di basis data atau telah dibatalkan dan dihapus oleh pelapor maupun admin."
      guidance="Periksa daftar riwayat aduan Anda di dashboard atau buat laporan baru bila kendala lingkungan masih berlangsung."
      tone="amber"
      icon="not-found"
      actions={[
        { label: 'Daftar Pengaduan', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'primary' },
        { label: 'Buat Laporan Baru', kind: 'link', href: '/dashboard/create', icon: 'plus', tone: 'emerald' },
      ]}
    />
  )
}

