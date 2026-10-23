import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { 
  ArrowLeft,
  PieChart as PieIcon,
  Map,
  Inbox,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { ComplaintMapView } from '@/components/map'
import { STATUS_LABELS } from '@/lib/constants'

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { role: true } })
  if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

  // Parallel queries
  const [statusCounts, rtCounts, total, mappedComplaints] = await Promise.all([
    prisma.complaint.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    prisma.complaint.groupBy({
      by: ['rt'],
      _count: { _all: true },
      orderBy: { rt: 'asc' }
    }),
    prisma.complaint.count(),
    prisma.complaint.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        status: true,
        rt: true,
        rw: true,
        isUrgent: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 500
    }),
  ])

  const maxRTCount = Math.max(...rtCounts.map(r => r._count._all), 1)

  const mapComplaints = mappedComplaints.map(c => ({
    ...c,
    latitude: c.latitude!,
    longitude: c.longitude!
  }))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                aria-label="Kembali ke Dashboard"
                className="h-11 w-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Pusat Data & Analitik
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analitik & Statistik Wilayah
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
              Wawasan operasional mengenai kecepatan resolusi dan distribusi sebaran aduan warga per RT.
            </p>
          </div>
        </section>

        {/* ANALYTICS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Distribusi Resolusi</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Arus Penyelesaian Laporan</h2>
              </div>
              <div className="h-10 w-10 bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 rounded-xl flex items-center justify-center shrink-0">
                <PieIcon size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="flex-1 space-y-5">
              {statusCounts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                  <Inbox size={28} className="mb-2 opacity-30" aria-hidden="true" />
                  <p className="text-xs font-medium">Belum ada data laporan</p>
                </div>
              ) : (
                statusCounts.map(item => {
                  const percentage = total > 0 ? Math.round((item._count._all / total) * 100) : 0
                  const statusBgMap: Record<string, string> = {
                    PENDING: 'bg-amber-500',
                    PROCESSING: 'bg-blue-500',
                    COMPLETED: 'bg-emerald-500',
                  }
                  
                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                          </span>
                          <span className="text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">{item._count._all} Laporan</span>
                        </div>
                        <span className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${statusBgMap[item.status] || 'bg-slate-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Reports by RT */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peta Beban Wilayah</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Frekuensi Aduan per RT</h2>
              </div>
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                <Map size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 h-52 pt-4 pb-2">
              {rtCounts.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <p className="text-xs font-medium">Data wilayah belum tersedia</p>
                </div>
              ) : (
                rtCounts.map(item => {
                  const height = total > 0 ? (item._count._all / maxRTCount) * 100 : 0
                  return (
                    <div key={item.rt} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <span className="text-[11px] font-mono font-bold tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                        {item._count._all}
                      </span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl relative flex items-end p-1 h-36 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40">
                        <div 
                          className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-all duration-300" 
                          style={{ height: `${Math.max(height, 8)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono tabular-nums">RT {item.rt || '?'}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* SUMMARY STAT STRIP */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
          <div className="p-5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-rata Laporan / RT</p>
            <p className="text-lg font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">{(total / Math.max(rtCounts.length, 1)).toFixed(1)}</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Entri Aduan</p>
            <p className="text-lg font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">{total}</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cakupan Wilayah Terdata</p>
            <p className="text-lg font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">{rtCounts.length} RT</p>
          </div>
        </section>

        {/* COMPLAINT MAP */}
        <section className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visualisasi Geografis</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Peta Titik Sebaran Pengaduan</h2>
              </div>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg">
              {mapComplaints.length} lokasi tercatat
            </span>
          </div>
          <ComplaintMapView complaints={mapComplaints} />
        </section>

      </main>
    </div>
  )
}

