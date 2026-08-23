import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import UserRow from './UserRow'
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { Profile, Prisma, Role } from '@prisma/client'

const PAGE_SIZE = 20

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, role?: string, rt?: string, rw?: string, page?: string }>
}) {
  const { q, role, rt, rw, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const supabase = await createClient()

  let allUsers: Profile[] = []
  let totalUsers = 0
  let error: string | null = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true }
    })

    if (!profile || profile.role !== 'ADMIN') {
      redirect('/dashboard')
    }

    const whereClause: Prisma.ProfileWhereInput = {}
    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } }
      ]
    }
    if (role) whereClause.role = role as Role
    if (rt) whereClause.rt = rt
    if (rw) whereClause.rw = rw

    const [fetchedUsers, fetchedTotal] = await Promise.all([
      prisma.profile.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE
      }),
      prisma.profile.count({ where: whereClause })
    ])

    allUsers = fetchedUsers
    totalUsers = fetchedTotal
  } catch (err) {
    console.error('AdminUsersPage Data Error:', err)
    error = 'Gagal memuat data pengguna. Silakan coba lagi.'
  }

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">

        {/* Header - compact, no oversized hero */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="h-9 w-9 bg-brand-canvas border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-colors shadow-sm"
              aria-label="Kembali ke dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-brand-ink">Data Penduduk</h1>
              <p className="text-xs text-brand-ink/50 font-medium">Kelola basis data warga, petugas, dan verifikasi akun.</p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/users/create"
            className="flex items-center gap-2 h-9 px-3 bg-brand-primary text-brand-canvas text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <UserPlus size={14} />
            Tambah Penduduk
          </Link>
        </header>

        {/* Filters - flat, no card wrapper */}
        <form className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3" role="search" aria-label="Filter data penduduk">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <label htmlFor="search-q" className="sr-only">Cari nama atau username</label>
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/30" aria-hidden="true" />
              <input
                id="search-q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Cari nama atau username warga..."
                aria-label="Cari warga"
                className="w-full pl-10 pr-4 py-2 bg-brand-canvas border border-brand-hairline rounded-lg text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all h-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="flex gap-2 flex-wrap">
              <label htmlFor="filter-role" className="sr-only">Filter role</label>
              <select
                id="filter-role"
                name="role"
                defaultValue={role}
                aria-label="Filter role"
                className="w-32 bg-brand-canvas border border-brand-hairline rounded-lg px-3 h-10 text-[10px] font-bold uppercase text-brand-ink/70 focus:ring-2 focus:ring-brand-primary outline-none cursor-pointer appearance-none text-center"
              >
                <option value="">Role</option>
                <option value="MASYARAKAT">Warga</option>
                <option value="PETUGAS">Petugas</option>
                <option value="ADMIN">Admin</option>
              </select>
              <label htmlFor="filter-rt" className="sr-only">Filter RT</label>
              <input
                id="filter-rt"
                name="rt"
                type="text"
                defaultValue={rt}
                placeholder="RT"
                aria-label="Filter RT"
                className="w-16 bg-brand-canvas border border-brand-hairline rounded-lg px-2 h-10 text-[10px] font-mono font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
              <label htmlFor="filter-rw" className="sr-only">Filter RW</label>
              <input
                id="filter-rw"
                name="rw"
                type="text"
                defaultValue={rw}
                placeholder="RW"
                aria-label="Filter RW"
                className="w-16 bg-brand-canvas border border-brand-hairline rounded-lg px-2 h-10 text-[10px] font-mono font-bold text-center text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
              />
            </div>
            <button type="submit" className="flex-1 lg:flex-none h-10 bg-brand-ink text-brand-canvas px-5 rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm">
              Terapkan
            </button>
            {(q || role || rt || rw) && (
              <Link
                href="/dashboard/admin/users"
                className="h-10 flex items-center px-3 text-[10px] font-semibold uppercase text-brand-ink/40 tracking-wider hover:text-brand-ink rounded-lg transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300" role="alert">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-auto px-3 py-1 text-xs font-semibold uppercase text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Users Table - single surface, no nested cards */}
        <div className="bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0" role="grid">
              <thead>
                <tr className="bg-brand-canvas-soft/50 border-b border-brand-hairline">
                  <th scope="col" className="px-4 sm:px-6 py-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Profil Penduduk</th>
                  <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Domisili</th>
                  <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">Status Akses</th>
                  <th scope="col" className="sticky right-0 pl-2 pr-4 sm:pl-4 sm:pr-6 py-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider text-right z-10">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-hairline">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-brand-ink/40">
                        <p className="text-sm font-semibold uppercase tracking-wider mb-2">Tidak ada data penduduk</p>
                        <p className="text-xs text-brand-ink/30 mb-4">Coba ubah filter pencarian atau</p>
                        <Link
                          href="/dashboard/admin/users/create"
                          className="text-xs font-semibold text-brand-primary hover:underline"
                        >
                          Tambah penduduk baru
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allUsers.map((u) => (
                    <UserRow key={u.id} user={u} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - inline, no card wrapper */}
          {totalUsers > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-brand-hairline bg-brand-canvas-soft/30">
              <p className="text-xs font-mono tabular-nums text-brand-ink/40">
                {totalUsers > 0
                  ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalUsers)} dari ${totalUsers}`
                  : 'Tidak ada data'}
              </p>
              <nav className="flex items-center gap-1" aria-label="Navigasi halaman">
                {page > 1 && (
                  <Link
                    href={`/dashboard/admin/users?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={14} />
                  </Link>
                )}
                <span className="text-xs font-mono tabular-nums font-bold text-brand-ink/60 px-3" aria-current="page">{page}</span>
                {page * PAGE_SIZE < totalUsers && (
                  <Link
                    href={`/dashboard/admin/users?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                    aria-label="Halaman selanjutnya"
                  >
                    <ChevronRight size={14} />
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}