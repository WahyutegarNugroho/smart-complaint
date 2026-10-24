import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Inbox, MapPin, Zap, Filter, ChevronDown } from 'lucide-react'
import { getComplaintList } from '@/lib/dal'
import EmptyState from '@/components/EmptyState'
import PageSizeSelector from './PageSizeSelector'
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '@/lib/constants'

function buildPaginationUrl(page: number, params: {
  currentStatus?: string, searchQuery?: string, categoryFilter?: string,
  fromDate?: string, toDate?: string, rt?: string, rw?: string, pageSize?: number
}, basePageSize: number): string {
  const p = new URLSearchParams()
  if (page > 1) p.set('page', String(page))
  if (params.currentStatus) p.set('status', params.currentStatus)
  if (params.searchQuery) p.set('q', params.searchQuery)
  if (params.categoryFilter) p.set('category', params.categoryFilter)
  if (params.fromDate) p.set('fromDate', params.fromDate)
  if (params.toDate) p.set('toDate', params.toDate)
  if (params.rt) p.set('rt', params.rt)
  if (params.rw) p.set('rw', params.rw)
  if (params.pageSize && params.pageSize !== basePageSize) p.set('pageSize', String(params.pageSize))
  const qs = p.toString()
  return `/dashboard${qs ? `?${qs}` : ''}`
}

interface ComplaintListSectionProps {
  profileId: string
  isWarga: boolean
  searchParams: {
    status?: string
    q?: string
    rt?: string
    rw?: string
    page?: string
    category?: string
    fromDate?: string
    toDate?: string
    pageSize?: string
  }
}

