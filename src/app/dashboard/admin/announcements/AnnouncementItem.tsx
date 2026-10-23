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
  umum: { label: 'Umum', cls: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  kegiatan: { label: 'Kegiatan', cls: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' },
  darurat: { label: 'Darurat', cls: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  kebersihan: { label: 'Kebersihan', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  kesehatan: { label: 'Kesehatan', cls: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' },
  keagamaan: { label: 'Keagamaan', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
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
      <form action={updateAnnouncement} onSubmit={() => setIsEditing(false)} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-500/40 dark:border-blue-500/50 shadow-sm space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <div className="space-y-1.5">
          <label htmlFor={`edit-title-${item.id}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Judul</label>
          <input
            id={`edit-title-${item.id}`}
            name="title"
            defaultValue={item.title}
            autoFocus
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[44px]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`edit-content-${item.id}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Konten</label>
          <textarea
            id={`edit-content-${item.id}`}
            name="content"
            defaultValue={item.content}
            rows={4}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`edit-category-${item.id}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kategori</label>
          <div className="relative">
            <select
              id={`edit-category-${item.id}`}
              name="category"
              defaultValue={item.category || 'umum'}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none min-h-[44px] cursor-pointer"
            >
              <option value="umum">Umum</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="darurat">Darurat</option>
              <option value="kebersihan">Kebersihan</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="keagamaan">Keagamaan</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button type="submit" className="min-h-[44px] flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <Check size={14} aria-hidden="true" />
            Simpan Perubahan
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="min-h-[44px] px-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
            Batal
          </button>
        </div>
      </form>
    )
  }

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs space-y-3">
      <header className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">{item.title}</h3>
          <dl className="flex items-center gap-2.5 flex-wrap mt-2 text-xs font-medium">
            <dt className="sr-only">Kategori</dt>
            <dd className={`font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-lg border ${categoryStyle.cls}`}>
              {categoryStyle.label}
            </dd>
            <dt className="sr-only">Penulis</dt>
            <dd className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <User size={12} aria-hidden="true" />
              <span>{item.author.name || 'Admin'}</span>
            </dd>
            <dt className="sr-only">Tanggal</dt>
            <dd className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Calendar size={12} aria-hidden="true" />
              <time className="font-mono tabular-nums" dateTime={new Date(item.createdAt).toISOString()}>{formattedDate}</time>
            </dd>
          </dl>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            aria-label={`Edit pengumuman "${item.title}"`}
            className="min-h-[44px] min-w-[44px] bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <Edit3 size={15} aria-hidden="true" />
          </button>
          <form id={`delete-form-${item.id}`} action={deleteAnnouncement}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              aria-label={`Hapus pengumuman "${item.title}"`}
              className="min-h-[44px] min-w-[44px] bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </form>
          <ConfirmModal
            open={showDeleteModal}
            title="Hapus Pengumuman"
            message={`Apakah Anda yakin ingin menghapus pengumuman "${item.title}"? Tindakan ini tidak dapat dibatalkan.`}
            confirmLabel="Ya, Hapus"
            variant="danger"
            onConfirm={() => {
              const form = document.getElementById(`delete-form-${item.id}`) as HTMLFormElement | null
              form?.requestSubmit()
              setShowDeleteModal(false)
            }}
            onCancel={() => setShowDeleteModal(false)}
          />
        </div>
      </header>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-slate-200 dark:border-slate-700">
        {item.content}
      </p>
    </article>
  )
}