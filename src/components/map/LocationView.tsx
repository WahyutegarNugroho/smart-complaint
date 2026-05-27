'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

const markerIcon = L.divIcon({
  className: 'custom-marker-location-view',
  html: `<div style="
    width: 24px; height: 36px;
    position: relative;
  ">
    <div style="
      width: 24px; height: 24px;
      background: #9fe870;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
    <div style="
      width: 0; height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 10px solid #9fe870;
      margin: -2px auto 0;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    "></div>
  </div>`,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
})

interface LocationViewProps {
  latitude: number | null
  longitude: number | null
  address: string
  complaintId: string
}

export default function LocationView({ latitude, longitude, address, complaintId }: LocationViewProps) {
  const router = useRouter()

  const goToMap = () => router.push('/dashboard/map?complaintId=' + complaintId)

  if (latitude === null || longitude === null) {
    return (
      <div className="flex items-center gap-4 p-5 bg-brand-canvas-soft rounded-2xl border border-brand-hairline transition-colors">
        <div className="h-10 w-10 bg-brand-canvas rounded-xl flex items-center justify-center text-brand-ink shadow-sm border border-brand-hairline">
          <MapPin size={18} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-brand-ink/40 uppercase tracking-normal">Lokasi Spesifik</p>
          <p className="text-[13px] font-bold text-brand-ink">{address}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-brand-hairline shadow-sm cursor-pointer group transition-all hover:shadow-lg"
      onClick={goToMap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToMap() }}
    >
      <div className="h-48 w-full relative">
        <MapContainer
          center={[latitude, longitude]}
          zoom={17}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-canvas/90 text-brand-ink rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-bold shadow-lg">
            <ExternalLink size={12} />
            Lihat di peta sebaran
          </div>
        </div>
      </div>
      <div className="p-3 bg-brand-canvas border-t border-brand-hairline flex items-center gap-2">
        <MapPin size={14} className="text-brand-primary shrink-0" />
        <p className="text-[12px] font-medium text-brand-ink/70 truncate">{address}</p>
      </div>
    </div>
  )
}
