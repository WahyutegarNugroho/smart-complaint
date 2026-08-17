import React from 'react'
import Link from 'next/link'
import { Search, Inbox, Camera, MapPin, ArrowRight, Zap, Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import EmptyState from '@/components/EmptyState'
import Image from 'next/image'
import { Prisma, Status } from '@prisma/client'
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

interface ComplaintWithAuthor {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  status: string
  category: string
  categoryRel?: { name: string } | null
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
  author?: {
    name: string | null
  } | null
}

export default async function ComplaintListSection({ profileId, isWarga, searchParams }: ComplaintListSectionProps) {
  const { status: currentStatus, q: searchQuery, rt, rw, page, category: categoryFilter, fromDate, toDate, pageSize: rawPageSize } = searchParams
  const currentPage = Math.max(1, Number(page) || 1)
  const pageSize = [12, 24, 48].includes(Number(rawPageSize)) ? Number(rawPageSize) : 12

  const whereClause: Prisma.ComplaintWhereInput = {}
  
  if (currentStatus) {
    const validStatuses = Object.values(Status)
    if (validStatuses.includes(currentStatus as Status)) {
      whereClause.status = currentStatus as Status
    }
  }

  if (searchQuery) whereClause.title = { contains: searchQuery, mode: 'insensitive' }
  if (rt) whereClause.rt = rt
  if (rw) whereClause.rw = rw
  if (isWarga && profileId) whereClause.authorId = profileId
  if (categoryFilter) whereClause.category = categoryFilter
  if (fromDate || toDate) {
    const createdAt: Record<string, Date> = {}
    if (fromDate) createdAt.gte = new Date(fromDate)
    if (toDate) createdAt.lte = new Date(toDate + 'T23:59:59.999Z')
    whereClause.createdAt = createdAt
  }

  let complaints: ComplaintWithAuthor[] = []
  let totalComplaints = 0
  let categoryOptions: { id: string; name: string; slug: string }[] = []

  try {
    categoryOptions = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
    })

    const [resComplaints, resTotal] = await Promise.all([
      prisma.complaint.findMany({
        where: whereClause,
        orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
        include: { author: true, categoryRel: { select: { name: true } } }, 
        take: pageSize,
        skip: (currentPage - 1) * pageSize
      }),
      prisma.complaint.count({ where: whereClause })
    ])
    complaints = resComplaints as ComplaintWithAuthor[]
    totalComplaints = resTotal
  } catch (err) {
    console.error('ComplaintListSection Error:', err)
  }

  const totalPages = Math.ceil(totalComplaints / pageSize)

  return (
    <section className="space-y-6 md:space-y-8 pt-4 md:pt-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-brand-ink uppercase">Riwayat Laporan</h2>
        </div>

        <div className="flex items-center gap-1 bg-brand-canvas-soft border border-brand-hairline p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
          {(() => {
            const baseParams = new URLSearchParams()
            if (searchQuery) baseParams.set('q', searchQuery)
            if (categoryFilter) baseParams.set('category', categoryFilter)
            if (rt) baseParams.set('rt', rt)
            if (rw) baseParams.set('rw', rw)
            if (fromDate) baseParams.set('fromDate', fromDate)
            if (toDate) baseParams.set('toDate', toDate)
            const qs = baseParams.toString()
            const prefix = qs ? `?${qs}` : ''
            return (
              <>
                <Link href={`/dashboard${prefix}`} className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-normal transition-all whitespace-nowrap ${!currentStatus ? 'bg-brand-canvas text-brand-ink shadow-sm border border-brand-hairline' : 'text-brand-ink/60 hover:text-brand-primary'}`}>
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
                      className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-normal transition-all whitespace-nowrap ${currentStatus === t.id ? 'bg-brand-canvas text-brand-ink shadow-sm border border-brand-hairline' : 'text-brand-ink/60 hover:text-brand-primary'}`}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/40 transition-colors group-focus-within:text-brand-primary" size={16} />
          <form action="/dashboard" method="GET">
            {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            {rt && <input type="hidden" name="rt" value={rt} />}
            {rw && <input type="hidden" name="rw" value={rw} />}
            {fromDate && <input type="hidden" name="fromDate" value={fromDate} />}
            {toDate && <input type="hidden" name="toDate" value={toDate} />}
            <input 
              name="q"
              type="text" 
              defaultValue={searchQuery}
              placeholder={isWarga ? "Cari laporan Anda..." : "Cari laporan warga..."}
              aria-label="Cari laporan"
              className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl pl-14 pr-4 py-4 text-sm font-medium text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all shadow-sm"
            />
          </form>
        </div>
        {!isWarga && (
          <div className="lg:col-span-4 flex gap-3">
             <form className="flex gap-2 w-full" action="/dashboard" method="GET">
               {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
               {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
               <input name="rt" type="text" defaultValue={rt} placeholder="RT" aria-label="Filter RT" className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-brand-primary text-brand-ink transition-all shadow-sm" />
                <input name="rw" type="text" defaultValue={rw} placeholder="RW" aria-label="Filter RW" className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-brand-primary text-brand-ink transition-all shadow-sm" />
               <button type="submit" className="px-6 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-brand-ink rounded-2xl text-[10px] font-semibold uppercase tracking-normal shadow-sm hover:opacity-90 transition-all cursor-pointer">
                  Filter
               </button>
             </form>
          </div>
        )}
      </div>

      {/* EXTRA FILTERS: Category + Date Range */}
      <form action="/dashboard" method="GET" className="flex flex-wrap items-end gap-3">
        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
        {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
        {rt && <input type="hidden" name="rt" value={rt} />}
        {rw && <input type="hidden" name="rw" value={rw} />}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1.5 ml-1">Kategori</label>
          <select name="category" defaultValue={categoryFilter || ''} aria-label="Filter kategori" className="w-full bg-brand-canvas border border-brand-hairline rounded-xl px-4 py-3 text-sm font-bold text-brand-ink outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer">
            <option value="">Semua Kategori</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1.5 ml-1">Dari Tanggal</label>
          <input name="fromDate" type="date" defaultValue={fromDate || ''} aria-label="Dari tanggal" className="w-full bg-brand-canvas border border-brand-hairline rounded-xl px-4 py-3 text-sm font-bold text-brand-ink outline-none focus:border-brand-primary transition-all" />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal mb-1.5 ml-1">Sampai Tanggal</label>
          <input name="toDate" type="date" defaultValue={toDate || ''} aria-label="Sampai tanggal" className="w-full bg-brand-canvas border border-brand-hairline rounded-xl px-4 py-3 text-sm font-bold text-brand-ink outline-none focus:border-brand-primary transition-all" />
        </div>
        <button type="submit" className="px-5 py-3 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-brand-ink rounded-xl text-[10px] font-semibold uppercase tracking-normal shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
          <Filter size={14} /> Terapkan
        </button>
        {(categoryFilter || fromDate || toDate) && (
          <a href={`/dashboard${currentStatus ? `?status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-brand-ink/50 hover:text-brand-ink transition-all">
            Reset
          </a>
        )}
      </form>

      {/* REPORT GRID */}
      {complaints.length === 0 ? (
        <EmptyState 
          icon={Inbox}
          title="Laporan Kosong"
          description="Belum ada laporan yang sesuai dengan kriteria filter Anda."
          actionHref={(currentStatus || searchQuery) ? "/dashboard" : undefined}
          actionLabel="Reset Filter"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
          {complaints.map((item) => {
            const date = new Date(item.createdAt)
            const dateStr = isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
            
            return (
              <Link key={item.id} href={`/dashboard/complaint/${item.id}`} className="group h-full">
                <div className={`h-full bg-brand-canvas p-4 md:p-5 rounded-xl border flex flex-col gap-4 md:gap-5 relative overflow-hidden ${
                  item.isUrgent && item.status !== 'COMPLETED' 
                    ? 'border-red-100 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5' 
                    : 'border-brand-hairline hover:border-brand-primary/50 transition-colors'
                }`}>
                  
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg uppercase tracking-normal border transition-colors ${STATUS_BADGE_CLASSES[item.status as keyof typeof STATUS_BADGE_CLASSES] || STATUS_BADGE_CLASSES.PENDING}`}>
                          {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || 'Menunggu'}
                        </span>
                        <span className="text-[9px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-brand-hairline text-brand-ink/50 bg-brand-canvas-soft/50">
                          {item.categoryRel?.name || item.category}
                        </span>
                      </div>
                      <div className="h-9 w-9 md:h-10 md:w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-ink/40 border border-brand-hairline">
                        <Camera size={16} />
                      </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                      {item.imageUrl && (
                        <div className="h-32 md:h-40 w-full rounded-xl overflow-hidden mb-4 border border-brand-hairline relative">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      <h4 className="text-base md:text-lg font-bold tracking-tight text-brand-ink group-hover:text-brand-primary transition-colors leading-tight truncate pl-5">
                        {item.title}
                      </h4>
                      <p className={`text-[12px] md:text-[13px] text-brand-ink/75 font-medium leading-relaxed line-clamp-2 pl-5 border-l-2 border-brand-hairline transition-colors`}>
                        &quot;{item.content}&quot;
                      </p>
                  </div>

                  <div className="mt-auto pt-4 md:pt-5 border-t border-brand-hairline flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2 md:gap-3">
                        {!isWarga && (
                          <div className="h-8 w-8 md:h-9 md:w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/40 font-bold text-[10px] uppercase">
                            {(item.author?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          {!isWarga && (
                            <p className="text-[10px] font-semibold text-brand-ink uppercase truncate max-w-[100px] leading-tight mb-1">{item.author?.name || 'Anonim'}</p>
                          )}
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-brand-ink/80 font-bold text-[12px] uppercase tracking-wider transition-colors">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} /> RT {item.rt}/{item.rw}
                            </div>
                            <div className="h-1 w-1 rounded-full bg-brand-hairline hidden md:block" />
                            <span className="text-[11px] font-semibold text-brand-ink/40 uppercase tracking-normal">
                              {dateStr}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-ink/20 group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-[#0e0f0c] transition-all duration-500 shadow-inner">
                        <ArrowRight size={18} />
                      </div>
                  </div>

                  {item.isUrgent && item.status !== 'COMPLETED' && (
                    <div className="absolute top-0 right-6">
                      <div className="bg-red-500 text-white px-3 md:px-4 py-1.5 rounded-b-xl shadow-lg flex items-center gap-2">
                          <Zap size={12} fill="currentColor" className="text-red-100" />
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-normal text-white">Prioritas</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* 📄 Pagination with Enhancement */}
      <div className="mt-16 flex flex-col items-center gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal">Tampilkan</span>
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
          <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal">per halaman</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Previous */}
            {currentPage > 1 && (
              <Link
                href={buildPaginationUrl(currentPage - 1, { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize }, 12)}
                className="h-12 px-4 rounded-2xl flex items-center justify-center text-xs font-bold bg-brand-canvas text-brand-ink/50 border border-brand-hairline hover:border-brand-ink/20 transition-all gap-1.5"
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
                  return <span key={i} className="text-brand-ink/30 font-bold text-xs px-1">...</span>
                }
                return null
              }

              return (
                <Link
                  key={i}
                  href={buildPaginationUrl(pageNum, { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize }, 12)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                    currentPage === pageNum
                        ? 'bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] shadow-xl'
                        : 'bg-brand-canvas text-brand-ink/40 border border-brand-hairline hover:border-brand-ink/20'
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
                className="h-12 px-4 rounded-2xl flex items-center justify-center text-xs font-bold bg-brand-canvas text-brand-ink/50 border border-brand-hairline hover:border-brand-ink/20 transition-all gap-1.5"
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

