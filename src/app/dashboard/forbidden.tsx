import ErrorPageShell from '@/components/ErrorPageShell'

export default function DashboardForbidden() {
  return (
    <ErrorPageShell
      variant="dashboard"
      statusCode="HTTP 403"
      statusLabel="Akses Terbatas"
      kicker="Kontrol Hak Akses"
      title="Akses Halaman Ditolak"
      description="Anda tidak memiliki izin untuk membuka halaman atau data pengaduan ini karena keterbatasan peran akun maupun kepemilikan laporan."
      guidance="Warga hanya dapat membuka rincian laporan milik sendiri, sedangkan modul administrasi hanya tersedia bagi pengurus Admin."
      tone="rose"
      icon="forbidden"
      actions={[
        { label: 'Kembali ke Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard', tone: 'primary' },
        { label: 'Halaman Sebelumnya', kind: 'back', fallbackHref: '/dashboard', icon: 'back', tone: 'secondary' },
      ]}
    />
  )
}

