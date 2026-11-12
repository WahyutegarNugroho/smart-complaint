import ErrorPageShell from '@/components/ErrorPageShell'

export default function UnauthorizedPage() {
  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 401"
      statusLabel="Sesi Diperlukan"
      kicker="Autentikasi Akun"
      title="Silakan Masuk Terlebih Dahulu"
      description="Sesi akun Anda belum aktif atau telah berakhir demi keamanan data pengaduan warga."
      guidance="Masuk kembali menggunakan email dan kata sandi terdaftar untuk melanjutkan pengelolaan laporan."
      tone="amber"
      icon="unauthorized"
      actions={[
        { label: 'Masuk ke Akun', kind: 'link', href: '/login', icon: 'login', tone: 'primary' },
        { label: 'Kembali ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}

