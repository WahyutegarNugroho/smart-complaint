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
    <section id="announcements" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] md:text-xs font-bold text-brand-ink uppercase tracking-normal">Informasi Warga</h3>
        <Bell aria-hidden="true" size={16} className="text-blue-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {announcements.map((ann, index) => (
          <div key={ann.id} className={`p-5 md:p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] group ${index === 0 ? 'bg-brand-ink text-brand-canvas dark:bg-slate-900 dark:text-white border-transparent shadow-md' : 'bg-brand-canvas border-brand-hairline shadow-sm hover:shadow-md hover:border-brand-ink/20'}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="bg-brand-primary text-[#0e0f0c] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Terbaru
                    </span>
                  )}
                  <span className={`text-[10px] font-medium ${index === 0 ? 'text-brand-canvas/70 dark:text-slate-300' : 'text-brand-ink/60'}`}>
                    {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
              <h4 className={`font-bold text-lg mb-3 leading-tight ${index === 0 ? '' : 'text-brand-ink group-hover:text-brand-primary transition-colors'}`}>
                {ann.title}
              </h4>
              <p className={`text-sm line-clamp-3 leading-relaxed ${index === 0 ? 'text-brand-canvas/80 dark:text-slate-300' : 'text-brand-ink/70'}`}>
                &quot;{ann.content}&quot;
              </p>
            </div>
            <div className={`mt-5 pt-4 border-t ${index === 0 ? 'border-brand-canvas/10 dark:border-white/10' : 'border-brand-hairline'}`}>
              <button type="button" className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${index === 0 ? 'bg-brand-primary text-[#0e0f0c] hover:opacity-90 shadow-sm' : 'bg-brand-canvas-soft text-brand-ink hover:bg-brand-ink hover:text-brand-canvas dark:hover:bg-brand-primary dark:hover:text-[#0e0f0c] border border-brand-hairline'}`}>
                Lihat Detail Kegiatan
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

