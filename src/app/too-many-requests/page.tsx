import type { Metadata } from 'next'
import ErrorPageShell from '@/components/ErrorPageShell'

export const metadata: Metadata = {
  title: 'Batas Permintaan - Smart Complaint',
}

export default async function TooManyRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ retryAfter?: string }>
}) {
  const { retryAfter } = await searchParams
  const seconds = retryAfter ? Number.parseInt(retryAfter, 10) : NaN
  const waitHint =
    Number.isFinite(seconds) && seconds > 0
      ? `Silakan tunggu sekitar ${seconds} detik sebelum mencoba permintaan berikutnya.`
      : 'Silakan tunggu beberapa saat sebelum mencoba permintaan berikutnya.'

  return (
    <ErrorPageShell
      variant="public"
      statusCode="HTTP 429"
      statusLabel="Batas Permintaan"
      kicker="Perlindungan Sistem"
      title="Terlalu Banyak Permintaan"
      description="Sistem membatasi sementara jumlah permintaan dari perangkat Anda untuk menjaga kestabilan layanan bagi seluruh warga."
      guidance={waitHint}
      tone="amber"
      icon="rate-limit"
      actions={[
        { label: 'Kembali', kind: 'back', fallbackHref: '/', icon: 'back', tone: 'primary' },
        { label: 'Ke Beranda', kind: 'link', href: '/', icon: 'home', tone: 'secondary' },
      ]}
    />
  )
}

