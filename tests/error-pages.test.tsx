import '@testing-library/jest-dom/vitest'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const { mockRefresh, mockBack } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
  mockBack: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    back: mockBack,
    push: vi.fn(),
  }),
}))

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

import ErrorPageShell from '@/components/ErrorPageShell'
import ErrorToast from '@/components/ErrorToast'
import SectionErrorFallback from '@/components/SectionErrorFallback'

describe('Custom Error UI Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ErrorPageShell merender badge HTTP, judul, saran, tautan warga, dan tombol retry', () => {
    const onRetry = vi.fn()

    render(
      <ErrorPageShell
        variant="public"
        statusCode="404"
        statusLabel="Tidak Ditemukan"
        kicker="Halaman Tidak Tersedia"
        title="Halaman yang Anda tuju tidak ditemukan"
        description="Alamat halaman mungkin sudah berubah atau laporan telah dihapus."
        guidance="Pastikan URL sudah benar."
        referenceId="ERR-ABC123"
        tone="blue"
        icon="not-found"
        showCivicLinks
        onRetry={onRetry}
        actions={[
          { label: 'Coba Muat Ulang', kind: 'retry', tone: 'primary', icon: 'reload' },
          { label: 'Kembali ke Beranda', kind: 'link', href: '/', tone: 'secondary', icon: 'home' },
        ]}
      />
    )

    expect(screen.getByText(/STATUS LAYANAN:\s*404/i)).toBeInTheDocument()
    expect(screen.getByText('Tidak Ditemukan')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Halaman yang Anda tuju tidak ditemukan/i })).toBeInTheDocument()
    expect(screen.getByText('Pastikan URL sudah benar.')).toBeInTheDocument()
    expect(screen.getByText('ERR-ABC123')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Panduan Portal/i })).toHaveAttribute('href', '/bantuan/panduan')
    expect(screen.getByRole('link', { name: /Hotline Darurat/i })).toHaveAttribute('href', '/informasi/darurat')
    expect(screen.getByRole('link', { name: /Kontak Pengurus/i })).toHaveAttribute('href', '/bantuan/kontak')

    fireEvent.click(screen.getByRole('button', { name: /Coba Muat Ulang/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('ErrorPageShell varian dashboard menyembunyikan header publik dan menampilkan detail teknis jika diberikan', () => {
    render(
      <ErrorPageShell
        variant="dashboard"
        statusCode="500"
        statusLabel="Kendala Internal"
        kicker="Gangguan Pemrosesan"
        title="Terjadi gangguan sementara"
        description="Sistem mengalami kendala saat memuat data."
        technicalDetail="Prisma P1001 timeout"
        tone="rose"
        icon="server-error"
        actions={[{ label: 'Ke Dashboard', kind: 'link', href: '/dashboard', icon: 'dashboard' }]}
      />
    )

    expect(screen.queryByRole('link', { name: /Panduan Portal/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Keterangan Teknis \(Mode Pengembangan\)/i)).toBeInTheDocument()
    expect(screen.getByText('Prisma P1001 timeout')).toBeInTheDocument()
  })

  it('ErrorToast memetakan kode error baru ke pesan Bahasa Indonesia dan dapat ditutup', () => {
    const { rerender } = render(<ErrorToast message="already_processed" />)
    expect(screen.getByText(/sudah diproses sebelumnya/i)).toBeInTheDocument()

    rerender(<ErrorToast message="rate_limited" />)
    expect(screen.getByText(/Terlalu banyak permintaan dalam waktu singkat/i)).toBeInTheDocument()

    rerender(<ErrorToast message="database_unavailable" />)
    expect(screen.getByText(/Layanan basis data sedang terganggu/i)).toBeInTheDocument()

    rerender(<ErrorToast message="self_action_forbidden" />)
    expect(screen.getByText(/tidak dapat mengubah peran atau menghapus akun Anda sendiri/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Tutup notifikasi kesalahan/i }))
    expect(screen.queryByRole('complementary', { name: /Pemberitahuan kesalahan/i })).not.toBeInTheDocument()
  })

  it('SectionErrorFallback merender alert dan memicu router.refresh() saat tombol diklik', () => {
    render(
      <SectionErrorFallback
        title="Statistik gagal dimuat"
        message="Basis data sedang tidak dapat dijangkau."
      />
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Statistik gagal dimuat')).toBeInTheDocument()
    expect(screen.getByText('Basis data sedang tidak dapat dijangkau.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Muat Ulang Data/i }))
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })
})
