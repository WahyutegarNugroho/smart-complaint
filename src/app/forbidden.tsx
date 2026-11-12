import ErrorPageShell from '@/components/ErrorPageShell'

export default function ForbiddenPage() {
  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 403"
      statusLabel="Akses Ditolak"
      kicker="Keamanan & Privasi Warga"
      title="Anda Tidak Memiliki Hak Akses"
      description="Halaman atau data yang Anda minta dibatasi hanya untuk pihak yang berwenang atau pemilik laporan."
      guidance="Jika Anda merasa seharusnya memiliki akses, pastikan Anda masuk menggunakan akun yang tepat atau hubungi pengurus RT/RW."
      tone="rose"
      icon="forbidden"
      actions={[
        { label: 'Kembali ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'primary' },
        { label: 'Masuk Akun Lain', kind: 'link', href: '/login', icon: 'login', tone: 'secondary' },
      ]}
    />
  )
}

