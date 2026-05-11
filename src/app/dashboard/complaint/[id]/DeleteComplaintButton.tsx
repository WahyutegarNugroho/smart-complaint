'use client'

import { Trash2 } from 'lucide-react'
import { adminDeleteComplaint } from '@/app/dashboard/actions'

export default function DeleteComplaintButton({ id }: { id: string }) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm('PERINGATAN: Menghapus laporan ini tidak dapat dibatalkan. Lanjutkan?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={adminDeleteComplaint} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
      >
        <Trash2 size={14} />
        Hapus Laporan
      </button>
    </form>
  )
}
