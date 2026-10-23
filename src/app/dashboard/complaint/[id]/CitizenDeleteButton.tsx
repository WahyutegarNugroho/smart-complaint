'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteComplaint } from '@/app/dashboard/actions'
import ConfirmModal from '@/components/ConfirmModal'

export default function CitizenDeleteButton({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <form action={deleteComplaint} data-id={id}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <Trash2 size={16} />
          Batalkan & Hapus Laporan
        </button>
      </form>

      <ConfirmModal
        open={showModal}
        title="Hapus Laporan"
        message="PERINGATAN: Menghapus laporan Anda sendiri tidak dapat dibatalkan. Lanjutkan?"
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={() => {
          setShowModal(false)
          const form = document.querySelector<HTMLFormElement>(`form[data-id="${id}"]`)
          form?.requestSubmit()
        }}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}