export default async function ComplaintListSection({ profileId, isWarga, searchParams }: ComplaintListSectionProps) {
  const { status: currentStatus, q: searchQuery, rt, rw, category: categoryFilter, fromDate, toDate, pageSize: rawPageSize } = searchParams

  const {
    complaints,
    totalComplaints,
    totalPages,
    currentPage,
    pageSize,
    categoryOptions,
  } = await getComplaintList({ profileId, isWarga, searchParams })

  return (
    <section className="space-y-6 pt-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {isWarga ? 'Riwayat Laporan Anda' : 'Daftar Penanganan Laporan'}
          </h2>
          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {totalComplaints} total
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
          {(() => {
            const baseParams = new URLSearchParams()
            if (searchQuery) baseParams.set('q', searchQuery)
            if (categoryFilter) baseParams.set('category', categoryFilter)
            if (rt) baseParams.set('rt', rt)
            if (rw) baseParams.set('rw', rw)
            if (fromDate) baseParams.set('fromDate', fromDate)
            if (toDate) baseParams.set('toDate', toDate)
            if (rawPageSize) baseParams.set('pageSize', rawPageSize)
            const qs = baseParams.toString()
            const prefix = qs ? `?${qs}` : ''
            return (
              <>
                <Link 
                  href={`/dashboard${prefix}`} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    !currentStatus 
                      ? 'bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Semua
                </Link>
                {[
                  { id: 'PENDING', label: 'Menunggu' },
                  { id: 'PROCESSING', label: 'Diproses' },
                  { id: 'COMPLETED', label: 'Selesai' }
                ].map((t) => {
                  const p = new URLSearchParams(baseParams)
                  p.set('status', t.id)
                  return (
                    <Link
                      key={t.id}
                      href={`/dashboard?${p.toString()}`}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        currentStatus === t.id 
                          ? 'bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {t.label}
                    </Link>
                  )
                })}
              </>
            )
          })()}
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8 relative group">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
          <form action="/dashboard" method="GET">
            {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            {rt && <input type="hidden" name="rt" value={rt} />}
            {rw && <input type="hidden" name="rw" value={rw} />}
            {fromDate && <input type="hidden" name="fromDate" value={fromDate} />}
            {toDate && <input type="hidden" name="toDate" value={toDate} />}
            {rawPageSize && <input type="hidden" name="pageSize" value={rawPageSize} />}
            <input 
              name="q"
              type="text" 
              defaultValue={searchQuery}
              placeholder={isWarga ? "Cari berdasarkan judul atau kendala laporan Anda..." : "Cari laporan warga..."}
              aria-label="Cari laporan"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </form>
        </div>
        {!isWarga && (
          <div className="lg:col-span-4 flex gap-2">
            <form className="flex gap-2 w-full" action="/dashboard" method="GET">
              {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
              {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              {fromDate && <input type="hidden" name="fromDate" value={fromDate} />}
              {toDate && <input type="hidden" name="toDate" value={toDate} />}
              {rawPageSize && <input type="hidden" name="pageSize" value={rawPageSize} />}
              <input 
                name="rt" 
                type="text" 
                defaultValue={rt} 
                placeholder="RT" 
                aria-label="Filter RT" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 min-h-[44px] text-sm font-mono font-bold text-center outline-none focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
              />
              <input 
                name="rw" 
                type="text" 
                defaultValue={rw} 
                placeholder="RW" 
                aria-label="Filter RW" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 min-h-[44px] text-sm font-mono font-bold text-center outline-none focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
              />
              <button 
                type="submit" 
                className="px-5 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] shrink-0"
              >
                Filter
              </button>
            </form>
          </div>
        )}
      </div>

      {/* EXTRA FILTERS: Category + Date Range */}
      <form action="/dashboard" method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 p-3 bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80 items-end">
        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
        {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
        {rt && <input type="hidden" name="rt" value={rt} />}
        {rw && <input type="hidden" name="rw" value={rw} />}
        {rawPageSize && <input type="hidden" name="pageSize" value={rawPageSize} />}
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Kategori Sektor</label>
          <div className="relative">
            <select name="category" defaultValue={categoryFilter || ''} aria-label="Filter kategori" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 pr-9 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <option value="">Semua Kategori</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
        <div className="sm:col-span-1 lg:col-span-3">
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Dari Tanggal</label>
          <input name="fromDate" type="date" defaultValue={fromDate || ''} aria-label="Dari tanggal" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" />
        </div>
        <div className="sm:col-span-1 lg:col-span-3">
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Sampai Tanggal</label>
          <input name="toDate" type="date" defaultValue={toDate || ''} aria-label="Sampai tanggal" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" />
        </div>
        <div className="sm:col-span-2 lg:col-span-2 flex items-center gap-2">
          <button type="submit" className="w-full sm:w-auto flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[36px]">
            <Filter aria-hidden="true" size={13} /> Terapkan Filter
          </button>
          {(categoryFilter || fromDate || toDate) && (
            <a href={`/dashboard${currentStatus ? `?status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg min-h-[36px] flex items-center justify-center">
              Reset
            </a>
          )}
        </div>
      </form>

      {/* REPORT TABLE - Dense list layout with column headers (not card grid) */}
      {complaints.length === 0 ? (
        isWarga && !currentStatus && !searchQuery ? (
          <EmptyState 
            icon={Inbox}
            title="Belum Ada Laporan"
            description="Anda belum mengirimkan laporan apa pun. Sampaikan kendala lingkungan Anda sekarang."
            actionHref="/dashboard/create"
            actionLabel="Buat Laporan Baru"
          />
        ) : (
          <EmptyState 
            icon={Inbox}
            title="Tidak Ada Hasil"
            description="Belum ada laporan yang sesuai dengan kriteria filter Anda."
            actionHref="/dashboard"
            actionLabel="Reset Filter"
          />
        )
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-sm">
          {/* Column Headers */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <span>Judul Aduan</span>
            <span>Kategori</span>
            <span>Status</span>
            <span>Lokasi</span>
            <span className="text-right">Aksi</span>
          </div>

          {complaints.map((item) => {
            const date = new Date(item.createdAt)
            const dateStr = isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            
            return (
              <Link key={item.id} href={`/dashboard/complaint/${item.id}`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset block">
                <div className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 px-5 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                  item.isUrgent && item.status !== 'COMPLETED' 
                    ? 'bg-red-50/20 dark:bg-red-950/10' 
                    : ''
                }`}>
                  
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.imageUrl ? (
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 relative">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-400 flex-shrink-0">
                        <Inbox size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed truncate mt-0.5">
                        &quot;{item.content}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50">
                      {item.categoryRel?.name || item.category}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border transition-colors ${STATUS_BADGE_CLASSES[item.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                      {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono tabular-nums text-xs font-semibold">
                    <MapPin aria-hidden="true" size={13} className="text-slate-400" /> RT {item.rt}/{item.rw}
                  </div>

                  <div className="hidden md:flex items-center justify-end gap-3">
                    <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {dateStr}
                    </span>
                    <span className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-blue-800 group-hover:border-blue-800 group-hover:text-white transition-all">
                      Lihat Rincian
                    </span>
                  </div>

                  {/* Mobile footer row */}
                  <div className="flex md:hidden items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border ${STATUS_BADGE_CLASSES[item.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                        {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                      </span>
                      <span className="text-xs font-mono tabular-nums font-medium">RT {item.rt}/{item.rw}</span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">{dateStr}</span>
                    </div>
                    {item.isUrgent && item.status !== 'COMPLETED' && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-xs">
                        <Zap aria-hidden="true" size={12} fill="currentColor" />
                        <span>Prioritas</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination with Enhancement */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Tampilkan</span>
          <PageSizeSelector
            currentStatus={currentStatus}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            fromDate={fromDate}
            toDate={toDate}
            rt={rt}
            rw={rw}
            pageSize={pageSize}
          />
          <span className="text-xs font-medium text-slate-500">per halaman</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Previous */}
            {currentPage > 1 && (
              <Link
                href={buildPaginationUrl(currentPage - 1, { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize }, 12)}
                className="h-10 px-4 rounded-xl flex items-center justify-center text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
                aria-label="Halaman sebelumnya"
              >
                ← Sebelumnya
              </Link>
            )}

            {/* Page numbers with truncation */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              const isFirst = pageNum === 1
              const isLast = pageNum === totalPages
              const isNear = Math.abs(pageNum - currentPage) <= 1
              const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3
              const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2

              if (!isFirst && !isLast && !isNear) {
                if (showEllipsisBefore || showEllipsisAfter) {
                  return <span key={i} className="text-slate-400 font-bold text-xs px-1">...</span>
                }
                return null
              }

              return (
                <Link
                  key={i}
                  href={buildPaginationUrl(pageNum, { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize }, 12)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px] min-w-[44px] ${
                    currentPage === pageNum
                      ? 'bg-blue-800 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}

            {/* Next */}
            {currentPage < totalPages && (
              <Link
                href={buildPaginationUrl(currentPage + 1, { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize }, 12)}
                className="h-10 px-4 rounded-xl flex items-center justify-center text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
              >
                Selanjutnya →
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

