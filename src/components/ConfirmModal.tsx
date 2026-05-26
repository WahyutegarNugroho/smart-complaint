'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

const VARIANTS = {
  danger: {
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconText: 'text-red-500',
    iconBorder: 'border-red-100 dark:border-red-800',
    confirmBg: 'bg-red-500 hover:bg-red-600',
  },
  default: {
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconText: 'text-amber-500',
    iconBorder: 'border-amber-100 dark:border-amber-800',
    confirmBg: 'bg-slate-900 dark:bg-blue-600 hover:opacity-90',
  },
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Batal',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEscape)
    confirmRef.current?.focus()
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onCancel])

  if (!open) return null

  const v = VARIANTS[variant]

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${v.iconBg} ${v.iconText} ${v.iconBorder} border`}>
              <AlertTriangle size={24} />
            </div>
            <button
              onClick={onCancel}
              aria-label="Tutup"
              className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className={`flex-1 py-3 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 shadow-lg ${v.confirmBg}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
