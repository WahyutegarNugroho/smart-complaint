import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { ArrowLeft, History, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import AuditLogActionFilter from '@/components/AuditLogActionFilter'

const ACTION_LABELS: Record<string, string> = {
  DELETE_REPORT: 'Hapus Laporan',
  DELETE_USER: 'Hapus Akun',
  UPDATE_ROLE: 'Ubah Role',
  VERIFY_USER: 'Verifikasi Akun',
  UPDATE_STATUS: 'Ubah Status',
}

const ACTION_BADGE_STYLES: Record<string, string> = {
  DELETE_REPORT: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  DELETE_USER: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  UPDATE_ROLE: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  VERIFY_USER: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  UPDATE_STATUS: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
}

const PAGE_SIZE = 20

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AuditLogPage({
  searchParams
}: {
  searchParams: Promise<{ action?: string; page?: string }>
}) {
  const sp = await searchParams
  const filterAction = sp.action
  const page = Math.max(1, parseInt(sp.page || '1'))
  const supabase = await createClient()

  let logs: Array<{
    id: string
    action: string
    details: string
    createdAt: Date
    admin: { name: string | null }
  }> = []
  let totalLogs = 0

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true }
    })
    if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

    const whereClause: { action?: string } = {}
    if (filterAction) whereClause.action = filterAction

    ;[totalLogs, logs] = await Promise.all([
      prisma.auditLog.count({ where: whereClause }),
      prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { admin: true }
      }),
    ])
  } catch (err) {
    console.error('AuditLogPage Error:', err)
  }

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (filterAction) params.set('action', filterAction)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/dashboard/admin/audit-log${qs ? '?' + qs : ''}`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
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
                Administrasi Sistem
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Log Audit Aktivitas
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
              Riwayat jejak tindakan administratif dan tata kelola akun platform.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Filter Aksi:
              </span>
              <AuditLogActionFilter filterAction={filterAction} baseUrl="/dashboard/admin/audit-log" />
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              Total {totalLogs} aktivitas tercatat
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-14 text-center">
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                  <History size={24} aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Belum ada rekaman aktivitas audit
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tindakan</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detail</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oleh</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {logs.map((log) => {
                      const badgeCls = ACTION_BADGE_STYLES[log.action] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider border ${badgeCls}`}>
                              {ACTION_LABELS[log.action] || log.action}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-md truncate">
                              {log.details}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {log.admin?.name || 'Sistem'}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                              {new Date(log.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalLogs > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {totalLogs > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalLogs)} dari ${totalLogs}` : ''}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildHref(page - 1)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </Link>
                )}
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300 px-3">
                  {page}
                </span>
                {page * PAGE_SIZE < totalLogs && (
                  <Link
                    href={buildHref(page + 1)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Halaman selanjutnya"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

