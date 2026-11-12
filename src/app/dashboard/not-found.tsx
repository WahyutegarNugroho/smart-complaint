import ErrorPageShell from '@/components/ErrorPageShell'

export default function DashboardNotFound() {
  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 404"
      statusLabel="Data Tidak Ditemukan"
      kicker="Navigasi Dashboard"
      title="Halaman atau Laporan Tidak Tersedia"
      description="Entri atau halaman dashboard yang Anda tuju tidak ditemukan, telah dihapus, atau tautan yang dibuka sudah tidak berlaku."
      guidance="Kembali ke beranda dashboard untuk melihat daftar pengaduan aktif Anda."
      tone="blue"
      icon="not-found"
      actions={[
        { label: 'Kembali ke Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'primary' },
        { label: 'Ke Halaman Utama', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}
