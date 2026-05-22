'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationViewProps {
  latitude: number | null
  longitude: number | null
  address: string
}

export default function LocationView({ latitude, longitude, address }: LocationViewProps) {
  if (latitude === null || longitude === null) {
    return (
      <div className="flex items-center gap-4 p-5 bg-brand-canvas-soft rounded-2xl border border-brand-hairline transition-colors">
        <div className="h-10 w-10 bg-brand-canvas rounded-xl flex items-center justify-center text-brand-ink shadow-sm border border-brand-hairline">
          <MapPin size={18} />
        </div>
        <div>
          <p className="text-[9px] font-bold text-brand-ink/40 uppercase tracking-widest">Lokasi Spesifik</p>
          <p className="text-[13px] font-bold text-brand-ink">{address}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-brand-hairline shadow-sm">
      <div className="h-48 w-full">
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
      </div>
      <div className="p-3 bg-brand-canvas border-t border-brand-hairline flex items-center gap-2">
        <MapPin size={14} className="text-brand-primary shrink-0" />
        <p className="text-[12px] font-medium text-brand-ink/70 truncate">{address}</p>
      </div>
    </div>
  )
}
