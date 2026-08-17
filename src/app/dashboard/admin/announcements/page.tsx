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
  category: string;
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
    <div className="min-h-screen bg-brand-canvas text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-9 w-9 bg-brand-canvas border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink/50 hover:text-brand-ink transition-colors shadow-sm" aria-label="Kembali ke dashboard">
                  <ChevronLeft size={18} />
               </Link>
               <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">Pusat Informasi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink">Manajemen Pengumuman</h1>
            <p className="text-brand-ink/60 font-medium text-sm md:text-base">Siarkan informasi penting dan berita terbaru ke seluruh warga perumahan.</p>
          </div>
        </section>

        {successMessage && (
          <div className="p-4 bg-positive text-white rounded-xl flex items-center gap-3 shadow-sm">
            <div className="h-8 w-8 bg-brand-canvas/20 rounded-lg flex items-center justify-center">
               <Info size={16} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Form Create */}
          <div className="lg:col-span-5">
             <div className="bg-brand-canvas p-5 md:p-6 rounded-xl shadow-sm border border-brand-hairline sticky top-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary border border-brand-hairline">
                      <Plus size={18} />
                   </div>
                   <div>
                      <h2 className="text-sm font-bold text-brand-ink leading-tight">Buat Baru</h2>
                      <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Rilis Pengumuman Warga</p>
                   </div>
                </div>

                <form action={createAnnouncement} className="space-y-4">
                   <div>
                      <label className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">Judul Informasi</label>
                      <input 
                        name="title" 
                        required 
                        placeholder="Contoh: Jadwal Fogging Rutin" 
                        className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-medium text-brand-ink placeholder:text-mute focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">Isi Pengumuman</label>
                      <textarea 
                        name="content" 
                        rows={6} 
                        required 
                        placeholder="Tuliskan detail pesan yang ingin disampaikan..." 
                        className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm text-brand-ink placeholder:text-mute focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none font-medium transition-all" 
                      />
                   </div>
                    <div>
                       <label className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">Kategori</label>
                       <select 
                         name="category" 
                         defaultValue="umum"
                         className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                       >
                         <option value="umum">Umum</option>
                         <option value="kegiatan">Kegiatan</option>
                         <option value="darurat">Darurat</option>
                         <option value="kebersihan">Kebersihan</option>
                         <option value="kesehatan">Kesehatan</option>
                         <option value="keagamaan">Keagamaan</option>
                       </select>
                    </div>
                    <button 
                    type="submit" 
                    className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                   >
                      <Send size={15} /> Terbitkan Informasi
                   </button>
                </form>
             </div>
          </div>

          {/* List Announcements */}
          <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-sm font-bold text-brand-ink">Arsip Pengumuman</h2>
                  <span className="text-[10px] font-mono tabular-nums font-semibold text-brand-ink/50 uppercase tracking-wider">{totalAnnouncements} Total</span>
              </div>

              {announcements.length === 0 ? (
                <div className="bg-brand-canvas rounded-xl p-14 text-center border border-dashed border-brand-hairline flex flex-col items-center justify-center">
                   <Megaphone size={32} className="text-brand-hairline mb-3" />
                   <p className="text-brand-ink/40 text-xs font-semibold uppercase tracking-wider">Belum ada pengumuman aktif</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <AnnouncementItem key={item.id} item={item} />
                  ))}
                </div>
              )}

              {totalAnnouncements > PAGE_SIZE && (
              <div className="flex items-center justify-between px-2 pt-4">
                <p className="text-xs font-mono tabular-nums text-brand-ink/50">
                  {totalAnnouncements > 0 ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalAnnouncements)} dari ${totalAnnouncements}` : ''}
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page - 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={15} />
                    </Link>
                  )}
                  <span className="text-xs font-mono tabular-nums font-bold text-brand-ink/60 px-3">{page}</span>
                  {page * PAGE_SIZE < totalAnnouncements && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page + 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight size={15} />
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

