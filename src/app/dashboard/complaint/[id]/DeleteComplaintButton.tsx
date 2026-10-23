'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { adminDeleteComplaint } from '@/app/dashboard/actions'
import ConfirmModal from '@/components/ConfirmModal'

export default function DeleteComplaintButton({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <form action={adminDeleteComplaint} data-id={id}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-[44px] w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white border border-rose-200 dark:border-rose-800 px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shadow-xs"
        >
          <Trash2 size={15} aria-hidden="true" />
          Hapus Laporan
        </button>
      </form>

      <ConfirmModal
        open={showModal}
        title="Hapus Laporan Masyarakat"
        message="Tindakan ini akan menghapus laporan dan seluruh riwayat tindak lanjut secara permanen dari sistem. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Ya, Hapus Permanen"
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
