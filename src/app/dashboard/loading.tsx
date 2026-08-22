import SectionSkeleton from '@/components/dashboard/sections/SectionSkeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans pb-20">
      <main className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
        {/* Header skeleton — mirrors MasyarakatDashboardLayout header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-hairline pb-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 w-56 bg-brand-hairline rounded-lg"></div>
            <div className="h-3 w-80 max-w-full bg-brand-hairline rounded"></div>
          </div>
          <div className="h-[46px] w-44 bg-brand-hairline rounded-brand shrink-0"></div>
        </section>

        <SectionSkeleton type="stats" />
        <SectionSkeleton type="announcements" />
        <SectionSkeleton type="list" />
      </main>
    </div>
  )
}
