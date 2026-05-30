'use client'

import dynamic from 'next/dynamic'

export const LocationPicker = dynamic(
  () => import('./LocationPicker'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-2xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40 animate-pulse">
        <p className="text-sm font-bold uppercase tracking-normal">Memuat peta...</p>
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
        <p className="text-[10px] font-semibold uppercase tracking-normal">Memuat peta...</p>
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
        <p className="text-sm font-bold uppercase tracking-normal">Memuat peta sebaran...</p>
      </div>
    ),
  }
)

export const MapPageClient = dynamic(
  () => import('./MapPageClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-brand-canvas-soft flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-10 h-10 rounded-full bg-brand-hairline mx-auto mb-3" />
          <p className="text-[10px] font-semibold uppercase tracking-normal text-brand-ink/40">Memuat peta...</p>
        </div>
      </div>
    ),
  }
)

