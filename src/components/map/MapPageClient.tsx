'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { Search, Filter, X, Layers } from 'lucide-react'
import dynamic from 'next/dynamic'
import { STATUS_LABELS, STATUS_HEX } from '@/lib/constants'

const ComplaintDetailPanel = dynamic(() => import('./ComplaintDetailPanel'), { ssr: false })

export interface ComplaintMarker {
  id: string
  title: string
  content: string
  latitude: number
  longitude: number
  status: string
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: string
  category: string
  categoryId: string | null
  categoryName: string
  imageUrl: string | null
  location: string
  incidentDate: string
  escalationLevel: string
  author: { name: string; username: string } | null
  authorId: string
}

interface CategoryItem {
  id: string
  name: string
  parentId: string | null
}

interface MapPageClientProps {
  complaints: ComplaintMarker[]
  categories: CategoryItem[]
  highlightedComplaintId?: string
  userRole: string
  currentUserId: string
}

interface Filters {
  status: string
  categoryId: string
  search: string
}

function MarkerClusterLayer({
  complaints,
  filters,
  onMarkerClick,
}: {
  complaints: ComplaintMarker[]
  filters: Filters
  onMarkerClick: (c: ComplaintMarker) => void
}) {
  const map = useMap()
  const layerRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    const filtered = complaints.filter((c) => {
      if (filters.status && c.status !== filters.status) return false
      if (filters.categoryId && c.categoryId !== filters.categoryId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.content.toLowerCase().includes(q) &&
          !c.location.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })

    const mcg = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount()
        let bg = '#6b7280'
          if (filters.status && STATUS_HEX[filters.status as keyof typeof STATUS_HEX]) {
            bg = STATUS_HEX[filters.status as keyof typeof STATUS_HEX]
        }
        return L.divIcon({
          html: `<div style="
            width:40px;height:40px;
            background:${bg};
            border:3px solid white;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            color:white;font-size:12px;font-weight:800;
            box-shadow:0 2px 12px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        })
      },
    })

    filtered.forEach((c) => {
      const color = STATUS_HEX[c.status as keyof typeof STATUS_HEX] || '#6b7280'
      const icon = L.divIcon({
        className: 'custom-marker-icon',
        html: `<div style="
          width:24px;height:24px;
          background:${color};
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          ${c.isUrgent ? 'animation:pulse 2s infinite;' : ''}
          cursor:pointer;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([c.latitude, c.longitude], { icon })
      marker.bindTooltip(c.title, {
        direction: 'top',
        offset: L.point(0, -16),
        className: 'custom-marker-tooltip',
      })
      marker.on('click', () => onMarkerClick(c))
      mcg.addLayer(marker)
    })

    map.addLayer(mcg)
    layerRef.current = mcg

    if (filtered.length > 0) {
      const bounds = mcg.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 })
      }
    }

    return () => {
      map.removeLayer(mcg)
      layerRef.current = null
    }
  }, [map, complaints, filters, onMarkerClick])

  return null
}

function MapContent({
  complaints,
  filters,
  onMarkerClick,
  highlightedComplaintId,
}: {
  complaints: ComplaintMarker[]
  filters: Filters
  onMarkerClick: (c: ComplaintMarker) => void
  highlightedComplaintId?: string
}) {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterLayer
        complaints={complaints}
        filters={filters}
        onMarkerClick={onMarkerClick}
      />
      <AutoSelectMapLayer
        complaints={complaints}
        highlightedComplaintId={highlightedComplaintId}
        onMarkerClick={onMarkerClick}
      />
    </>
  )
}

function AutoSelectMapLayer({
  complaints,
  highlightedComplaintId,
  onMarkerClick,
}: {
  complaints: ComplaintMarker[]
  highlightedComplaintId?: string
  onMarkerClick: (c: ComplaintMarker) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!highlightedComplaintId) return
    const complaint = complaints.find((c) => c.id === highlightedComplaintId)
    if (!complaint) return

    onMarkerClick(complaint)
    map.flyTo([complaint.latitude, complaint.longitude], 18, { duration: 1 })
  }, [highlightedComplaintId, complaints, onMarkerClick, map])

  return null
}

