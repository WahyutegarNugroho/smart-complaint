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
        <h3 className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Informasi Warga</h3>
        <Bell size={16} className="text-blue-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {announcements.map((ann, idx) => (
          <div key={ann.id} className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 ${idx === 0 ? 'bg-slate-900 text-white border-transparent' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">
                {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h4 className="font-bold text-lg mb-3 leading-tight">{ann.title}</h4>
            <p className="text-sm line-clamp-2 leading-relaxed opacity-70 italic">
              &quot;{ann.content}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
