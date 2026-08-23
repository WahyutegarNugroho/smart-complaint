import React from 'react'

export default function SectionSkeleton({ type }: { type: 'stats' | 'announcements' | 'list' | 'detail' | 'form' | 'users' | 'export' | 'chart' }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 animate-pulse">
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
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
            <div className="space-y-1">
              <div className="h-5 w-48 bg-brand-hairline rounded"></div>
              <div className="h-3 w-56 bg-brand-hairline rounded"></div>
            </div>
          </div>
        </header>

        {/* Success message skeleton (conditional) */}
        <div className="h-12 bg-brand-hairline/10 rounded-lg"></div>

        {/* Main content - asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form skeleton - left column */}
          <div className="lg:col-span-1">
            <div className="bg-brand-canvas rounded-xl border border-brand-hairline p-4 md:p-5 sticky top-24">
              <div className="flex items-center gap-2 border-b border-brand-hairline pb-3 mb-4">
                <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
                <div>
                  <div className="h-4 w-20 bg-brand-hairline rounded"></div>
                  <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-10 bg-brand-hairline rounded-lg"></div>
                <div className="h-20 bg-brand-hairline rounded-lg"></div>
                <div className="h-10 bg-brand-hairline rounded-lg"></div>
                <div className="h-10 bg-brand-hairline rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* List skeleton - right column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-brand-hairline rounded"></div>
              <div className="h-3 w-20 bg-brand-hairline rounded font-mono"></div>
            </div>

            {/* Announcement items skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-brand-canvas rounded-lg border border-brand-hairline p-4">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="h-5 w-3/4 bg-brand-hairline rounded mb-2"></div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="h-4 w-16 bg-brand-hairline rounded border"></div>
                        <div className="h-3 w-20 bg-brand-hairline rounded"></div>
                        <div className="h-3 w-24 bg-brand-hairline rounded font-mono"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
                      <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-brand-hairline rounded"></div>
                </div>
              ))}
            </div>

            {/* Pagination skeleton */}
            <nav className="flex items-center justify-between pt-2 border-t border-brand-hairline">
              <div className="h-3 w-56 bg-brand-hairline rounded font-mono"></div>
              <div className="flex items-center gap-1">
                <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
                <div className="h-8 w-10 bg-brand-hairline rounded-lg"></div>
                <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
              </div>
            </nav>
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
          <div className="lg:col-span-7">
            <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline space-y-6">
              <div className="space-y-3">
                <div className="h-2.5 w-36 bg-brand-hairline rounded"></div>
                <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
                <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-28 bg-brand-hairline rounded"></div>
                <div className="h-[120px] w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
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

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline space-y-4">
              <div className="h-2.5 w-32 bg-brand-hairline rounded"></div>
              <div className="h-56 w-full rounded-xl border-2 border-dashed border-brand-hairline"></div>
            </div>

            <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline space-y-6">
              <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl"></div>
              <div className="h-64 md:h-80 w-full rounded-xl border border-brand-hairline bg-brand-hairline"></div>
              <div className="h-12 w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl"></div>
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
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-brand-hairline rounded"></div>
                <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
              </div>
            </div>

            <div className="h-12 w-full bg-brand-hairline rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'users') {
    return (
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
            <div className="space-y-1">
              <div className="h-5 w-40 bg-brand-hairline rounded"></div>
              <div className="h-3 w-56 bg-brand-hairline rounded"></div>
            </div>
          </div>
          <div className="h-9 w-40 bg-brand-hairline rounded-lg shrink-0"></div>
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-hairline rounded"></div>
              <div className="w-full h-10 bg-brand-hairline rounded-lg pl-10"></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex gap-2 flex-wrap">
              <div className="w-32 h-10 bg-brand-hairline rounded-lg"></div>
              <div className="w-16 h-10 bg-brand-hairline rounded-lg"></div>
              <div className="w-16 h-10 bg-brand-hairline rounded-lg"></div>
            </div>
            <div className="flex-1 lg:flex-none h-10 bg-brand-hairline rounded-lg"></div>
            <div className="h-10 w-20 bg-brand-hairline rounded-lg"></div>
          </div>
        </div>

        {/* Table skeleton - mirrors actual table structure */}
        <div className="bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0" role="grid" aria-label="Data penduduk (loading)">
              <thead>
                <tr className="bg-brand-canvas-soft/50 border-b border-brand-hairline">
                  <th scope="col" className="px-4 sm:px-6 py-3"><div className="h-3 w-32 bg-brand-hairline rounded"></div></th>
                  <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3"><div className="h-3 w-24 bg-brand-hairline rounded"></div></th>
                  <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3"><div className="h-3 w-28 bg-brand-hairline rounded"></div></th>
                  <th scope="col" className="sticky right-0 pl-2 pr-4 sm:pl-4 sm:pr-6 py-3 text-right"><div className="h-3 w-16 bg-brand-hairline rounded ml-auto"></div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-hairline">
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="hover:bg-brand-canvas-soft/50">
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-brand-hairline rounded-lg shrink-0"></div>
                        <div className="min-w-0 space-y-1">
                          <div className="h-4 w-40 bg-brand-hairline rounded"></div>
                          <div className="h-3 w-28 bg-brand-hairline rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="h-4 w-24 bg-brand-hairline rounded font-mono"></div>
                        <div className="h-2.5 w-20 bg-brand-hairline rounded"></div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="h-6 w-20 bg-brand-hairline rounded-md"></div>
                        <div className="h-6 w-28 bg-brand-hairline rounded-md"></div>
                      </div>
                    </td>
                    <td className="sticky right-0 pl-2 pr-4 sm:pl-4 sm:pr-6 py-3 text-right bg-brand-canvas">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
                        <div className="h-9 w-9 bg-brand-hairline rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-brand-hairline bg-brand-canvas-soft/30">
            <div className="h-4 w-60 bg-brand-hairline rounded font-mono"></div>
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
              <div className="h-8 w-10 bg-brand-hairline rounded-lg"></div>
              <div className="h-8 w-8 bg-brand-hairline rounded-lg"></div>
            </div>
          </div>
        </div>
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="h-7 w-48 bg-brand-hairline rounded-lg"></div>
        <div className="flex items-center gap-1 bg-brand-canvas border border-brand-hairline p-1 rounded-xl w-fit max-w-full overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-16 bg-brand-hairline rounded-lg"></div>
          ))}
        </div>
      </div>

      <div className="h-14 w-full bg-brand-canvas border border-brand-hairline rounded-xl shadow-sm"></div>

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

      <div className="bg-brand-canvas rounded-xl border border-brand-hairline divide-y divide-brand-hairline overflow-hidden pb-20">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-brand-hairline">
          <div className="h-2.5 w-10 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-14 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-12 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-12 bg-brand-hairline rounded"></div>
          <div className="h-2.5 w-8 bg-brand-hairline rounded ml-auto"></div>
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 items-center">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-lg bg-brand-hairline shrink-0"></div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-brand-hairline rounded"></div>
                <div className="h-3 w-full bg-brand-hairline rounded"></div>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <div className="h-6 w-16 bg-brand-hairline rounded-lg"></div>
            </div>
            <div className="hidden md:flex items-center">
              <div className="h-7 w-14 bg-brand-hairline rounded-lg"></div>
            </div>
            <div className="hidden md:block h-3.5 w-16 bg-brand-hairline rounded"></div>
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