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
      iconBg: 'bg-brand-canvas-soft',
      iconText: 'text-brand-ink',
      iconBorder: 'border-brand-hairline',
      confirmBg: 'bg-brand-ink dark:bg-brand-primary hover:opacity-90',
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
      <div className="relative w-full max-w-sm bg-brand-canvas rounded-3xl shadow-xl border border-brand-hairline overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${v.iconBg} ${v.iconText} ${v.iconBorder} border`}>
              <AlertTriangle size={24} />
            </div>
            <button
              onClick={onCancel}
              aria-label="Tutup"
              className="h-8 w-8 bg-brand-canvas-soft rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-ink">{title}</h3>
            <p className="text-sm text-brand-ink/60 leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-brand-canvas-soft text-brand-ink/70 text-sm font-bold rounded-2xl hover:bg-brand-hairline transition-all active:scale-95"
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
