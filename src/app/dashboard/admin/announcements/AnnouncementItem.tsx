'use client'

import { useState } from 'react'
import { deleteAnnouncement, updateAnnouncement } from '@/app/dashboard/actions'
import {
  Trash2,
  Edit3,
  Check,
  Calendar,
  User,
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
  id: string
  title: string
  content: string
  category: string
  createdAt: Date | string
  author: {
    name: string | null
  }
}

interface AnnouncementItemProps {
  item: Announcement
}

export default function AnnouncementItem({ item }: AnnouncementItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const categoryStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.umum
  const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  if (isEditing) {
    return (
      <form action={updateAnnouncement} onSubmit={() => setIsEditing(false)} className="bg-brand-canvas p-4 rounded-lg border border-brand-primary/50 space-y-3">
        <input type="hidden" name="id" value={item.id} />
        <div className="space-y-1.5">
          <label htmlFor={`edit-title-${item.id}`} className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Judul</label>
          <input
            id={`edit-title-${item.id}`}
            name="title"
            defaultValue={item.title}
            autoFocus
            className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`edit-content-${item.id}`} className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Konten</label>
          <textarea
            id={`edit-content-${item.id}`}
            name="content"
            defaultValue={item.content}
            rows={4}
            className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`edit-category-${item.id}`} className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Kategori</label>
          <select
            id={`edit-category-${item.id}`}
            name="category"
            defaultValue={item.category || 'umum'}
            className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2 text-sm font-medium text-brand-ink focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none h-10"
          >
            <option value="umum">Umum</option>
            <option value="kegiatan">Kegiatan</option>
            <option value="darurat">Darurat</option>
            <option value="kebersihan">Kebersihan</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="keagamaan">Keagamaan</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-brand-hairline">
          <button type="submit" className="flex-1 bg-brand-ink text-brand-canvas py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer h-9">
            <Check size={13} />
            Simpan
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 bg-brand-canvas-soft text-brand-ink/50 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-brand-hairline/50 transition-colors cursor-pointer h-9">
            Batal
          </button>
        </div>
      </form>
    )
  }

  return (
    <article className="bg-brand-canvas rounded-lg border border-brand-hairline p-4 transition-colors hover:border-brand-hairline/50">
      <header className="flex justify-between items-start gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-brand-ink leading-snug truncate">{item.title}</h3>
          <dl className="flex items-center gap-2 flex-wrap mt-1.5 text-[9px] font-medium">
            <dt className="sr-only">Kategori</dt>
            <dd className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${categoryStyle.cls}`}>
              {categoryStyle.label}
            </dd>
            <dt className="sr-only">Penulis</dt>
            <dd className="flex items-center gap-1 text-brand-ink/50">
              <User size={11} aria-hidden="true" />
              {item.author.name}
            </dd>
            <dt className="sr-only">Tanggal</dt>
            <dd className="flex items-center gap-1 text-brand-ink/50">
              <Calendar size={11} aria-hidden="true" />
              <time className="font-mono tabular-nums" dateTime={new Date(item.createdAt).toISOString()}>{formattedDate}</time>
            </dd>
          </dl>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            aria-label={`Edit pengumuman "${item.title}"`}
            className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/50 hover:text-brand-primary border border-brand-hairline transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
          >
            <Edit3 size={14} />
          </button>
          <form action={deleteAnnouncement}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              aria-label={`Hapus pengumuman "${item.title}"`}
              className="h-9 w-9 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/50 hover:text-red-500 border border-brand-hairline transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
            >
              <Trash2 size={14} />
            </button>
          </form>
          <ConfirmModal
            open={showDeleteModal}
            title="Hapus Pengumuman"
            message={`Hapus pengumuman "${item.title}"?`}
            confirmLabel="Ya, Hapus"
            variant="danger"
            onConfirm={() => setShowDeleteModal(false)}
            onCancel={() => setShowDeleteModal(false)}
          />
        </div>
      </header>

      <p className="text-sm text-brand-ink/70 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-brand-hairline">
        {item.content}
      </p>
    </article>
  )
}