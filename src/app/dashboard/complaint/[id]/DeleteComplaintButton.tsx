'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { adminDeleteComplaint } from '@/app/dashboard/actions'
import ConfirmModal from '@/components/ConfirmModal'

export default function DeleteComplaintButton({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <form action={adminDeleteComplaint}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-normal hover:bg-red-600 hover:text-white transition-all"
        >
          <Trash2 size={14} />
          Hapus Laporan
        </button>
      </form>

      <ConfirmModal
        open={showModal}
        title="Hapus Laporan"
        message="PERINGATAN: Menghapus laporan ini tidak dapat dibatalkan. Lanjutkan?"
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
