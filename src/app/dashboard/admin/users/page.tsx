import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import UserRow from './UserRow'
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { Profile, Prisma, Role } from '@prisma/client'
import ErrorToast from '@/components/ErrorToast'
import SuccessToast from '@/components/SuccessToast'

const PAGE_SIZE = 20

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, role?: string, rt?: string, rw?: string, page?: string, error?: string, message?: string }>
}) {
  const { q, role, rt, rw, page: pageStr, error: queryError, message: queryMessage } = await searchParams
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      {queryError && <ErrorToast key={queryError} message={queryError} />}
      {queryMessage && <SuccessToast key={queryMessage} message={queryMessage} />}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1">
              <Link
                href="/dashboard"
                className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Kembali ke dashboard"
              >
                <ArrowLeft size={18} />
              </Link>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Basis Data Wilayah
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Data Penduduk
              </h1>
              <span className="text-xs font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {totalUsers} Penduduk Terdata
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Kelola basis data warga, penugasan hak akses petugas, dan verifikasi akun kependudukan.
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        <form 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3" 
          role="search" 
          aria-label="Filter data penduduk"
        >
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <label htmlFor="search-q" className="sr-only">Cari nama atau username</label>
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="search-q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Cari berdasarkan nama lengkap atau username..."
                aria-label="Cari warga"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-h-[44px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative">
              <label htmlFor="filter-role" className="sr-only">Filter role</label>
              <select
                id="filter-role"
                name="role"
                defaultValue={role}
                aria-label="Filter role"
                className="w-36 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 pr-8 min-h-[44px] text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer appearance-none"
              >
                <option value="">Semua Peran</option>
                <option value="MASYARAKAT">Warga</option>
                <option value="PETUGAS">Petugas</option>
                <option value="ADMIN">Admin</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="filter-rt" className="sr-only">Filter RT</label>
              <input
                id="filter-rt"
                name="rt"
                type="text"
                defaultValue={rt}
                placeholder="RT"
                aria-label="Filter RT"
                className="w-18 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-2 min-h-[44px] text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
              />
              <label htmlFor="filter-rw" className="sr-only">Filter RW</label>
              <input
                id="filter-rw"
                name="rw"
                type="text"
                defaultValue={rw}
                placeholder="RW"
                aria-label="Filter RW"
                className="w-18 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-2 min-h-[44px] text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="flex-1 lg:flex-none min-h-[44px] bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Terapkan
            </button>
            {(q || role || rt || rw) && (
              <Link
                href="/dashboard/admin/users"
                className="min-h-[44px] flex items-center px-3.5 text-xs font-bold uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white tracking-wider rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Reset
              </Link>
            )}
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-sm text-rose-700 dark:text-rose-300" role="alert">
            <p className="flex-1 font-medium">{error}</p>
            <Link
              href="/dashboard/admin/users"
              className="px-3.5 py-1.5 text-xs font-bold uppercase text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 rounded-lg hover:bg-rose-200 transition-colors"
            >
              Coba Lagi
            </Link>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0" role="grid">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th scope="col" className="px-5 sm:px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profil Penduduk</th>
                  <th scope="col" className="hidden md:table-cell px-5 sm:px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Domisili</th>
                  <th scope="col" className="hidden sm:table-cell px-5 sm:px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Akses</th>
                  <th scope="col" className="sticky right-0 pl-2 pr-5 sm:pl-4 sm:pr-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right z-10 bg-slate-50 dark:bg-slate-800/50">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Users size={32} className="mb-2 opacity-30" />
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tidak ada data penduduk yang cocok</p>
                        <p className="text-xs text-slate-500">Coba ubah kriteria pencarian atau filter RT/RW Anda.</p>
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

          {/* Pagination */}
          {totalUsers > PAGE_SIZE && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalUsers)} dari {totalUsers}
              </p>
              <nav className="flex items-center gap-1.5" aria-label="Navigasi halaman">
                {page > 1 && (
                  <Link
                    href={`/dashboard/admin/users?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </Link>
                )}
                <span className="text-xs font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200 px-3" aria-current="page">
                  {page}
                </span>
                {page * PAGE_SIZE < totalUsers && (
                  <Link
                    href={`/dashboard/admin/users?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Halaman selanjutnya"
                  >
                    <ChevronRight size={16} />
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