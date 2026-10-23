import { Bell } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Announcement } from '@prisma/client'

export default async function AnnouncementsSection() {
  let announcements: Announcement[] = []
  try {
    announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    })
  } catch (err) {
    console.error('AnnouncementsSection Error:', err)
    return null; // Don't crash the whole dashboard if announcements fail
  }

  if (announcements.length === 0) return null

  return (
    <section id="announcements" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pengumuman & Kegiatan Warga</h3>
        <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
          <Bell aria-hidden="true" size={14} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((ann, index) => (
          <div 
            key={ann.id} 
            className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] group bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
              index === 0 
                ? 'border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-500/20' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="bg-blue-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Terbaru
                    </span>
                  )}
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-base md:text-lg mb-2 leading-snug text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                {ann.title}
              </h4>
              <p className="text-xs md:text-sm line-clamp-3 leading-relaxed text-slate-600 dark:text-slate-300">
                &quot;{ann.content}&quot;
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button" 
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[40px] flex items-center justify-center ${
                  index === 0 
                    ? 'bg-blue-800 hover:bg-blue-900 text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100'
                }`}
              >
                Lihat Detail Kegiatan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

