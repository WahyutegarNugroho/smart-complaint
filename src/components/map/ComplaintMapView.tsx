'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { STATUS_LABELS, STATUS_HEX } from '@/lib/constants'

interface ComplaintMarker {
  id: string
  title: string
  latitude: number
  longitude: number
  status: string
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
}

interface ComplaintMapViewProps {
  complaints: ComplaintMarker[]
}

export default function ComplaintMapView({ complaints }: ComplaintMapViewProps) {
  if (complaints.length === 0) {
    return (
      <div className="h-64 rounded-xl bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40">
        <div className="text-center">
          <MapPin size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm font-bold uppercase tracking-normal">Belum ada data lokasi</p>
        </div>
      </div>
    )
  }

  const center: [number, number] = [complaints[0].latitude, complaints[0].longitude]

  return (
    <div className="h-[500px] rounded-xl overflow-hidden border border-brand-hairline shadow-sm">
      <MapContainer
        center={center}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((c) => {
          const color = STATUS_HEX[c.status as keyof typeof STATUS_HEX] || '#6b7280'
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 24px; height: 24px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ${c.isUrgent ? 'animation: pulse 2s infinite;' : ''}
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          return (
            <Marker key={c.id} position={[c.latitude, c.longitude]} icon={icon}>
              <Popup>
                <div className="min-w-[200px]">
                  <Link
                    href={`/dashboard/complaint/${c.id}`}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 block mb-1"
                  >
                    {c.title}
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-normal">
                    <span className={`px-2 py-0.5 rounded ${
                      c.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      c.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {STATUS_LABELS[c.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                    </span>
                    <span className="text-slate-400">RT {c.rt}/{c.rw}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="p-3 bg-brand-canvas border-t border-brand-hairline flex items-center gap-4 text-[10px] font-semibold uppercase tracking-normal">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Menunggu
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Diproses
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Selesai
        </div>
        <div className="flex items-center gap-1.5 text-red-500 ml-auto">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" /> Prioritas
        </div>
      </div>
    </div>
  )
}

