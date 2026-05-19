import React from 'react'
import Link from 'next/link'
import { Search, Inbox, Camera, MapPin, ArrowRight, Zap } from 'lucide-react'
import prisma from '@/lib/prisma'
import EmptyState from '@/components/EmptyState'
import Image from 'next/image'
import { Status } from '@prisma/client'

interface ComplaintListSectionProps {
  profileId: string
  isWarga: boolean
  searchParams: {
    status?: string
    q?: string
    rt?: string
    rw?: string
    page?: string
  }
}

interface ComplaintWithAuthor {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  status: string
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
  author?: {
    name: string | null
  } | null
}

export default async function ComplaintListSection({ profileId, isWarga, searchParams }: ComplaintListSectionProps) {
  const { status: currentStatus, q: searchQuery, rt, rw, page } = searchParams
  const currentPage = Math.max(1, Number(page) || 1)
  const pageSize = 12

  const whereClause: { status?: Status; title?: { contains: string; mode: 'insensitive' }; authorId?: string; rt?: string; rw?: string } = {}
  
  // 🛡️ Validate Status Enum to prevent Prisma crash
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

  let complaints: ComplaintWithAuthor[] = []
  let totalComplaints = 0

  try {
    const [resComplaints, resTotal] = await Promise.all([
      prisma.complaint.findMany({
        where: whereClause,
        orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
        include: { author: true }, 
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
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-brand-ink uppercase italic">Riwayat Laporan</h2>
        </div>

        <div className="flex items-center gap-1 bg-brand-canvas-soft border border-brand-hairline p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
          <Link
            href={`/dashboard${searchQuery ? `?q=${searchQuery}` : ''}`}
            className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${!currentStatus ? 'bg-brand-canvas text-brand-ink shadow-sm border border-brand-hairline' : 'text-brand-ink/60 hover:text-brand-primary'}`}
          >
            Semua
          </Link>
          {[
            { id: 'PENDING', label: 'Menunggu' },
            { id: 'PROCESSING', label: 'Diproses' },
            { id: 'COMPLETED', label: 'Selesai' }
          ].map((t) => (
            <Link
              key={t.id}
              href={`/dashboard?status=${t.id}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                currentStatus === t.id 
                  ? 'bg-brand-canvas text-brand-ink shadow-sm border border-brand-hairline' 
                  : 'text-brand-ink/60 hover:text-brand-primary'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-ink/40 transition-colors group-focus-within:text-brand-primary" size={16} />
          <form action="/dashboard" method="GET">
            {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
            {rt && <input type="hidden" name="rt" value={rt} />}
            {rw && <input type="hidden" name="rw" value={rw} />}
            <input 
              name="q"
              type="text" 
              defaultValue={searchQuery}
              placeholder={isWarga ? "Cari laporan Anda..." : "Cari laporan warga..."}
              className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl pl-14 pr-4 py-4 text-sm font-medium text-brand-ink focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all shadow-sm"
            />
          </form>
        </div>
        {!isWarga && (
          <div className="lg:col-span-4 flex gap-3">
             <form className="flex gap-2 w-full" action="/dashboard" method="GET">
               {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
               {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
               <input name="rt" type="text" defaultValue={rt} placeholder="RT" className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-brand-primary text-brand-ink transition-all shadow-sm" />
               <input name="rw" type="text" defaultValue={rw} placeholder="RW" className="w-full bg-brand-canvas border border-brand-hairline rounded-2xl px-4 text-sm font-bold text-center outline-none focus:border-brand-primary text-brand-ink transition-all shadow-sm" />
               <button type="submit" className="px-6 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-brand-ink rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:opacity-90 transition-all cursor-pointer">
                  Filter
               </button>
             </form>
          </div>
        )}
      </div>

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
                <div className={`h-full bg-brand-canvas p-4 md:p-5 rounded-xl border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col gap-4 md:gap-5 relative overflow-hidden ${
                  item.isUrgent && item.status !== 'COMPLETED' 
                    ? 'border-red-100 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5' 
                    : 'border-brand-hairline hover:border-brand-primary/50'
                }`}>
                  
                  <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border transition-colors ${
                        item.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                        item.status === 'PROCESSING' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-amber-800' :
                        'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                      }`}>
                        {item.status === 'PENDING' ? 'Menunggu' : item.status === 'PROCESSING' ? 'Diproses' : 'Selesai'}
                      </span>
                      <div className="h-9 w-9 md:h-10 md:w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-ink/40 group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-brand-ink transition-all shadow-sm">
                        <Camera size={16} />
                      </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                      {item.imageUrl && (
                        <div className="h-32 md:h-40 w-full rounded-xl overflow-hidden mb-4 border border-brand-hairline relative">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      <h4 className="text-base md:text-lg font-bold tracking-tight text-brand-ink group-hover:text-brand-primary transition-colors leading-tight italic truncate pl-5">
                        {item.title}
                      </h4>
                      <p className={`text-[12px] md:text-[13px] text-brand-ink/75 font-medium leading-relaxed line-clamp-2 italic pl-5 border-l-2 border-brand-hairline transition-colors`}>
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
                            <p className="text-[10px] font-bold text-brand-ink uppercase truncate max-w-[100px] leading-tight mb-1">{item.author?.name || 'Anonim'}</p>
                          )}
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-brand-ink/80 font-bold text-[12px] uppercase tracking-wider transition-colors">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} /> RT {item.rt}/{item.rw}
                            </div>
                            <div className="h-1 w-1 rounded-full bg-brand-hairline hidden md:block" />
                            <span className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">
                              {dateStr}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-ink/20 group-hover:bg-brand-ink group-hover:text-brand-canvas transition-all duration-500 shadow-inner">
                        <ArrowRight size={18} />
                      </div>
                  </div>

                  {item.isUrgent && item.status !== 'COMPLETED' && (
                    <div className="absolute top-0 right-10">
                      <div className="bg-red-500 text-white px-3 md:px-4 py-1.5 rounded-b-xl shadow-lg flex items-center gap-2">
                          <Zap size={12} fill="currentColor" className="text-red-100" />
                          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white">Prioritas</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/dashboard?page=${i + 1}${currentStatus ? `&status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}${rt ? `&rt=${rt}` : ''}${rw ? `&rw=${rw}` : ''}`}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                currentPage === i + 1 
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl shadow-slate-900/10' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800 hover:border-slate-200'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
