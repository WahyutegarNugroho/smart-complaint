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
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-brand-canvas rounded-xl shadow-xl border border-brand-hairline overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${v.iconBg} ${v.iconText} ${v.iconBorder} border`}>
              <AlertTriangle size={20} />
            </div>
            <button
              onClick={onCancel}
              aria-label="Tutup dialog konfirmasi"
              className="h-8 w-8 bg-brand-canvas-soft rounded-lg flex items-center justify-center text-brand-ink/60 hover:text-brand-ink transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-brand-ink">{title}</h3>
            <p className="text-xs text-brand-ink/70 leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-brand-canvas-soft text-brand-ink/80 text-xs font-semibold rounded-lg hover:bg-brand-hairline transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className={`flex-1 py-2.5 text-white text-xs font-semibold rounded-lg transition-opacity hover:opacity-90 ${v.confirmBg}`}
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
