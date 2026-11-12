'use client'

import { useActionState, useState } from 'react'
import { createAnnouncement, type AnnouncementFormState } from '@/app/dashboard/actions'
import SubmitButton from '@/components/SubmitButton'
import { AlertCircle, ChevronDown, Plus, Send } from 'lucide-react'

export default function CreateAnnouncementForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('umum')
  const [state, formAction] = useActionState<AnnouncementFormState, FormData>(
    async (prevState, formData) => {
      const result = await createAnnouncement(prevState, formData)
      if (!result?.error) {
        setTitle('')
        setContent('')
        setCategory('umum')
      }
      return result
    },
    null
  )

  return (
    <form
      action={formAction}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-4 sticky top-24"
    >
      <header className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
          <Plus size={18} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rilis Pengumuman Baru</h3>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Siaran Langsung ke Warga
          </p>
        </div>
      </header>

      {state?.error && (
        <div
          role="alert"
          className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 flex items-start gap-2.5 text-rose-800 dark:text-rose-200 text-xs"
        >
          <AlertCircle aria-hidden="true" size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <p className="font-medium leading-relaxed">{state.error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Judul Pengumuman
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Jadwal Pelaksanaan Fogging DBD Wilayah RT 03"
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-h-[44px]"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="content"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Isi &amp; Rincian Informasi
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan tanggal, lokasi, instruksi, dan kontak narahubung yang perlu diketahui warga..."
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none font-medium transition-all leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="category"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Kategori Pengumuman
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 pr-10 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer min-h-[44px]"
            >
              <option value="umum">Umum</option>
              <option value="kegiatan">Kegiatan Lingkungan</option>
              <option value="darurat">Peringatan Darurat</option>
              <option value="kebersihan">Kerja Bakti &amp; Kebersihan</option>
              <option value="kesehatan">Posyandu &amp; Kesehatan</option>
              <option value="keagamaan">Kegiatan Keagamaan</option>
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <SubmitButton
          className="w-full bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white min-h-[44px] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          loadingText="Menerbitkan..."
          icon={<Send size={15} aria-hidden="true" />}
        >
          Terbitkan Pengumuman
        </SubmitButton>
      </div>
    </form>
  )
}
