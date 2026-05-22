import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { ArrowLeft, History } from 'lucide-react'
import Link from 'next/link'
import AuditLogActionFilter from '@/components/AuditLogActionFilter'

const ACTION_LABELS: Record<string, string> = {
  DELETE_REPORT: 'Hapus Laporan',
  DELETE_USER: 'Hapus Akun',
  UPDATE_ROLE: 'Ubah Role',
  VERIFY_USER: 'Verifikasi Akun',
  UPDATE_STATUS: 'Ubah Status',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AuditLogPage({
  searchParams
}: {
  searchParams: Promise<{ action?: string }>
}) {
  const { action: filterAction } = await searchParams
  const supabase = await createClient()

  let logs: Array<{
    id: string
    action: string
    details: string
    createdAt: Date
    admin: { name: string | null }
  }> = []

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

    const whereClause: { action?: string } = {}
    if (filterAction) whereClause.action = filterAction

    logs = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { admin: true }
    })
  } catch (err) {
    console.error('AuditLogPage Error:', err)
  }

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans transition-colors duration-300 pb-20">
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                <ArrowLeft size={20} />
              </Link>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Administrasi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Aktivitas Admin</h1>
            <p className="text-brand-ink/60 font-medium text-sm md:text-base">Riwayat tindakan administratif di platform.</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-brand-canvas p-4 rounded-2xl border border-brand-hairline shadow-sm">
            <AuditLogActionFilter filterAction={filterAction} baseUrl="/dashboard/admin/audit-log" />
          </div>

          <div className="bg-brand-canvas rounded-[2rem] border border-brand-hairline shadow-sm overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-16 text-center">
                <div className="h-16 w-16 bg-brand-canvas-soft rounded-3xl flex items-center justify-center text-brand-ink/20 mx-auto mb-4">
                  <History size={32} />
                </div>
                <p className="text-sm font-bold text-brand-ink/40 uppercase tracking-widest">Belum ada aktivitas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-brand-canvas-soft/50 border-b border-brand-hairline">
                      <th className="px-6 py-5 text-[10px] font-bold text-brand-ink/40 uppercase tracking-[0.2em]">Tindakan</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-brand-ink/40 uppercase tracking-[0.2em]">Detail</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-brand-ink/40 uppercase tracking-[0.2em]">Oleh</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-brand-ink/40 uppercase tracking-[0.2em]">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-hairline">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-canvas-soft/30 transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold bg-brand-canvas-soft px-3 py-1.5 rounded-lg uppercase tracking-widest border border-brand-hairline">
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[13px] font-medium text-brand-ink/80 max-w-md truncate">{log.details}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[13px] font-bold text-brand-ink">{log.admin?.name || '-'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[12px] font-medium text-brand-ink/50">
                            {new Date(log.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric',
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
        </section>
      </main>
    </div>
  )
}
