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
        <Bell size={16} className="text-blue-500" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1">
          {announcements.slice(0, 1).map((ann) => (
            <div key={ann.id} className="p-5 md:p-6 rounded-xl border transition-all duration-300 bg-slate-900 text-white border-transparent h-full flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-brand-primary text-[#0e0f0c] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Terbaru</span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-3 leading-tight">{ann.title}</h4>
                <p className="text-sm line-clamp-2 leading-relaxed opacity-70">
                  &quot;{ann.content}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {announcements.slice(1, 3).map((ann) => (
            <div key={ann.id} className="p-5 md:p-6 rounded-xl border transition-all duration-300 bg-brand-canvas border-brand-hairline flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-medium text-brand-ink/40">
                    {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-3 leading-tight text-brand-ink">{ann.title}</h4>
                <p className="text-sm line-clamp-2 leading-relaxed text-brand-ink/70">
                  &quot;{ann.content}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

