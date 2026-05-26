'use client'

import { useState } from 'react'
import { deleteAnnouncement, updateAnnouncement } from '@/app/dashboard/actions'
import {
  Trash2,
  User,
  Calendar,
  Edit3,
  Check,
  Megaphone
} from 'lucide-react'
import ConfirmModal from '@/components/ConfirmModal'

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  author: {
    name: string | null;
  };
}

interface AnnouncementItemProps {
  item: Announcement;
}

export default function AnnouncementItem({ item }: AnnouncementItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl border-2 border-blue-500/50 animate-in fade-in zoom-in-95 duration-300 transition-colors z-10 relative">
        <form action={updateAnnouncement} onSubmit={() => setIsEditing(false)} className="space-y-6">
          <input type="hidden" name="id" value={item.id} />
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 transition-colors">Judul</label>
            <input 
              name="title" 
              defaultValue={item.title} 
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1 transition-colors">Konten</label>
            <textarea 
              name="content" 
              defaultValue={item.content} 
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none transition-all" 
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95">
              <Check size={16} /> Simpan Perubahan
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
              Batal
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 group transition-all hover:shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
           <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight pr-8">{item.title}</h4>
           <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">
                 <User size={12} className="text-blue-500" />
                 {item.author.name}
              </div>
              <div className="h-1 w-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">
                 <Calendar size={12} className="text-blue-500" />
                 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all translate-x-0 md:translate-x-4 md:group-hover:translate-x-0">
          <button 
            onClick={() => setIsEditing(true)}
            aria-label="Edit pengumuman"
            className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all"
          >
            <Edit3 size={16} />
          </button>
          <form action={deleteAnnouncement}>
            <input type="hidden" name="id" value={item.id} />
            <button type="button" onClick={() => setShowDeleteModal(true)} aria-label="Hapus pengumuman" className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all">
              <Trash2 size={16} />
            </button>
          </form>
          <ConfirmModal
            open={showDeleteModal}
            title="Hapus Pengumuman"
            message="Hapus pengumuman ini?"
            confirmLabel="Ya, Hapus"
            variant="danger"
            onConfirm={() => { setShowDeleteModal(false); }}
            onCancel={() => setShowDeleteModal(false)}
          />
        </div>
      </div>

      <div className="relative">
         <p className="text-[13px] md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium transition-colors pl-4 border-l-2 border-slate-100 dark:border-slate-800">
           {item.content}
         </p>
      </div>

      <div className="absolute -right-8 -bottom-8 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
         <Megaphone size={160} />
      </div>
    </div>
  )
}
