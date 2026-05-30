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

const CATEGORY_STYLES: Record<string, { label: string; cls: string }> = {
  umum: { label: 'Umum', cls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
  kegiatan: { label: 'Kegiatan', cls: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' },
  darurat: { label: 'Darurat', cls: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
  kebersihan: { label: 'Kebersihan', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
  kesehatan: { label: 'Kesehatan', cls: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800' },
  keagamaan: { label: 'Keagamaan', cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
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
      <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl shadow-lg border-2 border-brand-primary/50 animate-in fade-in zoom-in-95 duration-300 transition-colors z-10 relative">
        <form action={updateAnnouncement} onSubmit={() => setIsEditing(false)} className="space-y-6">
          <input type="hidden" name="id" value={item.id} />
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal ml-1 transition-colors">Judul</label>
            <input 
              name="title" 
              defaultValue={item.title} 
              autoFocus
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl px-5 py-3.5 text-sm font-bold text-brand-ink focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal ml-1 transition-colors">Konten</label>
            <textarea 
              name="content" 
              defaultValue={item.content} 
              rows={5}
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl px-5 py-3.5 text-xs font-medium text-brand-ink focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none resize-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal ml-1 transition-colors">Kategori</label>
            <select 
              name="category" 
              defaultValue={item.category || 'umum'}
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-xl px-5 py-3.5 text-sm font-bold text-brand-ink focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all appearance-none"
            >
              <option value="umum">Umum</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="darurat">Darurat</option>
              <option value="kebersihan">Kebersihan</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="keagamaan">Keagamaan</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="flex-1 bg-brand-ink text-brand-canvas py-4 rounded-xl text-[10px] font-semibold uppercase tracking-normal flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg active:scale-95">
              <Check size={16} /> Simpan Perubahan
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-brand-canvas-soft text-brand-ink/50 py-4 rounded-xl text-[10px] font-semibold uppercase tracking-normal hover:bg-brand-canvas transition-all active:scale-95">
              Batal
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-brand-canvas p-6 md:p-8 rounded-3xl border border-brand-hairline group transition-all hover:shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
            <h4 className="text-xl md:text-2xl font-bold text-brand-ink group-hover:text-brand-primary transition-colors leading-tight pr-8">{item.title}</h4>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={"text-[9px] font-semibold uppercase tracking-normal px-2 py-0.5 rounded-lg border " + (CATEGORY_STYLES[item.category]?.cls || CATEGORY_STYLES.umum.cls)}>
                {CATEGORY_STYLES[item.category]?.label || 'Umum'}
              </span>
            </div>
           <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal transition-colors">
                 <User size={12} className="text-brand-primary" />
                 {item.author.name}
              </div>
              <div className="h-1 w-1 bg-brand-hairline rounded-full"></div>
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-brand-ink/50 uppercase tracking-normal transition-colors">
                 <Calendar size={12} className="text-brand-primary" />
                 {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all translate-x-0 md:translate-x-4 md:group-hover:translate-x-0">
          <button 
            onClick={() => setIsEditing(true)}
            aria-label="Edit pengumuman"
            className="h-10 w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-ink/50 hover:text-brand-primary border border-transparent hover:border-brand-primary/30 transition-all"
          >
            <Edit3 size={16} />
          </button>
          <form action={deleteAnnouncement}>
            <input type="hidden" name="id" value={item.id} />
            <button type="button" onClick={() => setShowDeleteModal(true)} aria-label="Hapus pengumuman" className="h-10 w-10 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-ink/50 hover:text-negative border border-transparent hover:border-negative/30 transition-all">
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
         <p className="text-[13px] md:text-sm text-brand-ink/70 leading-relaxed whitespace-pre-wrap font-medium transition-colors pl-4 border-l-2 border-brand-hairline">
           {item.content}
         </p>
      </div>

      <div className="absolute -right-8 -bottom-8 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
         <Megaphone size={160} />
      </div>
    </div>
  )
}

