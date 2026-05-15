import React from 'react'
import Link from 'next/link'
import { Search, Inbox, Camera, MapPin, ArrowRight, Zap } from 'lucide-react'
import prisma from '@/lib/prisma'
import EmptyState from '@/components/EmptyState'
import Image from 'next/image'

interface ComplaintListSectionProps {
  profileId: string
  isWarga: boolean
  searchParams: {
    status?: string
    q?: string
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
    name: string
  }
}

export default async function ComplaintListSection({ profileId, isWarga, searchParams }: ComplaintListSectionProps) {
  const { status: currentStatus, q: searchQuery, page } = searchParams
  const currentPage = Number(page) || 1
  const pageSize = 12

  const whereClause: { status?: string; title?: { contains: string; mode: 'insensitive' }; authorId?: string } = {}
  if (currentStatus) whereClause.status = currentStatus
  if (searchQuery) whereClause.title = { contains: searchQuery, mode: 'insensitive' }
  if (isWarga) whereClause.authorId = profileId

  const [complaints, totalComplaints] = await Promise.all([
    prisma.complaint.findMany({
      where: whereClause,
      orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
      include: { author: !isWarga },
      take: pageSize,
      skip: (currentPage - 1) * pageSize
    }) as Promise<ComplaintWithAuthor[]>,
    prisma.complaint.count({ where: whereClause })
  ])

  const totalPages = Math.ceil(totalComplaints / pageSize)

  return (
    <section className="space-y-6 md:space-y-8 pt-4 md:pt-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Riwayat Laporan</h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto hide-scrollbar max-w-full">
          <Link
            href="/dashboard"
            className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${!currentStatus ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-500' : 'text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
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
              href={`/dashboard?status=${t.id}`}
              className={`px-4 md:px-6 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                currentStatus === t.id 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-500' 
                  : 'text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-600 transition-colors group-focus-within:text-blue-500" size={16} />
        <form>
          <input 
            name="q"
            type="text" 
            defaultValue={searchQuery}
            placeholder="Cari laporan Anda..." 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-sm font-medium dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </form>
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
          {complaints.map((item) => (
            <Link key={item.id} href={`/dashboard/complaint/${item.id}`} className="group h-full">
              <div className={`h-full bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col gap-4 md:gap-5 relative overflow-hidden ${
                item.isUrgent && item.status !== 'COMPLETED' 
                  ? 'border-red-100 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-400/30'
              }`}>
                
                <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border transition-colors ${
                      item.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                      item.status === 'PROCESSING' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                    }`}>
                      {item.status === 'PENDING' ? 'Menunggu' : item.status === 'PROCESSING' ? 'Diproses' : 'Selesai'}
                    </span>
                    <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-600 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <Camera size={16} />
                    </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                    {item.imageUrl && (
                      <div className="h-32 md:h-40 w-full rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 relative">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <h4 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight italic truncate pl-5">
                      {item.title}
                    </h4>
                    <p className={`text-[12px] md:text-[13px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-2 italic pl-5 border-l-2 border-slate-100 dark:border-slate-800 transition-colors`}>
                      &quot;{item.content}&quot;
                    </p>
                </div>

                <div className="mt-auto pt-4 md:pt-5 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[12px] uppercase tracking-wider transition-colors">
                          <MapPin size={12} /> RT {item.rt}/{item.rw}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-200 dark:text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500 shadow-inner">
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
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/dashboard?page=${i + 1}${currentStatus ? `&status=${currentStatus}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
