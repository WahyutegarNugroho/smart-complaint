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
import { Profile } from '@prisma/client'

export default function UserRow({ user }: { user: Profile }) {
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <tr 
        onClick={() => setShowModal(true)}
        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group border-b border-slate-50 dark:border-slate-800 last:border-0"
      >
        <td className="px-8 py-6">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-[1rem] flex items-center justify-center text-slate-400 dark:text-slate-600 shrink-0 font-bold transition-all group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6">
              {user.name?.[0] || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[15px] font-bold text-slate-900 dark:text-white transition-colors">{user.name}</p>
                {user.isVerified && (
                  <ShieldCheck size={14} className="text-blue-500 dark:text-blue-400" fill="currentColor" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium tracking-tight transition-colors">{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex flex-col">
             <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">RT {user.rt || '-'} / RW {user.rw || '-'}</span>
             <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-widest mt-0.5 transition-colors">Blok Wilayah</span>
          </div>
        </td>
        <td className="px-8 py-6">
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
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none cursor-pointer transition-all"
                >
                  <option value="MASYARAKAT">Warga</option>
                  <option value="PETUGAS">Petugas</option>
                  <option value="ADMIN">Admin</option>
                </select>
             </form>
             <form action={toggleUserVerification}>
                <input type="hidden" name="profileId" value={user.id} />
                <input type="hidden" name="isVerified" value={String(user.isVerified)} />
                <button className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${user.isVerified ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                   {user.isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                   {user.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                </button>
             </form>
          </div>
        </td>
        <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center justify-end gap-3">
              <form action={async (formData) => {
                if(!confirm('Hapus akun pengguna ini secara permanen?')) return
                try {
                  await deleteUserAccount(formData)
                } catch (dbError) {
                  if (dbError instanceof Error && ('digest' in dbError) && (dbError as { digest: string }).digest.startsWith('NEXT_REDIRECT')) throw dbError
                }
              }}>
                 <input type="hidden" name="profileId" value={user.id} />
                 <button className="h-10 w-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl flex items-center justify-center text-slate-200 dark:text-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 group/del">
                    <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                 </button>
              </form>
              <div className="h-10 w-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl flex items-center justify-center text-slate-200 dark:text-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ChevronRight size={18} />
              </div>
           </div>
        </td>
      </tr>

      {/* 🔍 DETAIL MODAL */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 transition-colors">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1 italic">Detail Profil</h3>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">Informasi Lengkap Penduduk</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Profile Card Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-6 group">
                <div className="h-20 w-20 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-3xl font-bold text-slate-200 dark:text-slate-700 shadow-inner group-hover:rotate-6 transition-transform">
                  {user.name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white italic">{user.name}</h4>
                    {user.isVerified && <ShieldCheck size={18} className="text-blue-500" fill="currentColor" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">{user.role}</span>
                    <span className="text-slate-200 dark:text-slate-700">•</span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest transition-colors">{user.username}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic transition-colors">
                     NIK
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white italic transition-colors">{user.nik || 'Belum diisi'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic transition-colors">
                     Kontak WhatsApp
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white italic transition-colors">{user.phone || 'Belum diisi'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic transition-colors">
                     Wilayah Blok
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white italic transition-colors">RT {user.rt || '-'} / RW {user.rw || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic transition-colors">
                     Tanggal Registrasi
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white italic transition-colors">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-slate-50 dark:border-slate-800">
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic transition-colors">
                   Alamat Domisili
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic pl-4 border-l-2 border-slate-100 dark:border-slate-800 transition-colors">
                  &quot;{user.address || 'Alamat lengkap belum dilengkapi oleh pengguna dalam profil mereka.'}&quot;
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end transition-colors">
              <button 
                onClick={() => setShowModal(false)}
                className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
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
