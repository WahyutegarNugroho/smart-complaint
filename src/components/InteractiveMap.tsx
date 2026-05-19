'use client'

import React, { useState } from 'react'
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react'

interface SimpleComplaint {
  id: string
  title: string
  rt: string | null
  status: string
  isUrgent: boolean
}

interface InteractiveMapProps {
  activeComplaints: SimpleComplaint[]
}

const normalizeRT = (rt: string | null | undefined): string => {
  if (!rt) return ''
  const num = parseInt(rt.replace(/\D/g, ''), 10)
  if (isNaN(num)) return rt.trim()
  return String(num).padStart(3, '0')
}

export default function InteractiveMap({ activeComplaints }: InteractiveMapProps) {
  const [hoveredRT, setHoveredRT] = useState<string | null>(null)
  const [selectedRT, setSelectedRT] = useState<string | null>(null)

  const activeRT = hoveredRT || selectedRT || '001'

  // Define RT Blocks metadata
  const blocks = [
    { id: '001', name: 'RT 001 (Blok Utara)', x: 20, y: 20, w: 160, h: 100, rx: 16, color: 'from-blue-500/10 to-indigo-500/10' },
    { id: '002', name: 'RT 002 (Blok Timur)', x: 200, y: 20, w: 180, h: 100, rx: 16, color: 'from-teal-500/10 to-emerald-500/10' },
    { id: '003', name: 'RT 003 (Pusat & Fasum)', x: 20, y: 140, w: 100, h: 130, rx: 16, color: 'from-amber-500/10 to-orange-500/10' },
    { id: '004', name: 'RT 004 (Blok Barat)', x: 140, y: 140, w: 110, h: 130, rx: 16, color: 'from-purple-500/10 to-pink-500/10' },
    { id: '005', name: 'RT 005 (Blok Selatan)', x: 270, y: 140, w: 110, h: 130, rx: 16, color: 'from-sky-500/10 to-blue-500/10' },
  ]

  // Group complaints by RT
  const complaintsByRT = activeComplaints.reduce((acc, c) => {
    const norm = normalizeRT(c.rt)
    if (norm) {
      if (!acc[norm]) acc[norm] = []
      acc[norm].push(c)
    }
    return acc
  }, {} as Record<string, SimpleComplaint[]>)

  const currentComplaints = complaintsByRT[activeRT] || []
  const currentBlockName = blocks.find(b => b.id === activeRT)?.name || `RT ${activeRT}`

  return (
    <div className="bg-brand-canvas p-6 md:p-10 rounded-[2.5rem] border border-brand-hairline shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch transition-all duration-300">
      
      {/* SVG Map (Lg: Col-span-7) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2 block">Peta Pemantauan Wilayah</span>
          <h3 className="text-xl font-bold text-brand-ink">Interactive Status Map</h3>
          <p className="text-xs text-brand-ink/50 mt-1 font-medium">Arahkan kursor atau ketuk blok untuk melihat aduan aktif di setiap RT.</p>
        </div>

        {/* SVG Viewport */}
        <div className="relative w-full aspect-[4/3] bg-brand-canvas-soft rounded-3xl border border-brand-hairline overflow-hidden p-2 flex items-center justify-center">
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <svg 
            viewBox="0 0 400 300" 
            className="w-full h-full relative z-10 select-none"
          >
            {/* Neighborhood Roads / Pathways */}
            <path 
              d="M 20,130 H 380 M 130,20 V 280 M 260,20 V 280" 
              fill="none" 
              stroke="var(--brand-hairline)" 
              strokeWidth="16" 
              strokeLinecap="round" 
              className="opacity-40" 
            />
            <path 
              d="M 20,130 H 380 M 130,20 V 280 M 260,20 V 280" 
              fill="none" 
              stroke="var(--brand-canvas)" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />

            {/* Interactive Blocks */}
            {blocks.map((block) => {
              const complaints = complaintsByRT[block.id] || []
              const hasActive = complaints.length > 0
              const isHovered = hoveredRT === block.id
              const isSelected = selectedRT === block.id
              const isCurrent = isHovered || isSelected

              // Determine color class based on state
              const fillOpacity = isCurrent ? '0.15' : '0.04'
              const strokeColor = hasActive 
                ? 'stroke-red-500/50 dark:stroke-red-400/50' 
                : isCurrent 
                  ? 'stroke-brand-primary' 
                  : 'stroke-brand-hairline'
              const strokeWidth = isCurrent ? '2.5' : '1.5'

              return (
                <g 
                  key={block.id}
                  onMouseEnter={() => setHoveredRT(block.id)}
                  onMouseLeave={() => setHoveredRT(null)}
                  onClick={() => setSelectedRT(block.id === selectedRT ? null : block.id)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Block Card Body */}
                  <rect
                    x={block.x}
                    y={block.y}
                    width={block.w}
                    height={block.h}
                    rx={block.rx}
                    className={`fill-brand-ink transition-all duration-300 ${strokeColor}`}
                    fillOpacity={fillOpacity}
                    strokeWidth={strokeWidth}
                  />

                  {/* RT Label Text */}
                  <text
                    x={block.x + block.w / 2}
                    y={block.y + block.h / 2 - 4}
                    textAnchor="middle"
                    className={`text-[11px] font-black tracking-widest uppercase transition-colors duration-300 fill-brand-ink`}
                  >
                    RT {block.id}
                  </text>

                  {/* Active Complaints Indicator Badge */}
                  {hasActive ? (
                    <g transform={`translate(${block.x + block.w / 2}, ${block.y + block.h / 2 + 16})`}>
                      <rect 
                        x="-18" 
                        y="-7" 
                        width="36" 
                        height="14" 
                        rx="6" 
                        className="fill-red-500" 
                      />
                      <text 
                        y="3" 
                        textAnchor="middle" 
                        className="text-[9px] font-black fill-white"
                      >
                        {complaints.length} Aktif
                      </text>
                    </g>
                  ) : (
                    <text
                      x={block.x + block.w / 2}
                      y={block.y + block.h / 2 + 16}
                      textAnchor="middle"
                      className="text-[8px] font-bold fill-brand-ink/30 uppercase tracking-widest"
                    >
                      Aman
                    </text>
                  )}

                  {/* Status Beacon Beacon (Pulse Dot) */}
                  {hasActive ? (
                    <g transform={`translate(${block.x + 18}, ${block.y + 18})`}>
                      <circle r="6" className="fill-red-500 animate-ping opacity-75" />
                      <circle r="4" className="fill-red-500" />
                    </g>
                  ) : (
                    <g transform={`translate(${block.x + 18}, ${block.y + 18})`}>
                      <circle r="3" className="fill-emerald-500" />
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Block Information Details Sidebar (Lg: Col-span-5) */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-brand-canvas-soft rounded-3xl border border-brand-hairline p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-hairline pb-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-brand-ink">{currentBlockName}</h4>
            <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">RT {activeRT}</span>
          </div>

          {/* Status Indicators */}
          {currentComplaints.length > 0 ? (
            <div className="flex items-center gap-3 text-red-500 bg-red-500/10 px-4 py-3 rounded-2xl border border-red-500/10">
              <AlertTriangle size={18} className="shrink-0 animate-bounce" />
              <p className="text-xs font-bold uppercase tracking-wider">{currentComplaints.length} Aduan Butuh Penanganan</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-brand-primary bg-brand-primary/10 px-4 py-3 rounded-2xl border border-brand-primary/15">
              <ShieldCheck size={18} className="shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider">Kondisi Wilayah Kondusif</p>
            </div>
          )}

          {/* List of Active Complaints */}
          <div className="space-y-3 pt-2">
            <p className="text-[9px] font-bold text-brand-ink/40 uppercase tracking-widest">Daftar Aduan Aktif:</p>
            
            {currentComplaints.length === 0 ? (
              <div className="text-center py-6 text-brand-ink/40 text-xs border border-dashed border-brand-hairline rounded-2xl">
                Tidak ada laporan kendala saat ini.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentComplaints.map((c) => (
                  <div 
                    key={c.id}
                    className="p-3 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-between gap-3 hover:border-brand-primary/30 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-brand-ink truncate leading-tight group-hover:text-brand-primary transition-colors">{c.title}</p>
                      <p className="text-[9px] text-brand-ink/40 uppercase font-black tracking-widest mt-1">Status: {c.status === 'PENDING' ? 'Menunggu' : 'Diproses'}</p>
                    </div>
                    {c.isUrgent && (
                      <span className="text-[8px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">Urgent</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-brand-canvas p-4 rounded-2xl border border-brand-hairline flex gap-3 items-start">
          <Info size={16} className="text-brand-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-brand-ink/60 font-medium">
            Petugas lapangan akan memprioritaskan penanganan berdasarkan tingkat urgensi aduan di masing-masing RT.
          </p>
        </div>
      </div>

    </div>
  )
}
