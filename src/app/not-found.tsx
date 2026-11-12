import ErrorPageShell from '@/components/ErrorPageShell'

export default function NotFound() {
  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 404"
      statusLabel="Halaman Tidak Ditemukan"
      kicker="Navigasi Portal"
      title="Halaman Tidak Tersedia"
      description="Alamat halaman yang Anda tuju tidak ditemukan, telah dipindahkan, atau tautan yang dibuka sudah tidak berlaku."
      guidance="Periksa kembali penulisan alamat URL atau gunakan tombol di bawah untuk kembali ke halaman utama Portal Pengaduan Pesona Serpong."
      tone="blue"
      icon="not-found"
      actions={[
        { label: 'Kembali ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'primary' },
        { label: 'Masuk ke Portal', kind: 'link', href: '/login', icon: 'login', tone: 'secondary' },
      ]}
    />
  )
}
