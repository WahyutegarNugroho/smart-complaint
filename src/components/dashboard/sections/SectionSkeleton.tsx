import React from 'react'

export default function SectionSkeleton({ type }: { type: 'stats' | 'announcements' | 'list' | 'detail' | 'form' | 'users' | 'export' | 'chart' }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 animate-pulse">
        {/* Hero metric Skeleton - Total Laporan */}
        <div className="lg:col-span-5 bg-brand-panel p-5 md:p-6 rounded-xl border border-brand-hairline flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 w-24 bg-brand-hairline rounded"></div>
            <div className="h-5 w-5 bg-brand-hairline rounded-md"></div>
          </div>
          <div>
            <div className="h-10 w-12 bg-brand-hairline rounded mb-2"></div>
            <div className="h-3 w-32 bg-brand-hairline rounded"></div>
          </div>
        </div>

        {/* Status breakdown Skeleton - dense list */}
        <div className="lg:col-span-7 bg-brand-canvas rounded-xl border border-brand-hairline divide-y divide-brand-hairline overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 md:px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-4 w-4 bg-brand-hairline rounded shrink-0"></div>
                <div className="h-5 w-16 bg-brand-hairline rounded"></div>
              </div>
              <div className="h-6 w-10 bg-brand-hairline rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'announcements') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-brand-hairline rounded-md"></div>
          <div className="h-4 w-4 bg-brand-hairline rounded-full"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1 bg-slate-900 p-5 md:p-6 rounded-xl border border-transparent min-h-[160px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-12 bg-brand-hairline rounded"></div>
                <div className="h-3 w-16 bg-brand-hairline rounded"></div>
              </div>
              <div className="h-5 w-3/4 bg-brand-hairline rounded mb-3"></div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-brand-hairline rounded"></div>
                <div className="h-3 w-2/3 bg-brand-hairline rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline min-h-[160px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3.5 w-16 bg-brand-hairline rounded"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-brand-hairline rounded mb-3"></div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-brand-hairline rounded"></div>
                    <div className="h-3 w-2/3 bg-brand-hairline rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-brand-hairline rounded-xl"></div>
              <div className="h-3 w-24 bg-brand-hairline rounded"></div>
            </div>
            <div className="h-8 w-64 bg-brand-hairline rounded-lg"></div>
            <div className="h-4 w-96 bg-brand-hairline rounded"></div>
          </div>
          <div className="h-10 w-36 bg-brand-hairline rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-brand-canvas rounded-xl border border-brand-hairline overflow-hidden">
              <div className="aspect-video w-full bg-brand-hairline"></div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-brand-hairline rounded-md"></div>
                  <div className="h-6 w-24 bg-brand-hairline rounded-md"></div>
                  <div className="h-6 w-20 bg-brand-hairline rounded-md"></div>
                </div>
                <div className="h-8 w-3/4 bg-brand-hairline rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-brand-hairline rounded"></div>
                  <div className="h-4 w-5/6 bg-brand-hairline rounded"></div>
                  <div className="h-4 w-2/3 bg-brand-hairline rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                  <div className="h-20 bg-brand-hairline rounded-xl"></div>
                  <div className="h-20 w-32 bg-brand-hairline rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="h-36 bg-brand-canvas rounded-xl border border-brand-hairline p-5"></div>
            <div className="h-48 bg-brand-canvas rounded-xl border border-brand-hairline p-5"></div>
            <div className="h-56 bg-brand-canvas rounded-xl border border-brand-hairline p-5"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="animate-pulse space-y-8">
        {/* Page header: back button + eyebrow + title + subtitle + urgent toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-brand-hairline rounded-xl"></div>
              <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
            </div>
            <div className="h-8 w-56 bg-brand-hairline rounded-lg"></div>
            <div className="h-4 w-72 max-w-full bg-brand-hairline rounded"></div>
          </div>
          <div className="h-11 w-44 bg-brand-hairline rounded-lg shrink-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* LEFT: main information card */}
          <div className="lg:col-span-7">
            <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline space-y-6">
              {/* Category dropdown */}
              <div className="space-y-3">
                <div className="h-2.5 w-36 bg-brand-hairline rounded"></div>
                <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
              {/* Title input */}
              <div className="space-y-2">
                <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
                <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
              {/* Description textarea */}
              <div className="space-y-2">
                <div className="h-2.5 w-28 bg-brand-hairline rounded"></div>
                <div className="h-[120px] w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
              {/* Info box */}
              <div className="border border-brand-hairline p-4 rounded-xl flex gap-4">
                <div className="h-9 w-9 bg-brand-hairline rounded-lg shrink-0"></div>
                <div className="space-y-2 flex-1 pt-1">
                  <div className="h-3 w-28 bg-brand-hairline rounded"></div>
                  <div className="h-2.5 w-full bg-brand-hairline rounded"></div>
                  <div className="h-2.5 w-2/3 bg-brand-hairline rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: photo upload + location metadata */}
          <div className="lg:col-span-5 space-y-6">
            {/* Photo dropzone */}
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline space-y-4">
              <div className="h-2.5 w-32 bg-brand-hairline rounded"></div>
              <div className="h-56 w-full rounded-xl border-2 border-dashed border-brand-hairline"></div>
            </div>

            {/* Location & metadata card */}
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline space-y-6">
              {/* Search input */}
              <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl"></div>
              {/* Map area */}
              <div className="h-64 md:h-80 w-full rounded-xl border border-brand-hairline bg-brand-hairline"></div>
              {/* Address input */}
              <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl"></div>
              {/* RT / RW grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-2.5 w-8 bg-brand-hairline rounded mx-auto"></div>
                  <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-8 bg-brand-hairline rounded mx-auto"></div>
                  <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
                </div>
              </div>
              {/* Date input */}
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-brand-hairline rounded"></div>
                <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
            </div>

            {/* Submit button */}
            <div className="h-12 w-full bg-brand-hairline rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'users') {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-brand-canvas rounded-xl border border-brand-hairline p-4 h-16"></div>
        ))}
      </div>
    )
  }

  if (type === 'export') {
    return (
      <div className="animate-pulse bg-brand-canvas rounded-xl border border-brand-hairline divide-y divide-brand-hairline">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 h-24"></div>
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-brand-canvas rounded-xl border border-brand-hairline p-6 h-64">
          <div className="h-full w-full bg-brand-hairline rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-pulse pt-4 md:pt-8">
      {/* Section header + status tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="h-7 w-48 bg-brand-hairline rounded-lg"></div>
        <div className="flex items-center gap-1 bg-brand-canvas border border-brand-hairline p-1 rounded-xl w-fit max-w-full overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-16 bg-brand-hairline rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="h-14 w-full bg-brand-canvas border border-brand-hairline rounded-xl shadow-sm"></div>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px] space-y-1.5">
          <div className="h-2.5 w-14 bg-brand-hairline rounded ml-1"></div>
          <div className="h-11 w-full bg-brand-canvas border border-brand-hairline rounded-xl"></div>
        </div>
        <div className="flex-1 min-w-[120px] space-y-1.5">
          <div className="h-2.5 w-20 bg-brand-hairline rounded ml-1"></div>
          <div className="h-11 w-full bg-brand-canvas border border-brand-hairline rounded-xl"></div>
        </div>
        <div className="flex-1 min-w-[120px] space-y-1.5">
          <div className="h-2.5 w-24 bg-brand-hairline rounded ml-1"></div>
          <div className="h-11 w-full bg-brand-canvas border border-brand-hairline rounded-xl"></div>
        </div>
        <div className="h-11 w-28 bg-brand-hairline rounded-xl"></div>
      </div>

      {/* Dense table with column headers */}
      <div className="bg-brand-canvas rounded-xl border border-brand-hairline divide-y divide-brand-hairline overflow-hidden pb-20">
        {/* Column headers - mirror grid-cols-[2fr_1fr_1fr_1fr_1fr] */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-brand-hairline">
          <div className="h-2.5 w-10 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-14 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-12 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-12 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-8 bg-brand-hairline rounded ml-auto"></div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 items-center">
            {/* Thumbnail + title/content */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-lg bg-brand-hairline shrink-0"></div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-brand-hairline rounded"></div>
                <div className="h-3 w-full bg-brand-hairline rounded"></div>
              </div>
            </div>
            {/* Category badge */}
            <div className="hidden md:flex items-center">
              <div className="h-6 w-16 bg-brand-hairline rounded-lg"></div>
            </div>
            {/* Status badge */}
            <div className="hidden md:flex items-center">
              <div className="h-7 w-14 bg-brand-hairline rounded-lg"></div>
            </div>
            {/* Location */}
            <div className="hidden md:block h-3.5 w-16 bg-brand-hairline rounded"></div>
            {/* Date + action arrow */}
            <div className="hidden md:flex items-center justify-end gap-2">
              <div className="h-3 w-10 bg-brand-hairline rounded"></div>
              <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
