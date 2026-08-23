'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateUserRole, toggleUserVerification, deleteUserAccount } from '@/app/dashboard/actions'
import {
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  ChevronRight,
} from 'lucide-react'
import ConfirmModal from '@/components/ConfirmModal'
import { Profile } from '@prisma/client'

export default function UserRow({ user }: { user: Profile }) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showModal) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowModal(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showModal])

  const roleLabels: Record<string, string> = {
    MASYARAKAT: 'Warga',
    PETUGAS: 'Petugas',
    ADMIN: 'Admin',
  }

  return (
    <>
      <tr
        onClick={() => setShowModal(true)}
        className="hover:bg-brand-canvas-soft/50 transition-colors cursor-pointer group border-b border-brand-hairline last:border-0"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowModal(true); } }}
        role="button"
        aria-label={`Lihat detail ${user.name}`}
      >
        <td className="px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/40 shrink-0 font-bold border border-brand-hairline">
              {user.name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-brand-ink truncate">{user.name}</p>
                {user.isVerified && (
                  <ShieldCheck size={14} className="text-brand-primary shrink-0" fill="currentColor" aria-label="Terverifikasi" />
                )}
              </div>
              <p className="text-[10px] text-brand-ink/40 font-medium truncate">{user.username}</p>
            </div>
          </div>
        </td>
        <td className="hidden md:table-cell px-4 sm:px-6 py-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-mono tabular-nums font-bold text-brand-ink">RT {user.rt || '-'} / RW {user.rw || '-'}</span>
            <span className="text-[9px] text-brand-ink/40 uppercase font-bold tracking-wider mt-0.5">Blok Wilayah</span>
          </div>
        </td>
        <td className="hidden sm:table-cell px-4 sm:px-6 py-3">
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <form action={async (formData) => {
              try {
                await updateUserRole(formData)
              } catch (err) {
                if (err instanceof Error && ('digest' in err) && (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')) throw err
              }
            }} className="inline-block">
              <input type="hidden" name="profileId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                onChange={(e) => e.target.form?.requestSubmit()}
                aria-label={`Ubah role ${user.name} menjadi ${roleLabels[user.role]}`}
                className="bg-brand-canvas-soft border border-brand-hairline rounded-md px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand-ink/70 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 cursor-pointer transition-all"
              >
                <option value="MASYARAKAT">Warga</option>
                <option value="PETUGAS">Petugas</option>
                <option value="ADMIN">Admin</option>
              </select>
            </form>
            <form action={toggleUserVerification}>
              <input type="hidden" name="profileId" value={user.id} />
              <input type="hidden" name="isVerified" value={String(user.isVerified)} />
              <button
                type="submit"
                className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${user.isVerified ? 'text-brand-primary' : 'text-brand-ink/30 hover:text-brand-primary'}`}
                aria-label={user.isVerified ? `Batalkan verifikasi ${user.name}` : `Verifikasi ${user.name}`}
              >
                {user.isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
              </button>
            </form>
          </div>
        </td>
        <td className="sticky right-0 pl-2 pr-4 sm:pl-4 sm:pr-6 py-3 text-right bg-brand-canvas hover:bg-brand-canvas-soft z-10 transition-colors" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">
            <form action={deleteUserAccount}>
              <input type="hidden" name="profileId" value={user.id} />
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                aria-label={`Hapus pengguna ${user.name}`}
                className="h-9 w-9 bg-brand-canvas-soft/50 rounded-lg flex items-center justify-center text-brand-ink/20 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              >
                <Trash2 size={15} />
              </button>
            </form>
            <button
              onClick={() => setShowModal(true)}
              aria-label={`Lihat detail ${user.name}`}
              className="h-9 w-9 bg-brand-canvas-soft/50 rounded-lg flex items-center justify-center text-brand-ink/20 border border-brand-hairline hover:bg-brand-canvas-soft hover:text-brand-ink/40 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Hapus Akun"
        message={`Hapus akun pengguna "${user.name}" secara permanen? Semua data terkait akan dihapus dan tidak dapat dipulihkan.`}
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Detail Modal */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-labelledby="user-detail-title">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-brand-canvas rounded-xl shadow-xl border border-brand-hairline overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-brand-hairline flex items-center justify-between bg-brand-canvas-soft/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-primary border border-brand-hairline">
                  <User size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 id="user-detail-title" className="text-sm font-bold text-brand-ink leading-tight">Detail Profil</h3>
                  <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">Informasi Lengkap Penduduk</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Tutup detail pengguna"
                className="h-9 w-9 bg-brand-canvas rounded-lg flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-colors shadow-sm border border-brand-hairline cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Modal Content - flat structure, no nested cards */}
            <div className="p-4 md:p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

              {/* Profile Summary */}
              <div className="bg-brand-canvas-soft p-4 rounded-lg border border-brand-hairline flex items-center gap-3">
                <div className="h-12 w-12 bg-brand-canvas rounded-lg flex items-center justify-center text-lg font-bold text-brand-ink/20 border border-brand-hairline shrink-0">
                  {user.name?.[0] || '?'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-brand-ink truncate">{user.name}</h4>
                    {user.isVerified && <ShieldCheck size={15} className="text-brand-primary shrink-0" fill="currentColor" aria-label="Terverifikasi" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-[9px] font-semibold rounded-md uppercase tracking-wider">{user.role}</span>
                    <span className="text-brand-hairline">•</span>
                    <span className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">{user.username}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid - using dl for semantic definition list */}
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="space-y-1">
                  <dt className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">NIK</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-brand-ink">{user.nik ? `****${user.nik.slice(-4)}` : 'Belum diisi'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">WhatsApp</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-brand-ink">{user.phone ? `****${user.phone.slice(-4)}` : 'Belum diisi'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">Wilayah</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-brand-ink">RT {user.rt || '-'} / RW {user.rw || '-'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">Terdaftar</dt>
                  <dd className="text-sm font-bold text-brand-ink">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </dd>
                </div>
              </dl>

              <div className="space-y-1.5 pt-4 border-t border-brand-hairline">
                <dt className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-wider">Alamat Domisili</dt>
<dd className="text-sm font-medium text-brand-ink/70 leading-relaxed pl-3 border-l-2 border-brand-hairline">
                    {user.address ? `"${user.address}"` : 'Alamat lengkap belum dilengkapi oleh pengguna dalam profil mereka.'}
                  </dd>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-brand-canvas-soft/30 border-t border-brand-hairline flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}