import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline - Smart Complaint',
}

export default function OfflinePage() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: '#101010',
      color: '#f2f2f2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📡</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#9fe870' }}>Koneksi Terputus</h1>
        <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6, marginBottom: '2rem' }}>
          Anda sedang offline. Silakan periksa koneksi internet Anda dan coba lagi.
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" style={{
          display: 'inline-block',
          padding: '0.8rem 2rem',
          background: '#9fe870',
          color: '#0e0f0c',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}>Coba Lagi</a>
      </div>
    </div>
  )
}
