import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { createAnnouncement } from '@/app/dashboard/actions'
import AnnouncementItem from './AnnouncementItem'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Send,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  createdAt: Date | string
  author: {
    name: string | null
  }
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

    const whereClause: Prisma.AnnouncementWhereInput = {}

    const [fetchedAnnouncements, fetchedTotal] = await Promise.all([
      prisma.announcement.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { author: true },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE
      }),
      prisma.announcement.count({ where: whereClause })
    ])

    announcements = fetchedAnnouncements
    totalAnnouncements = fetchedTotal
  } catch (err) {
    console.error('AdminAnnouncementsPage Data Error:', err)
    error = 'Gagal memuat daftar pengumuman. Silakan coba lagi.'
  }

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-20">

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">

        {/* Header - compact */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="h-9 w-9 bg-brand-canvas border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-colors shadow-sm"
              aria-label="Kembali ke dashboard"
            >
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-brand-ink">Manajemen Pengumuman</h1>
              <p className="text-xs text-brand-ink/50 font-medium">Siarkan informasi penting dan berita ke seluruh warga.</p>
            </div>
          </div>
        </header>

        {/* Success Toast */}
        {successMessage && (
          <div className="flex items-center gap-3 p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-sm text-brand-primary" role="status">
            <Info size={16} className="shrink-0" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

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

        {/* Main Content - asymmetric split: form (1/3) + list (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Form - single surface, no nested cards */}
          <section className="lg:col-span-1" aria-labelledby="create-heading">
            <h2 id="create-heading" className="sr-only">Buat Pengumuman Baru</h2>
            <form action={createAnnouncement} className="bg-brand-canvas rounded-xl border border-brand-hairline shadow-sm p-4 md:p-5 space-y-4 sticky top-24">
              <header className="flex items-center gap-2 border-b border-brand-hairline pb-3">
                <div className="h-8 w-8 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary border border-brand-hairline">
                  <Plus size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-ink">Buat Baru</p>
                  <p className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Rilis Pengumuman</p>
                </div>
              </header>

              <div className="space-y-3">
                <div>
                  <label htmlFor="title" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">
                    Judul Informasi
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="Contoh: Jadwal Fogging Rutin"
                    className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all h-10"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">
                    Isi Pengumuman
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    required
                    placeholder="Tuliskan detail pesan yang ingin disampaikan..."
                    className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue="umum"
                    className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none h-10"
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
                  className="w-full bg-brand-ink text-brand-canvas py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer h-10"
                >
                  <Send size={14} />
                  Terbitkan
                </button>
              </div>
            </form>
          </section>

          {/* Announcements List */}
          <section className="lg:col-span-2 space-y-4" aria-labelledby="list-heading">
            <header className="flex items-center justify-between">
              <h2 id="list-heading" className="text-sm font-bold text-brand-ink">Arsip Pengumuman</h2>
              <span className="text-[10px] font-mono tabular-nums font-semibold text-brand-ink/50 uppercase tracking-wider">{totalAnnouncements} Total</span>
            </header>

            {announcements.length === 0 ? (
              <div className="bg-brand-canvas rounded-xl border border-brand-hairline p-8 text-center">
                <p className="text-sm font-semibold text-brand-ink/60 mb-2">Belum ada pengumuman</p>
                <p className="text-xs text-brand-ink/40 mb-4">Buat pengumuman pertama menggunakan formulir di samping</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((item) => (
                  <AnnouncementItem key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination - inline */}
            {totalAnnouncements > PAGE_SIZE && (
              <nav className="flex items-center justify-between pt-2 border-t border-brand-hairline" aria-label="Navigasi halaman">
                <p className="text-xs font-mono tabular-nums text-brand-ink/40">
                  {totalAnnouncements > 0
                    ? `Menampilkan ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, totalAnnouncements)} dari ${totalAnnouncements}`
                    : 'Tidak ada data'}
                </p>
                <div className="flex items-center gap-1">
                  {page > 1 && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page - 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={14} />
                    </Link>
                  )}
                  <span className="text-xs font-mono tabular-nums font-bold text-brand-ink/60 px-3" aria-current="page">{page}</span>
                  {page * PAGE_SIZE < totalAnnouncements && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page + 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </section>
        </div>

      </main>
    </div>
  )
}