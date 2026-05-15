'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MoreVertical, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react'
import { deleteResponse, editResponse } from '@/app/dashboard/actions'

interface ResponseItemProps {
  res: any
  currentProfileId: string
  isAdmin: boolean
}

export default function ResponseItem({ res, currentProfileId, isAdmin }: ResponseItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(res.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isAuthor = res.officerId === currentProfileId
  const canDelete = isAuthor || isAdmin
  const canEdit = isAuthor
  
  const isOfficer = (res.officer?.role || 'MASYARAKAT') !== 'MASYARAKAT'

  const handleDelete = async () => {
    if (!confirm('Hapus tanggapan ini?')) return
    setIsDeleting(true)
    const result = await deleteResponse(res.id)
    if (result.error) {
      alert(result.error)
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
      alert(result.error)
    }
    setIsSaving(false)
  }

  return (
    <div className={`flex gap-4 group/item ${isOfficer ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className="shrink-0 pt-1">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${isOfficer ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
          {(res.officer?.name || '?').charAt(0).toUpperCase()}
        </div>
      </div>

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${isOfficer ? 'items-start' : 'items-end flex flex-col'}`}>
        <div className="flex items-center gap-3 px-1">
          <span className="text-[11px] font-bold text-slate-900 dark:text-white italic">{res.officer?.name || 'Petugas'}</span>
          <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            {(() => {
              try {
                const date = new Date(res.createdAt)
                return isNaN(date.getTime()) ? '--:--' : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              } catch (e) {
                return '--:--'
              }
            })()}
          </span>
          
          {/* Actions Menu */}
          {(canEdit || canDelete) && !isEditing && (
            <div className="relative">
               <button 
                 onClick={() => setShowMenu(!showMenu)}
                 className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all opacity-0 group-hover/item:opacity-100"
               >
                 <MoreVertical size={14} />
               </button>
               
               {showMenu && (
                 <>
                   <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                   <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                     {canEdit && (
                       <button 
                         onClick={() => { setIsEditing(true); setShowMenu(false); }}
                         className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-all"
                       >
                         <Edit2 size={12} /> Edit
                       </button>
                     )}
                     {canDelete && (
                       <button 
                         onClick={() => { handleDelete(); setShowMenu(false); }}
                         className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
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

        {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-500/30 text-sm text-slate-700 dark:text-slate-300 focus:border-blue-500 outline-none transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
               <button 
                 onClick={() => setIsEditing(false)}
                 className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-all"
               >
                 <X size={16} />
               </button>
               <button 
                 onClick={handleEdit}
                 disabled={isSaving}
                 className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2"
               >
                 {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
               </button>
            </div>
          </div>
        ) : (
          <div className={`p-5 rounded-[1.5rem] text-[14px] leading-relaxed font-medium transition-all shadow-sm ${isOfficer ? 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300' : 'bg-blue-600 dark:bg-blue-500 text-white'}`}>
            {res.content}
            {res.imageUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 relative h-64">
                <Image src={res.imageUrl} alt="Lampiran" fill className="object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
