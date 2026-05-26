import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { createAnnouncement } from '@/app/dashboard/actions'
import AnnouncementItem from './AnnouncementItem'
import { 
  Megaphone, 
  Plus, 
  Info,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react'
import Link from 'next/link'

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  author: {
    name: string | null;
  };
}

const PAGE_SIZE = 10

export default async function AdminAnnouncementsPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string, page?: string }>
}) {
  const { message: successMessage, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const supabase = await createClient()

  let announcements: Announcement[] = []
  let totalAnnouncements = 0
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

    totalAnnouncements = await prisma.announcement.count()

    announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  } catch (err) {
    console.error('AdminAnnouncementsPage Data Error:', err)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
      
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Pusat Informasi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Manajemen Pengumuman</h1>
            <p className="text-slate-700 dark:text-slate-400 font-medium text-sm md:text-base transition-colors">Siarkan informasi penting dan berita terbaru ke seluruh warga perumahan.</p>
          </div>
        </section>

        {successMessage && (
          <div className="p-5 bg-emerald-500 text-white rounded-2xl flex items-center gap-4 shadow-xl shadow-emerald-500/10 animate-in slide-in-from-top-4 duration-500">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
               <Info size={20} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Form Create */}
          <div className="lg:col-span-5">
             <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 sticky top-10 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                      <Plus size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-1">Buat Baru</h3>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">Rilis Pengumuman Warga</p>
                   </div>
                </div>

                <form action={createAnnouncement} className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors">Judul Informasi</label>
                      <input 
                        name="title" 
                        required 
                        placeholder="Contoh: Jadwal Fogging Rutin" 
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors">Isi Pengumuman</label>
                      <textarea 
                        name="content" 
                        rows={6} 
                        required 
                        placeholder="Tuliskan detail pesan yang ingin disampaikan..." 
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none font-medium transition-all" 
                      />
                   </div>
                   <button 
                    type="submit" 
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
                   >
                      <Send size={16} /> Terbitkan Informasi
                   </button>
                </form>
             </div>
          </div>

          {/* List Announcements */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Arsip Pengumuman</h3>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">{totalAnnouncements} Total</span>
              </div>

              {announcements.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-slate-200 dark:border-slate-800 border-dashed flex flex-col items-center justify-center transition-colors">
                   <Megaphone size={48} className="text-slate-100 dark:text-slate-800 mb-4" />
                   <p className="text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest">Belum ada pengumuman aktif</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {announcements.map((item) => (
                    <AnnouncementItem key={item.id} item={item} />
                  ))}
                </div>
              )}

              {totalAnnouncements > PAGE_SIZE && (
              <div className="flex items-center justify-between px-2 pt-4">
                <p className="text-xs text-slate-500">
                  {totalAnnouncements > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalAnnouncements)} dari ${totalAnnouncements}` : ''}
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page - 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={16} />
                    </Link>
                  )}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-3">{page}</span>
                  {page * PAGE_SIZE < totalAnnouncements && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page + 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
}
