'use client'

import { Trash2 } from 'lucide-react'
import { deleteComplaint } from '@/app/dashboard/actions'

export default function CitizenDeleteButton({ id }: { id: string }) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm('PERINGATAN: Menghapus laporan Anda sendiri tidak dapat dibatalkan. Lanjutkan?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={deleteComplaint} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
      >
        <Trash2 size={16} />
        Batalkan & Hapus Laporan
      </button>
    </form>
  )
}
