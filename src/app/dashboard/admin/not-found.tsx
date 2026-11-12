import ErrorPageShell from '@/components/ErrorPageShell'

export default function AdminNotFound() {
  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 404"
      statusLabel="Entri Tidak Ditemukan"
      kicker="Administrasi RW 08"
      title="Halaman Administrasi Tidak Tersedia"
      description="Halaman atau data administrasi yang Anda tuju tidak ditemukan atau sudah dihapus dari sistem."
      guidance="Kembali ke dashboard utama atau buka daftar penduduk untuk melanjutkan pengelolaan."
      tone="blue"
      icon="not-found"
      actions={[
        { label: 'Beranda Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'primary' },
        { label: 'Data Penduduk', kind: 'link', href: '/dashboard/admin/users', icon: 'back', tone: 'secondary' },
      ]}
    />
  )
}

