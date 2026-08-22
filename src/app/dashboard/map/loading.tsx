export default function Loading() {
  return (
    <div className="h-[calc(100vh-1px)] flex flex-col bg-brand-canvas-soft animate-pulse">
      {/* Header bar — mirrors map page header */}
      <header className="bg-brand-canvas border-b border-brand-hairline px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-brand-hairline rounded-xl"></div>
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-brand-hairline rounded"></div>
            <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
          </div>
        </div>
      </header>

      {/* Map area with floating filter panel placeholder */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-brand-hairline/40"></div>
        <div className="absolute top-3 left-3 right-14 md:left-4 md:right-auto md:w-80 z-[1000]">
          <div className="bg-brand-canvas border border-brand-hairline rounded-xl shadow-xl overflow-hidden">
            <div className="h-11 px-4 flex items-center gap-2">
              <div className="h-4 w-4 bg-brand-hairline rounded shrink-0"></div>
              <div className="h-3.5 flex-1 max-w-[200px] bg-brand-hairline rounded"></div>
            </div>
            <div className="border-t border-brand-hairline h-9 px-4 flex items-center justify-between">
              <div className="h-3 w-12 bg-brand-hairline rounded"></div>
              <div className="h-3 w-20 bg-brand-hairline rounded"></div>
            </div>
          </div>
        </div>
        {/* Legend placeholder */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-brand-canvas border border-brand-hairline rounded-xl shadow-xl px-4 py-2.5 flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-hairline"></div>
                <div className="h-2.5 w-10 bg-brand-hairline rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
