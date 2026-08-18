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
    <div className={`flex gap-4 group/item ${isOfficer ? 'flex-row' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className="shrink-0 pt-1">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${isOfficer ? 'bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c]' : 'bg-brand-canvas border border-brand-hairline text-brand-ink/40'}`}>
          {(res.officer?.name || '?').charAt(0).toUpperCase()}
        </div>
      </div>

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${isOfficer ? 'items-start' : 'items-end flex flex-col'}`}>
        <div className="flex items-center gap-3 px-1">
          <span className="text-[11px] font-semibold text-brand-ink/80">{res.officer?.name || 'Petugas'}</span>
          <span className="text-[10px] font-mono tabular-nums text-brand-ink/40">
            {timeStr}
          </span>
          
          {/* Actions Menu */}
          {(canEdit || canDelete) && !isEditing && (
            <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Opsi tanggapan"
                  className="p-1 rounded-lg hover:bg-brand-canvas-soft text-brand-ink/40 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
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
                     <div className="absolute top-full right-0 mt-1 w-32 bg-brand-canvas border border-brand-hairline rounded-lg shadow-lg z-20 overflow-hidden">
                       {canEdit && (
                         <button 
                           onClick={() => { setIsEditing(true); setShowMenu(false); }}
                           className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors cursor-pointer"
                         >
                           <Edit2 size={12} /> Edit
                         </button>
                       )}
                        {canDelete && (
                          <button 
                            onClick={() => { setShowDeleteModal(true); setShowMenu(false); }}
                           className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
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
            <div className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
              {errorMsg}
              <button onClick={() => setErrorMsg(null)} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
            </div>
          )}

          {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-label="Edit tanggapan"
              className="w-full p-3 rounded-xl bg-brand-canvas-soft border-2 border-brand-primary/30 text-sm text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  aria-label="Batal edit"
                  className="p-2 rounded-lg bg-brand-canvas border border-brand-hairline text-brand-ink/60 hover:bg-brand-canvas-soft transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleEdit}
                  disabled={isSaving}
                  aria-label="Simpan edit"
                  className="p-2 rounded-lg bg-brand-primary text-[#0e0f0c] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
               </button>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-xl text-sm leading-relaxed font-medium shadow-sm ${isOfficer ? 'bg-brand-canvas border border-brand-hairline text-brand-ink' : 'bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c]'}`}>
            {res.content}
            {res.imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border border-brand-hairline relative aspect-video w-full min-w-[200px] sm:min-w-[300px]">
                <Image src={res.imageUrl} alt="Lampiran" fill className="object-cover" />
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

