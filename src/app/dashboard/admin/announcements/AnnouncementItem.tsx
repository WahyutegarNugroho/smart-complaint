'use client'

import { useState } from 'react'
import { deleteAnnouncement, updateAnnouncement } from '@/app/dashboard/actions'
import {
  Trash2,
  User,
  Calendar,
  Edit3,
  Check
} from 'lucide-react'
import ConfirmModal from '@/components/ConfirmModal'

const CATEGORY_STYLES: Record<string, { label: string; cls: string }> = {
  umum: { label: 'Umum', cls: 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline' },
  kegiatan: { label: 'Kegiatan', cls: 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline' },
  darurat: { label: 'Darurat', cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  kebersihan: { label: 'Kebersihan', cls: 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline' },
  kesehatan: { label: 'Kesehatan', cls: 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline' },
  keagamaan: { label: 'Keagamaan', cls: 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline' },
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
      <div className="bg-brand-canvas p-4 md:p-6 rounded-xl border border-brand-primary/50 shadow-sm">
        <form action={updateAnnouncement} onSubmit={() => setIsEditing(false)} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Judul</label>
            <input 
              name="title" 
              defaultValue={item.title} 
              autoFocus
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Konten</label>
            <textarea 
              name="content" 
              defaultValue={item.content} 
              rows={5}
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none transition-all" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Kategori</label>
            <select 
              name="category" 
              defaultValue={item.category || 'umum'}
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-4 py-2.5 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
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
            <button type="submit" className="flex-1 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
              <Check size={15} /> Simpan Perubahan
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 bg-brand-canvas-soft text-brand-ink/50 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-brand-hairline/50 transition-colors cursor-pointer">
              Batal
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-brand-canvas p-4 md:p-6 rounded-xl border border-brand-hairline">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 min-w-0">
            <h4 className="text-base md:text-lg font-bold text-brand-ink leading-snug">{item.title}</h4>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={"text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border " + (CATEGORY_STYLES[item.category]?.cls || CATEGORY_STYLES.umum.cls)}>
                {CATEGORY_STYLES[item.category]?.label || 'Umum'}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-ink/50">
                 <User size={12} />
                 {item.author.name}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-brand-ink/50">
                 <Calendar size={12} />
                 <span className="font-mono tabular-nums">
                   {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                 </span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsEditing(true)}
            aria-label="Edit pengumuman"
            className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/50 hover:text-brand-primary border border-brand-hairline transition-colors cursor-pointer"
          >
            <Edit3 size={15} />
          </button>
          <form action={deleteAnnouncement}>
            <input type="hidden" name="id" value={item.id} />
            <button type="button" onClick={() => setShowDeleteModal(true)} aria-label="Hapus pengumuman" className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/50 hover:text-negative border border-brand-hairline transition-colors cursor-pointer">
              <Trash2 size={15} />
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

      <p className="mt-3 text-sm text-brand-ink/70 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-brand-hairline">
        {item.content}
      </p>
    </div>
  )
}

