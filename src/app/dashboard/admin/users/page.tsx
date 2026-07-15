import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import UserRow from './UserRow'
import {
   Users,
   ArrowLeft,
   Search,
   ChevronLeft,
   ChevronRight
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

       const fetchedUsers = await prisma.profile.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
       })
       const fetchedTotal = await prisma.profile.count({ where: whereClause })

       allUsers = fetchedUsers
       totalUsers = fetchedTotal
   } catch (err) {
      console.error('AdminUsersPage Data Error:', err)
      // Keep allUsers as empty array
   }

   return (
      <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">

          <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">

            {/* 👋 HEADER SECTION */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-2">
                      <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                         <ArrowLeft size={20} />
                      </Link>
                      <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-normal">Manajemen Data Pengguna</span>
                  </div>
                   <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Data Penduduk</h1>
                   <p className="text-brand-ink/60 font-medium text-sm md:text-base">Kelola basis data warga, petugas dan verifikasi akun secara terpusat.</p>
               </div>
            </section>

            {/* 🔍 FILTER & SEARCH AREA */}
            <section className="space-y-6 md:space-y-8">
               <div className="bg-brand-canvas p-4 md:p-5 rounded-3xl border border-brand-hairline shadow-sm transition-all focus-within:shadow-xl group">
                  <form className="flex flex-col lg:flex-row items-center gap-4 md:gap-6">
                     <div className="flex-1 flex items-center gap-4 w-full px-4">
                         <Search size={18} className="text-brand-ink/30 group-focus-within:text-brand-primary transition-colors" />
                         <input
                            name="q"
                            type="text"
                            defaultValue={q}
                            placeholder="Cari nama atau username warga..."
                            aria-label="Cari warga"
                             className="flex-1 bg-transparent border-none text-sm font-bold text-brand-ink placeholder:text-brand-ink/30 outline-none h-12"
                         />
                     </div>

                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-brand-hairline pt-4 lg:pt-0 lg:pl-6 px-2">
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select name="role" defaultValue={role} aria-label="Filter role" className="flex-1 sm:w-32 bg-brand-canvas-soft border-none rounded-xl px-4 h-12 text-[10px] font-black uppercase text-brand-ink/70 focus:ring-4 focus:ring-brand-primary/10 outline-none cursor-pointer appearance-none text-center">
                              <option value="">Role</option>
                              <option value="MASYARAKAT">Warga</option>
                              <option value="PETUGAS">Petugas</option>
                              <option value="ADMIN">Admin</option>
                           </select>
                            <input name="rt" type="text" defaultValue={rt} placeholder="RT" aria-label="Filter RT" className="w-16 bg-brand-canvas-soft border-none rounded-xl px-2 h-12 text-[10px] font-black text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 outline-none transition-colors" />
                             <input name="rw" type="text" defaultValue={rw} placeholder="RW" aria-label="Filter RW" className="w-16 bg-brand-canvas-soft border-none rounded-xl px-2 h-12 text-[10px] font-black text-center text-brand-ink focus:ring-4 focus:ring-brand-primary/10 outline-none transition-colors" />
                        </div>
                        <button type="submit" className="flex-1 sm:flex-none h-12 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] px-8 rounded-xl text-[10px] font-semibold uppercase tracking-normal hover:opacity-90 transition-all shadow-lg active:scale-95">
                           Terapkan
                        </button>
                        {(q || role || rt || rw) && (
                           <Link href="/dashboard/admin/users" className="h-12 flex items-center px-4 text-[10px] font-semibold uppercase text-brand-ink/40 tracking-normal hover:text-brand-ink rounded-xl transition-all">
                              Reset
                           </Link>
                        )}
                     </div>
                  </form>
               </div>

               {/* 📋 USERS TABLE CARD */}
                <div className="bg-brand-canvas rounded-3xl border border-brand-hairline shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-brand-canvas-soft/50 border-b border-brand-hairline">
                                <th className="px-6 sm:px-8 py-6 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Profil Penduduk</th>
                                <th className="hidden md:table-cell px-6 sm:px-8 py-6 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Domisili</th>
                                <th className="hidden sm:table-cell px-6 sm:px-8 py-6 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Status Akses</th>
                                 <th className="sticky right-0 pl-2 pr-6 sm:pl-4 sm:pr-8 py-6 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal text-right z-10">Kelola</th>
                           </tr>
                        </thead>
                         <tbody className="divide-y divide-brand-hairline">
                           {allUsers.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center">
                                     <div className="flex flex-col items-center justify-center text-brand-ink/20">
                                       <Users size={64} className="mb-4" />
                                       <p className="text-sm font-bold uppercase tracking-normal">Data Tidak Ditemukan</p>
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
                </div>

                {totalUsers > PAGE_SIZE && (
                <div className="flex items-center justify-between px-6 py-4 bg-brand-canvas rounded-2xl border border-brand-hairline">
                   <p className="text-xs text-brand-ink/40">
                    {totalUsers > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalUsers)} dari ${totalUsers}` : 'Tidak ada data'}
                  </p>
                  <div className="flex items-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/dashboard/admin/users?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                        className="h-9 w-9 flex items-center justify-center rounded-xl border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft size={16} />
                      </Link>
                    )}
                    <span className="text-xs font-bold text-brand-ink/60 px-3">{page}</span>
                    {page * PAGE_SIZE < totalUsers && (
                      <Link
                        href={`/dashboard/admin/users?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}${role ? `&role=${role}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
                        className="h-9 w-9 flex items-center justify-center rounded-xl border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                        aria-label="Halaman selanjutnya"
                      >
                        <ChevronRight size={16} />
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

