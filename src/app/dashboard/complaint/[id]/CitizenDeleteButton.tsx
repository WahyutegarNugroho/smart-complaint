'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteComplaint } from '@/app/dashboard/actions'
import ConfirmModal from '@/components/ConfirmModal'

export default function CitizenDeleteButton({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <form action={deleteComplaint}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
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
