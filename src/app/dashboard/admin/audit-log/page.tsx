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
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans transition-colors duration-300 pb-20">
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                <ArrowLeft size={20} />
              </Link>
              <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal">Administrasi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Aktivitas Admin</h1>
            <p className="text-brand-ink/60 font-medium text-sm md:text-base">Riwayat tindakan administratif di platform.</p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="bg-brand-canvas p-4 rounded-xl border border-brand-hairline shadow-sm">
            <AuditLogActionFilter filterAction={filterAction} baseUrl="/dashboard/admin/audit-log" />
          </div>

          <div className="bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-14 text-center">
                <div className="h-12 w-12 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/30 mx-auto mb-3 border border-brand-hairline">
                  <History size={24} />
                </div>
                <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider">Belum ada aktivitas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-brand-canvas-soft/50 border-b border-brand-hairline">
                      <th className="px-5 py-4 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Tindakan</th>
                      <th className="px-5 py-4 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Detail</th>
                      <th className="px-5 py-4 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Oleh</th>
                      <th className="px-5 py-4 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-hairline">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-canvas-soft/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-semibold bg-brand-canvas-soft px-2.5 py-1 rounded-md uppercase tracking-wider border border-brand-hairline">
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs font-medium text-brand-ink/80 max-w-md truncate">{log.details}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs font-bold text-brand-ink">{log.admin?.name || '-'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[11px] font-mono tabular-nums text-brand-ink/50">
                            {new Date(log.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalLogs > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-3">
            <p className="text-xs font-mono tabular-nums text-brand-ink/50">
              {totalLogs > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalLogs)} dari ${totalLogs}` : ''}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={buildHref(page - 1)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={15} />
                </Link>
              )}
              <span className="text-xs font-mono tabular-nums font-bold text-brand-ink/60 px-3">{page}</span>
              {page * PAGE_SIZE < totalLogs && (
                <Link
                  href={buildHref(page + 1)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                  aria-label="Halaman selanjutnya"
                >
                  <ChevronRight size={15} />
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

