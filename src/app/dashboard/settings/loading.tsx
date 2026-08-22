export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans pb-32">
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12 animate-pulse">

        {/* Header: back button + eyebrow + title + subtitle + avatar initial */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-brand-hairline rounded-xl"></div>
              <div className="h-2.5 w-28 bg-brand-hairline rounded"></div>
            </div>
            <div className="h-8 w-56 bg-brand-hairline rounded-lg"></div>
            <div className="h-4 w-80 max-w-full bg-brand-hairline rounded"></div>
          </div>
          <div className="h-11 w-11 bg-brand-hairline rounded-lg shrink-0"></div>
        </section>

        {/* Form card: mirrors SettingsForm field layout */}
        <div className="bg-brand-canvas p-5 md:p-6 rounded-xl border border-brand-hairline space-y-6">
          {/* Row 1: Nama + NIK (2-col) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="h-2.5 w-24 bg-brand-hairline rounded"></div>
              <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-48 bg-brand-hairline rounded"></div>
              <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
            </div>
          </div>

          {/* Row 2: WhatsApp */}
          <div className="space-y-2">
            <div className="h-2.5 w-36 bg-brand-hairline rounded"></div>
            <div className="h-10 w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
          </div>

          {/* Row 3: RT / RW (centered labels) */}
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

          {/* Row 4: Address textarea */}
          <div className="space-y-2">
            <div className="h-2.5 w-40 bg-brand-hairline rounded"></div>
            <div className="h-[76px] w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg"></div>
          </div>
        </div>

        {/* Action row: cancel link + save button (right-aligned) */}
        <div className="flex items-center justify-end gap-4">
          <div className="h-6 w-20 bg-brand-hairline rounded"></div>
          <div className="h-10 w-44 bg-brand-hairline rounded-lg"></div>
        </div>

        {/* Logout section */}
        <section className="pt-6 border-t border-brand-hairline flex flex-col items-center">
          <div className="h-2.5 w-16 bg-brand-hairline rounded mb-4"></div>
          <div className="w-full max-w-sm h-11 bg-brand-hairline rounded-lg"></div>
          <div className="mt-6 h-2.5 w-56 bg-brand-hairline rounded"></div>
        </section>
      </main>
    </div>
  )
}
