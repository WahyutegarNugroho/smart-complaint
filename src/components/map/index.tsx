'use client'

import dynamic from 'next/dynamic'

export const LocationPicker = dynamic(
  () => import('./LocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-2xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40 animate-pulse">
        <p className="text-sm font-bold uppercase tracking-widest">Memuat peta...</p>
      </div>
    ),
  }
)

export const LocationView = dynamic(
  () => import('./LocationView'),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 rounded-2xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40 animate-pulse">
        <p className="text-[10px] font-bold uppercase tracking-widest">Memuat peta...</p>
      </div>
    ),
  }
)

export const ComplaintMapView = dynamic(
  () => import('./ComplaintMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] rounded-2xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40 animate-pulse">
        <p className="text-sm font-bold uppercase tracking-widest">Memuat peta sebaran...</p>
      </div>
    ),
  }
)
