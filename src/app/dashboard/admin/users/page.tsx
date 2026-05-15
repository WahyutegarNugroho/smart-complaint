import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import UserRow from './UserRow'
import {
   Users,
   ArrowLeft,
   ShieldCheck,
   Search,
   Filter,
   UserPlus
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsersPage({
   searchParams
}: {
   searchParams: Promise<{ q?: string, role?: string, rt?: string, rw?: string }>
}) {
   const { q, role, rt, rw } = await searchParams
   const supabase = await createClient()

   let allUsers = []
   try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) redirect('/login')

      const profile = await prisma.profile.findUnique({
         where: { userId: user.id }
      })

      if (!profile || profile.role !== 'ADMIN') {
         redirect('/dashboard')
      }

      const whereClause: any = {}
      if (q) {
         whereClause.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { username: { contains: q, mode: 'insensitive' } }
         ]
      }
      if (role) whereClause.role = role
      if (rt) whereClause.rt = rt
      if (rw) whereClause.rw = rw

      allUsers = await prisma.profile.findMany({
         where: whereClause,
         orderBy: { createdAt: 'desc' }
      })
   } catch (err) {
      console.error('AdminUsersPage Data Error:', err)
      // Keep allUsers as empty array
   }

   return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">

         <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">

            {/* 👋 HEADER SECTION */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-2">
                     <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                        <ArrowLeft size={20} />
                     </Link>
                     <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Manajemen Data Pengguna</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Data Penduduk</h1>
                  <p className="text-slate-700 dark:text-slate-400 font-medium text-sm md:text-base transition-colors">Kelola basis data warga, petugas dan verifikasi akun secara terpusat.</p>
               </div>
            </section>

            {/* 🔍 FILTER & SEARCH AREA */}
            <section className="space-y-6 md:space-y-8">
               <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:shadow-xl focus-within:shadow-blue-500/5 group">
                  <form className="flex flex-col lg:flex-row items-center gap-4 md:gap-6">
                     <div className="flex-1 flex items-center gap-4 w-full px-4">
                        <Search size={18} className="text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                        <input
                           name="q"
                           type="text"
                           defaultValue={q}
                           placeholder="Cari nama atau username warga..."
                           className="flex-1 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none h-12"
                        />
                     </div>

                     <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 px-2">
                        <div className="flex gap-2 w-full sm:w-auto">
                           <select name="role" defaultValue={role} className="flex-1 sm:w-32 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 h-12 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer appearance-none text-center">
                              <option value="">Role</option>
                              <option value="MASYARAKAT">Warga</option>
                              <option value="PETUGAS">Petugas</option>
                              <option value="ADMIN">Admin</option>
                           </select>
                           <input name="rt" type="text" defaultValue={rt} placeholder="RT" className="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-2 h-12 text-[10px] font-black text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors" />
                           <input name="rw" type="text" defaultValue={rw} placeholder="RW" className="w-16 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-2 h-12 text-[10px] font-black text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors" />
                        </div>
                        <button type="submit" className="flex-1 sm:flex-none h-12 bg-slate-900 dark:bg-blue-600 text-white px-8 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95">
                           Terapkan
                        </button>
                        {(q || role || rt || rw) && (
                           <Link href="/dashboard/admin/users" className="h-12 flex items-center px-4 text-[10px] font-bold uppercase text-red-500 tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
                              Reset
                           </Link>
                        )}
                     </div>
                  </form>
               </div>

               {/* 📋 USERS TABLE CARD */}
               <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                           <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 transition-colors">
                              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">Profil Penduduk</th>
                              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">Domisili</th>
                              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">Status Akses</th>
                              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic text-right">Kelola</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                           {allUsers.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400 opacity-20">
                                       <Users size={64} className="mb-4" />
                                       <p className="text-sm font-bold uppercase tracking-widest italic">Data Tidak Ditemukan</p>
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
            </section>

         </main>
      </div>
   )
}