export default function MapPageClient({ complaints, categories, highlightedComplaintId, userRole, currentUserId }: MapPageClientProps) {
  const [filters, setFilters] = useState<Filters>({
    status: '',
    categoryId: '',
    search: '',
  })
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintMarker | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const center: [number, number] = complaints.length > 0
    ? [complaints[0].latitude, complaints[0].longitude]
    : [-6.330579, 106.660773]

  const handleMarkerClick = useCallback((c: ComplaintMarker) => {
    setSelectedComplaint(c)
  }, [])

  const filteredCount = useMemo(() => {
    return complaints.filter((c) => {
      if (filters.status && c.status !== filters.status) return false
      if (filters.categoryId && c.categoryId !== filters.categoryId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.content.toLowerCase().includes(q) &&
          !c.location.toLowerCase().includes(q)
        )
          return false
      }
      return true
    }).length
  }, [complaints, filters])

  const activeFilterCount = [filters.status, filters.categoryId, filters.search]
    .filter(Boolean).length

  return (
    <>
      <MapContainer
        center={center}
        zoom={18}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <MapContent
          complaints={complaints}
          filters={filters}
          onMarkerClick={handleMarkerClick}
          highlightedComplaintId={highlightedComplaintId}
        />
      </MapContainer>

      {/* Floating Filter Bar */}
      <div className="absolute top-3 left-3 right-14 md:left-4 md:right-auto md:w-80 z-[1000]">
        <div className="bg-brand-canvas/90 backdrop-blur-xl border border-brand-hairline rounded-2xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-4 py-2.5">
            <Search size={16} className="text-brand-ink/30 shrink-0" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="flex-1 bg-transparent text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:outline-none"
              aria-label="Cari laporan berdasarkan judul, isi, atau lokasi"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className="h-6 w-6 rounded-lg flex items-center justify-center text-brand-ink/30 hover:text-brand-ink hover:bg-brand-canvas-soft transition-all"
                aria-label="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <div className="border-t border-brand-hairline px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-normal text-brand-ink/50 hover:text-brand-ink transition-all"
            >
              <Filter size={14} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-brand-primary text-[#0e0f0c] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-[10px] font-bold text-brand-ink/40">
              {filteredCount} dari {complaints.length} titik
            </span>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="border-t border-brand-hairline px-4 py-3 space-y-3">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-normal text-brand-ink/40 block mb-1.5">
                  Status
                </label>
                <div className="flex gap-1.5">
                  {['', 'PENDING', 'PROCESSING', 'COMPLETED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters((f) => ({ ...f, status: s }))}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        filters.status === s
                          ? 'bg-brand-ink text-brand-canvas border-brand-ink dark:bg-brand-primary dark:text-[#0e0f0c] dark:border-brand-primary'
                          : 'bg-brand-canvas-soft text-brand-ink/50 border-brand-hairline hover:border-brand-ink/20'
                      }`}
                    >
                      {s ? STATUS_LABELS[s as keyof typeof STATUS_LABELS] || s : 'Semua'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-normal text-brand-ink/40 block mb-1.5">
                  Kategori
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full text-sm font-medium bg-brand-canvas-soft border border-brand-hairline rounded-xl px-3 py-2 text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  aria-label="Filter kategori"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-brand-canvas/90 backdrop-blur-xl border border-brand-hairline rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-4">
          <Layers size={14} className="text-brand-ink/30 shrink-0" />
          {(Object.entries(STATUS_HEX) as [string, string][]).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-bold text-brand-ink/60 uppercase tracking-normal">
                {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
              </span>
            </div>
          ))}
          <div className="w-px h-4 bg-brand-hairline" />
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-normal">
              Prioritas
            </span>
          </div>
        </div>
      </div>

      <ComplaintDetailPanel
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        userRole={userRole}
        currentUserId={currentUserId}
      />
    </>
  )
}
