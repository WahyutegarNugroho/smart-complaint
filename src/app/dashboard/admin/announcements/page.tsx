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
  Megaphone,
  ChevronDown,
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">

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
                <ChevronLeft size={20} />
              </Link>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Siaran Informasi Publik
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Manajemen Pengumuman
              </h1>
              <span className="text-xs font-mono font-bold tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {totalAnnouncements} Pengumuman Terbit
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Siarkan berita penting, agenda kegiatan kerja bakti, dan peringatan darurat ke seluruh warga lingkungan.
            </p>
          </div>
        </header>

        {/* Success Toast */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-sm text-emerald-800 dark:text-emerald-300 shadow-sm" role="status">
            <Info size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-sm text-rose-700 dark:text-rose-300" role="alert">
            <p className="flex-1 font-medium">{error}</p>
            <Link
              href="/dashboard/admin/announcements"
              className="px-3.5 py-1.5 text-xs font-bold uppercase text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 rounded-lg hover:bg-rose-200 transition-colors"
            >
              Coba Lagi
            </Link>
          </div>
        )}

        {/* Main Content - asymmetric split: form (1/3) + list (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Create Form */}
          <section className="lg:col-span-5" aria-labelledby="create-heading">
            <h2 id="create-heading" className="sr-only">Buat Pengumuman Baru</h2>
            <form action={createAnnouncement} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4 sticky top-24">
              <header className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rilis Pengumuman Baru</h3>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Siaran Langsung ke Warga</p>
                </div>
              </header>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Judul Pengumuman
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    placeholder="Contoh: Jadwal Pelaksanaan Fogging DBD Wilayah RT 03"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="content" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Isi & Rincian Informasi
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    required
                    placeholder="Tuliskan tanggal, lokasi, instruksi, dan kontak narahubung yang perlu diketahui warga..."
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none font-medium transition-all leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Kategori Pengumuman
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      defaultValue="umum"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 pr-10 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer min-h-[44px]"
                    >
                      <option value="umum">Umum</option>
                      <option value="kegiatan">Kegiatan Lingkungan</option>
                      <option value="darurat">Peringatan Darurat</option>
                      <option value="kebersihan">Kerja Bakti & Kebersihan</option>
                      <option value="kesehatan">Posyandu & Kesehatan</option>
                      <option value="keagamaan">Kegiatan Keagamaan</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white min-h-[44px] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Send size={15} />
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </section>

          {/* Announcements List */}
          <section className="lg:col-span-7 space-y-4" aria-labelledby="list-heading">
            <header className="flex items-center justify-between pb-1">
              <h2 id="list-heading" className="text-base font-bold text-slate-900 dark:text-white">Daftar Pengumuman Aktif</h2>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                {totalAnnouncements} Total
              </span>
            </header>

            {announcements.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
                <Megaphone size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Belum ada pengumuman yang diterbitkan</p>
                <p className="text-xs text-slate-500">Gunakan formulir di samping untuk menyiarkan informasi baru ke warga.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {announcements.map((item) => (
                  <AnnouncementItem key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalAnnouncements > PAGE_SIZE && (
              <nav className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800" aria-label="Navigasi halaman">
                <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalAnnouncements)} dari {totalAnnouncements}
                </p>
                <div className="flex items-center gap-1.5">
                  {page > 1 && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page - 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft size={16} />
                    </Link>
                  )}
                  <span className="text-xs font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200 px-3" aria-current="page">
                    {page}
                  </span>
                  {page * PAGE_SIZE < totalAnnouncements && (
                    <Link
                      href={`/dashboard/admin/announcements?page=${page + 1}${successMessage ? `&message=${encodeURIComponent(successMessage)}` : ''}`}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight size={16} />
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