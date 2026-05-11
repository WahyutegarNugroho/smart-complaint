'use client'

import Link from 'next/link'
import { Edit2, Trash2 } from 'lucide-react'
import { deleteComplaint } from '@/app/dashboard/actions'

export default function ComplaintActions({ id }: { id: string }) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm('Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.')) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link 
        href={`/dashboard/complaint/${id}/edit`}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all"
      >
        <Edit2 size={16} />
        Edit Laporan
      </Link>
      
      <form action={deleteComplaint} onSubmit={handleDelete}>
        <input type="hidden" name="id" value={id} />
        <button 
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-100 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </form>
    </div>
  )
}
