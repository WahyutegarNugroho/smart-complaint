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
  ChevronRight
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

  // Focus trap + Escape handler for modal
  useEffect(() => {
    if (!showModal) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowModal(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showModal])

  return (
    <>
      <tr 
        onClick={() => setShowModal(true)}
        className="hover:bg-brand-canvas-soft/50 transition-all cursor-pointer group border-b border-brand-hairline last:border-0"
      >
        <td className="px-6 sm:px-8 py-6">
          <div className="flex items-center gap-5">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-ink/40 shrink-0 font-bold transition-all group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-[#0e0f0c] group-hover:rotate-6">
              {user.name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm sm:text-[15px] font-bold text-brand-ink truncate">{user.name}</p>
                {user.isVerified && (
                  <ShieldCheck size={14} className="text-brand-primary shrink-0" fill="currentColor" />
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-brand-ink/40 font-medium tracking-tight truncate">{user.username}</p>
            </div>
          </div>
        </td>
        <td className="hidden md:table-cell px-6 sm:px-8 py-6">
          <div className="flex flex-col">
              <span className="text-[13px] font-bold text-brand-ink">RT {user.rt || '-'} / RW {user.rw || '-'}</span>
                 <span className="text-[10px] text-brand-ink/40 uppercase font-bold tracking-normal mt-0.5">Blok Wilayah</span>
          </div>
        </td>
        <td className="hidden sm:table-cell px-6 sm:px-8 py-6">
          <div className="flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
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
                  aria-label="Ubah role pengguna"
                  className="bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-1.5 text-[9px] font-semibold uppercase tracking-normal text-brand-ink/70 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none cursor-pointer transition-all"
                >
                  <option value="MASYARAKAT">Warga</option>
                  <option value="PETUGAS">Petugas</option>
                  <option value="ADMIN">Admin</option>
                </select>
             </form>
             <form action={toggleUserVerification}>
                <input type="hidden" name="profileId" value={user.id} />
                <input type="hidden" name="isVerified" value={String(user.isVerified)} />
                <button className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-normal transition-all ${user.isVerified ? 'text-brand-primary' : 'text-brand-ink/30 hover:text-brand-primary'}`}>
                   {user.isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                   {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                </button>
             </form>
          </div>
        </td>
        <td className="sticky right-0 pl-2 pr-6 sm:pl-4 sm:pr-8 py-6 text-right bg-brand-canvas hover:bg-brand-canvas-soft z-10 transition-colors" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center justify-end gap-3">
              <form action={deleteUserAccount}>
                 <input type="hidden" name="profileId" value={user.id} />
                   <button type="button" onClick={() => setShowDeleteModal(true)} aria-label="Hapus pengguna" className="h-10 w-10 bg-brand-canvas-soft/50 rounded-xl flex items-center justify-center text-brand-ink/20 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 group/del">
                     <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                  </button>
              </form>
              <div className="h-10 w-10 bg-brand-canvas-soft/50 rounded-xl flex items-center justify-center text-brand-ink/20 group-hover:bg-brand-ink dark:group-hover:bg-brand-primary group-hover:text-brand-canvas dark:group-hover:text-[#0e0f0c] transition-all">
                 <ChevronRight size={18} />
              </div>
           </div>
        </td>
      </tr>

      {/* 🔍 DETAIL MODAL */}
      <ConfirmModal
        open={showDeleteModal}
        title="Hapus Akun"
        message="Hapus akun pengguna ini secara permanen? Semua data terkait akan dihapus."
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={() => {
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
      />

      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative w-full max-w-xl bg-brand-canvas rounded-3xl shadow-xl border border-brand-hairline overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-brand-hairline flex items-center justify-between bg-brand-canvas-soft/50">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-brand-canvas-soft rounded-2xl flex items-center justify-center text-brand-primary border border-brand-hairline">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-ink leading-none mb-1">Detail Profil</h3>
                   <p className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Informasi Lengkap Penduduk</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                aria-label="Tutup detail pengguna"
                className="h-10 w-10 bg-brand-canvas rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm border border-brand-hairline"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Profile Card Summary */}
               <div className="bg-brand-canvas-soft p-6 md:p-8 rounded-3xl border border-brand-hairline flex items-center gap-6 group">
                <div className="h-20 w-20 bg-brand-canvas rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-ink/20 shadow-inner group-hover:rotate-6 transition-transform">
                  {user.name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-2xl font-bold text-brand-ink">{user.name}</h4>
                     {user.isVerified && <ShieldCheck size={18} className="text-brand-primary" fill="currentColor" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-[9px] font-semibold rounded-lg uppercase tracking-normal">{user.role}</span>
                    <span className="text-brand-hairline">•</span>
                    <span className="text-[11px] font-semibold text-brand-ink/40 uppercase tracking-normal">{user.username}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal flex items-center gap-2">
                     NIK
                  </p>
                   <p className="text-sm font-bold text-brand-ink">{user.nik ? `****${user.nik.slice(-4)}` : 'Belum diisi'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal flex items-center gap-2">
                     Kontak WhatsApp
                  </p>
                   <p className="text-sm font-bold text-brand-ink">{user.phone ? `****${user.phone.slice(-4)}` : 'Belum diisi'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal flex items-center gap-2">
                     Wilayah Blok
                  </p>
                  <p className="text-sm font-bold text-brand-ink">RT {user.rt || '-'} / RW {user.rw || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal flex items-center gap-2">
                     Tanggal Registrasi
                  </p>
                  <p className="text-sm font-bold text-brand-ink">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-brand-hairline">
                <p className="text-[9px] font-semibold text-brand-ink/40 uppercase tracking-normal flex items-center gap-2">
                   Alamat Domisili
                </p>
                <p className="text-sm font-medium text-brand-ink/70 leading-relaxed pl-4 border-l-2 border-brand-hairline">
                  &quot;{user.address || 'Alamat lengkap belum dilengkapi oleh pengguna dalam profil mereka.'}&quot;
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-brand-canvas-soft/30 border-t border-brand-hairline flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-10 py-4 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-[10px] font-semibold uppercase tracking-normal rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

