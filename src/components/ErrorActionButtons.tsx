'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Home,
  LayoutDashboard,
  LogIn,
  Plus,
  RotateCcw,
} from 'lucide-react'

export type ErrorActionIcon =
  | 'home'
  | 'dashboard'
  | 'login'
  | 'reload'
  | 'back'
  | 'plus'

export interface ErrorPageAction {
  label: string
  kind: 'link' | 'reload' | 'back' | 'retry'
  href?: string
  fallbackHref?: string
  icon?: ErrorActionIcon
  tone?: 'primary' | 'emerald' | 'secondary'
}

interface ErrorActionButtonsProps {
  actions: ErrorPageAction[]
  onRetry?: () => void
}

function renderIcon(icon?: ErrorActionIcon) {
  switch (icon) {
    case 'home':
      return <Home size={16} aria-hidden="true" />
    case 'dashboard':
      return <LayoutDashboard size={16} aria-hidden="true" />
    case 'login':
      return <LogIn size={16} aria-hidden="true" />
    case 'reload':
      return <RotateCcw size={16} aria-hidden="true" />
    case 'back':
      return <ArrowLeft size={16} aria-hidden="true" />
    case 'plus':
      return <Plus size={16} aria-hidden="true" />
    default:
      return null
  }
}

const TONE_CLASSES: Record<NonNullable<ErrorPageAction['tone']>, string> = {
  primary:
    'bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white shadow-sm shadow-blue-800/20',
  emerald:
    'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-sm shadow-emerald-700/20',
  secondary:
    'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700',
}

export default function ErrorActionButtons({ actions, onRetry }: ErrorActionButtonsProps) {
  const router = useRouter()

  const baseClass =
    'min-h-[44px] w-full sm:w-auto sm:flex-1 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2'

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-1">
      {actions.map((action, idx) => {
        const toneCls = TONE_CLASSES[action.tone || (idx === 0 ? 'primary' : 'secondary')]

        if (action.kind === 'link' && action.href) {
          return (
            <Link key={`${action.label}-${idx}`} href={action.href} className={`${baseClass} ${toneCls}`}>
              {renderIcon(action.icon)}
              <span>{action.label}</span>
            </Link>
          )
        }

        if (action.kind === 'retry') {
          return (
            <button
              key={`${action.label}-${idx}`}
              type="button"
              onClick={() => (onRetry ? onRetry() : window.location.reload())}
              className={`${baseClass} ${toneCls}`}
            >
              {renderIcon(action.icon || 'reload')}
              <span>{action.label}</span>
            </button>
          )
        }

        if (action.kind === 'reload') {
          return (
            <button
              key={`${action.label}-${idx}`}
              type="button"
              onClick={() => window.location.reload()}
              className={`${baseClass} ${toneCls}`}
            >
              {renderIcon(action.icon || 'reload')}
              <span>{action.label}</span>
            </button>
          )
        }

        return (
          <button
            key={`${action.label}-${idx}`}
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back()
              } else {
                router.push(action.fallbackHref || '/')
              }
            }}
            className={`${baseClass} ${toneCls}`}
          >
            {renderIcon(action.icon || 'back')}
            <span>{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

