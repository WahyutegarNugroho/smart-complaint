import { forbidden, redirect } from 'next/navigation'
import { getAdminPaginatedAnnouncements } from '@/lib/dal'
import { getCachedProfile } from '@/lib/profile'
import AnnouncementItem from './AnnouncementItem'
import CreateAnnouncementForm from './CreateAnnouncementForm'
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import SectionErrorFallback from '@/components/SectionErrorFallback'
import ErrorToast from '@/components/ErrorToast'
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Megaphone,
} from 'lucide-react'
import Link from 'next/link'

const PAGE_SIZE = 10

export default async function AdminAnnouncementsPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string; page?: string }>
}) {
  const { message: successMessage, error: queryError, page: pageStr } = await searchParams
  const parsedPage = Number.parseInt(pageStr || '1', 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  const authData = await getCachedProfile()
  if (authData.status === 'UNAUTHENTICATED') redirect('/login')
  if (authData.status === 'ERROR' || !authData.profile) {
    return <SessionErrorState error={authData.status === 'ERROR' ? authData.error : undefined} />
  }
  if (authData.profile.role !== 'ADMIN') {
    forbidden()
  }

  const { announcements, totalAnnouncements, error: dalError } = await getAdminPaginatedAnnouncements(page, PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      {queryError && <ErrorToast message={queryError} />}

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

        {/* Main Content - asymmetric split: form (1/3) + list (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Create Form */}
          <section className="lg:col-span-5" aria-labelledby="create-heading">
            <h2 id="create-heading" className="sr-only">Buat Pengumuman Baru</h2>
            <CreateAnnouncementForm />
          </section>

          {/* Announcements List */}
          <section className="lg:col-span-7 space-y-4" aria-labelledby="list-heading">
            <header className="flex items-center justify-between pb-1">
              <h2 id="list-heading" className="text-base font-bold text-slate-900 dark:text-white">Daftar Pengumuman Aktif</h2>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                {totalAnnouncements} Total
              </span>
            </header>

            {dalError ? (
              <SectionErrorFallback
                title="Daftar pengumuman gagal dimuat"
                message={dalError}
              />
            ) : announcements.length === 0 ? (
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