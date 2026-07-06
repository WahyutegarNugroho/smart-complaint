'use client'

import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { MapPin, Search, Crosshair, Loader2 } from 'lucide-react'
import L from 'leaflet'

const DEFAULT_CENTER: [number, number] = [-6.330579, 106.660773]
const DEFAULT_ZOOM = 17

const markerIcon = L.divIcon({
  className: 'custom-marker-location-picker',
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
  popupAnchor: [1, -34],
})

function MapClickHandler({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  const prevRef = useRef({ lat, lng })
  useEffect(() => {
    if (prevRef.current.lat !== lat || prevRef.current.lng !== lng) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.5 })
      prevRef.current = { lat, lng }
    }
  }, [lat, lng, map])
  return null
}

export default function LocationPicker({
  initialLat,
  initialLng,
  initialAddress,
}: {
  initialLat?: number | null
  initialLng?: number | null
  initialAddress?: string | null
}) {
  const [lat, setLat] = useState<number>(initialLat && !isNaN(initialLat) ? initialLat : DEFAULT_CENTER[0])
  const [lng, setLng] = useState<number>(initialLng && !isNaN(initialLng) ? initialLng : DEFAULT_CENTER[1])
  const [address, setAddress] = useState(initialAddress ?? '')
  const [searchQuery, setSearchQuery] = useState(initialAddress ?? '')
  const [searching, setSearching] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`,
        { headers: { 'User-Agent': 'SmartComplaintApp/1.0' } }
      )
      const data = await res.json()
      if (data.display_name) {
        setAddress(data.display_name)
        setSearchQuery(data.display_name)
      }
    } catch {
      // silent fail — user can type address manually
    }
  }

  const handlePositionChange = (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    reverseGeocode(newLat, newLng)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=id`,
        { headers: { 'User-Agent': 'SmartComplaintApp/1.0' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setLat(newLat)
        setLng(newLng)
        setAddress(data[0].display_name)
      }
    } catch {
      // silent fail
    } finally {
      setSearching(false)
    }
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePositionChange(pos.coords.latitude, pos.coords.longitude)
        setGeoLoading(false)
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-semibold text-brand-ink/60 uppercase tracking-normal ml-1">
        Lokasi Kejadian
      </label>

      {/* Search + Geolocate */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch() } }}
            placeholder="Cari alamat atau tempat..."
            className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-12 pr-4 py-3.5 text-[13px] font-medium text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
          />
          {searching && (
            <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary animate-spin" />
          )}
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading}
          className="h-12 w-12 bg-brand-canvas-soft border border-brand-hairline rounded-2xl flex items-center justify-center text-brand-ink/50 hover:text-brand-primary hover:border-brand-primary transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Gunakan lokasi saya"
        >
          {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
        </button>
      </div>

      {/* Map */}
      <div className="h-64 md:h-80 rounded-2xl overflow-hidden border border-brand-hairline shadow-sm">
        <MapContainer
          center={[lat, lng]}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPositionChange={handlePositionChange} />
          <FlyToMarker lat={lat} lng={lng} />
          <Marker
            position={[lat, lng]}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragstart: () => setDragging(true),
              dragend: (e) => {
                setDragging(false)
                const marker = e.target
                const pos = marker.getLatLng()
                handlePositionChange(pos.lat, pos.lng)
              },
            }}
          />
        </MapContainer>
      </div>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="latitude" value={lat} />
      <input type="hidden" name="longitude" value={lng} />

      {/* Manual address fallback */}
      <div className="relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" size={16} />
        <input
          name="location"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Atau ketik alamat manual..."
          className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl pl-12 pr-4 py-3.5 text-[13px] font-bold text-brand-ink placeholder:text-brand-ink/30 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all"
        />
      </div>

      <p className="text-[10px] font-medium text-brand-ink/40 flex items-center gap-1.5">
        <MapPin size={12} />
        Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
        {dragging && <span className="text-brand-primary ml-2">Geser pin untuk menyesuaikan...</span>}
      </p>
    </div>
  )
}

