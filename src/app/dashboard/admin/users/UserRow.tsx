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
  ChevronDown,
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

  const roleBadgeStyles: Record<string, string> = {
    ADMIN: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    PETUGAS: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    MASYARAKAT: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  }

  return (
    <>
      <tr
        onClick={() => setShowModal(true)}
        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowModal(true); } }}
        role="button"
        aria-label={`Lihat detail ${user.name}`}
      >
        <td className="px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-800 dark:text-blue-300 shrink-0 font-bold border border-blue-200/60 dark:border-blue-900/40 text-sm">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">{user.name}</p>
                {user.isVerified && (
                  <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" fill="currentColor" aria-label="Terverifikasi" />
                )}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="hidden md:table-cell px-5 sm:px-6 py-4">
          <div className="flex flex-col">
            <span className="text-xs font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">RT {user.rt || '-'} / RW {user.rw || '-'}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mt-0.5">Wilayah Domisili</span>
          </div>
        </td>
        <td className="hidden sm:table-cell px-5 sm:px-6 py-4">
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <form action={async (formData) => {
              try {
                await updateUserRole(formData)
              } catch (err) {
                if (err instanceof Error && ('digest' in err) && (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')) throw err
              }
            }} className="inline-block">
              <input type="hidden" name="profileId" value={user.id} />
              <div className="relative inline-block">
                <select
                  name="role"
                  defaultValue={user.role}
                  onChange={(e) => e.target.form?.requestSubmit()}
                  aria-label={`Ubah role ${user.name} menjadi ${roleLabels[user.role]}`}
                  className="min-h-[36px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 cursor-pointer transition-all appearance-none"
                >
                  <option value="MASYARAKAT">Warga</option>
                  <option value="PETUGAS">Petugas</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </form>
            <form action={toggleUserVerification}>
              <input type="hidden" name="profileId" value={user.id} />
              <input type="hidden" name="isVerified" value={String(user.isVerified)} />
              <button
                type="submit"
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  user.isVerified 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 hover:border-amber-300'
                }`}
                aria-label={user.isVerified ? `Batalkan verifikasi ${user.name}` : `Verifikasi ${user.name}`}
              >
                {user.isVerified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
              </button>
            </form>
          </div>
        </td>
        <td className="sticky right-0 pl-2 pr-5 sm:pl-4 sm:pr-6 py-4 text-right bg-white group-hover:bg-slate-50/80 dark:bg-slate-900 dark:group-hover:bg-slate-800/40 z-10 transition-colors" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">
            <form action={deleteUserAccount}>
              <input type="hidden" name="profileId" value={user.id} />
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                aria-label={`Hapus pengguna ${user.name}`}
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              >
                <Trash2 size={16} />
              </button>
            </form>
            <button
              onClick={() => setShowModal(true)}
              aria-label={`Lihat detail ${user.name}`}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Hapus Akun Pengguna"
        message={`Hapus akun pengguna "${user.name}" secara permanen? Seluruh data terkait akan dihapus dan tidak dapat dipulihkan.`}
        confirmLabel="Ya, Hapus Akun"
        variant="danger"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Detail Modal */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-labelledby="user-detail-title">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                  <User size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 id="user-detail-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">Detail Profil Penduduk</h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Informasi Kependudukan & Akses</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Tutup detail pengguna"
                className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Profile Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5">
                <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg font-bold text-blue-800 dark:text-blue-300 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
                    {user.isVerified && <ShieldCheck size={16} className="text-emerald-600 shrink-0" fill="currentColor" aria-label="Terverifikasi" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${roleBadgeStyles[user.role] || roleBadgeStyles.MASYARAKAT}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">@{user.username}</span>
                  </div>
                </div>
              </div>

              {/* Info Definition List */}
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white">{user.nik ? `****${user.nik.slice(-4)}` : 'Belum diisi'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kontak WhatsApp</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white">{user.phone ? `****${user.phone.slice(-4)}` : 'Belum diisi'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wilayah RT / RW</dt>
                  <dd className="text-sm font-mono tabular-nums font-bold text-slate-900 dark:text-white">RT {user.rt || '-'} / RW {user.rw || '-'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Terdaftar</dt>
                  <dd className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </dd>
                </div>
              </dl>

              <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Lengkap Domisili</dt>
                <dd className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-blue-600/50">
                  {user.address ? `"${user.address}"` : 'Alamat domisili belum dilengkapi oleh pengguna dalam pengaturan akun.'}
                </dd>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none min-h-[44px]"
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