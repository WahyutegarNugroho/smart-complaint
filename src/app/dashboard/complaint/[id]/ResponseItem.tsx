'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MoreVertical, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react'
import { deleteResponse, editResponse } from '@/app/dashboard/actions'
import ConfirmModal from '@/components/ConfirmModal'

interface ResponseItemProps {
  res: {
    id: string
    content: string
    imageUrl?: string | null
    officerId: string | null
    createdAt: Date
    officer?: {
      name: string | null
      role: string
    } | null
  }
  currentProfileId: string
  isAdmin: boolean
}

export default function ResponseItem({ res, currentProfileId, isAdmin }: ResponseItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(res.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isAuthor = res.officerId === currentProfileId
  const canDelete = isAuthor || isAdmin
  const canEdit = isAuthor
  
  const isOfficer = (res.officer?.role || 'MASYARAKAT') !== 'MASYARAKAT'

  const date = new Date(res.createdAt)
  const timeStr = isNaN(date.getTime()) ? '--:--' : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  const roleLabel = res.officer?.role === 'ADMIN' ? 'Admin Pusat' : res.officer?.role === 'PETUGAS' ? 'Petugas Teknis' : 'Warga / Pelapor'

  const handleDelete = async () => {
    setShowDeleteModal(false)
    setIsDeleting(true)
    const result = await deleteResponse(res.id)
    if (result.error) {
      setErrorMsg(result.error || null)
      setIsDeleting(false)
    }
  }

  const handleEdit = async () => {
    if (!content.trim()) return
    setIsSaving(true)
    const result = await editResponse(res.id, content)
    if (result.success) {
      setIsEditing(false)
    } else {
      setErrorMsg(result.error || null)
    }
    setIsSaving(false)
  }

  return (
    <div className={`flex gap-3 sm:gap-4 group/item ${isOfficer ? 'flex-row' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className="shrink-0 pt-1">
        <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
          isOfficer 
            ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}>
          {(res.officer?.name || '?').charAt(0).toUpperCase()}
        </div>
      </div>

      <div className={`w-full max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isOfficer ? 'items-start' : 'items-end flex flex-col'}`}>
        <div className={`flex items-center gap-2 px-1 ${!isOfficer ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{res.officer?.name || 'Pelapor'}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            res.officer?.role === 'ADMIN' ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' :
            res.officer?.role === 'PETUGAS' ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' : 
            'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            {roleLabel}
          </span>
          <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
            {timeStr}
          </span>
          
          {/* Actions Menu */}
          {(canEdit || canDelete) && !isEditing && (
            <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Opsi tanggapan"
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                >
                  <MoreVertical size={14} />
                </button>
               
                 {showMenu && (
                   <>
                     <button
                       type="button"
                       className="fixed inset-0 z-10 cursor-default bg-transparent w-full h-full border-none p-0"
                       onClick={() => setShowMenu(false)}
                       aria-label="Tutup menu tanggapan"
                     />
                     <div className={`absolute top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 overflow-hidden ${isOfficer ? 'left-0' : 'right-0'}`}>
                       {canEdit && (
                         <button 
                           onClick={() => { setIsEditing(true); setShowMenu(false); }}
                           className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                         >
                           <Edit2 size={12} /> Edit
                         </button>
                       )}
                        {canDelete && (
                          <button 
                            onClick={() => { setShowDeleteModal(true); setShowMenu(false); }}
                           className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                         >
                           {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Hapus
                         </button>
                       )}
                     </div>
                   </>
                 )}
            </div>
          )}
        </div>

          {errorMsg && (
            <div className="w-full p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-medium">
              {errorMsg}
              <button onClick={() => setErrorMsg(null)} className="ml-2 text-rose-500 hover:text-rose-700">&times;</button>
            </div>
          )}

          {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-label="Edit tanggapan"
              placeholder="Tulis pembaruan status atau hasil pemeriksaan lapangan..."
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  aria-label="Batal edit"
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleEdit}
                  disabled={isSaving}
                  aria-label="Simpan edit"
                  className="p-2 rounded-xl bg-blue-800 text-white hover:bg-blue-900 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                </button>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-sm ${
            isOfficer 
              ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm' 
              : 'bg-blue-800 text-white dark:bg-blue-700 rounded-tr-sm'
          }`}>
            {res.content}
            {res.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 relative aspect-video w-full min-w-[200px] sm:min-w-[300px]">
                <Image
                  src={res.imageUrl}
                  alt="Lampiran foto tanggapan"
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Hapus Tanggapan"
        message="Apakah Anda yakin ingin menghapus tanggapan ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}

