import React from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Clock,
  FileQuestion,
  LockKeyhole,
  Megaphone,
  PhoneCall,
  ServerCrash,
  ShieldAlert,
  WifiOff,
  BookOpen,
  MessageSquareWarning,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import ErrorActionButtons, { type ErrorPageAction } from '@/components/ErrorActionButtons'

export type ErrorShellTone = 'blue' | 'amber' | 'rose' | 'slate'
export type ErrorShellIcon =
  | 'not-found'
  | 'forbidden'
  | 'unauthorized'
  | 'rate-limit'
  | 'server-error'
  | 'unavailable'
  | 'offline'

export interface ErrorPageShellProps {
  variant?: 'public' | 'dashboard'
  statusCode: string
  statusLabel: string
  kicker: string
  title: string
  description: string
  guidance?: string
  referenceId?: string
  technicalDetail?: string
  tone?: ErrorShellTone
  icon?: ErrorShellIcon
  actions: ErrorPageAction[]
  onRetry?: () => void
  showCivicLinks?: boolean
  children?: React.ReactNode
}

const TONE_STYLES: Record<
  ErrorShellTone,
  {
    iconWrap: string
    badge: string
    accentBar: string
  }
> = {
  blue: {
    iconWrap:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    badge:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    accentBar: 'bg-blue-800 dark:bg-blue-500',
  },
  amber: {
    iconWrap:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    badge:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    accentBar: 'bg-amber-600 dark:bg-amber-500',
  },
  rose: {
    iconWrap:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    badge:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    accentBar: 'bg-rose-600 dark:bg-rose-500',
  },
  slate: {
    iconWrap:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    badge:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    accentBar: 'bg-slate-700 dark:bg-slate-400',
  },
}

function renderStatusIcon(icon: ErrorShellIcon) {
  switch (icon) {
    case 'not-found':
      return <FileQuestion size={28} aria-hidden="true" />
    case 'forbidden':
      return <ShieldAlert size={28} aria-hidden="true" />
    case 'unauthorized':
      return <LockKeyhole size={28} aria-hidden="true" />
    case 'rate-limit':
      return <Clock size={28} aria-hidden="true" />
    case 'unavailable':
      return <ServerCrash size={28} aria-hidden="true" />
    case 'offline':
      return <WifiOff size={28} aria-hidden="true" />
    case 'server-error':
    default:
      return <AlertCircle size={28} aria-hidden="true" />
  }
}

export default function ErrorPageShell({
  variant = 'public',
  statusCode,
  statusLabel,
  kicker,
  title,
  description,
  guidance,
  referenceId,
  technicalDetail,
  tone = 'blue',
  icon = 'server-error',
  actions,
  onRetry,
  showCivicLinks = variant === 'public',
  children,
}: ErrorPageShellProps) {
  const styles = TONE_STYLES[tone]
  const isPublic = variant === 'public'

  return (
    <div
      className={
        isPublic
          ? 'min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300'
          : 'min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-brand-canvas-soft text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300'
      }
    >
      {isPublic && (
        <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm shadow-blue-800/20">
                <Megaphone size={18} aria-hidden="true" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Portal <span className="text-blue-800 dark:text-blue-400">Pengaduan</span>
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                  Warga Pesona Serpong
                </span>
              </div>
            </Link>

            <ThemeToggle />
          </div>
        </header>
      )}

      <main
        className={
          isPublic
            ? 'flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14'
            : 'w-full max-w-xl'
        }
      >
        <section
          role="alert"
          aria-labelledby="error-page-title"
          className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/5 overflow-hidden text-left"
        >
          <div className={`h-1.5 w-full ${styles.accentBar}`} />

          <div className="px-5 sm:px-7 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              STATUS LAYANAN: {statusCode}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${styles.badge}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className={`h-14 w-14 rounded-2xl border flex items-center justify-center shrink-0 ${styles.iconWrap}`}
              >
                {renderStatusIcon(icon)}
              </div>

              <div className="space-y-1.5 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
                  {kicker}
                </span>
                <h1
                  id="error-page-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug"
                >
                  {title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {guidance && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {guidance}
              </div>
            )}

            {children}

            {referenceId && (
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Kode Referensi Masalah
                </span>
                <code className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {referenceId}
                </code>
              </div>
            )}

            {technicalDetail && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  Keterangan Teknis (Mode Pengembangan)
                </p>
                <p className="text-xs font-mono text-rose-700 dark:text-rose-300 break-all">
                  {technicalDetail}
                </p>
              </div>
            )}

            <ErrorActionButtons actions={actions} onRetry={onRetry} />

            {showCivicLinks && (
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Kanal Bantuan Warga Pesona Serpong
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link
                    href="/bantuan/panduan"
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <BookOpen size={14} className="text-blue-800 dark:text-blue-400 shrink-0" aria-hidden="true" />
                    <span>Panduan Portal</span>
                  </Link>
                  <Link
                    href="/informasi/darurat"
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-rose-300 dark:hover:border-rose-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <PhoneCall size={14} className="text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
                    <span>Hotline Darurat</span>
                  </Link>
                  <Link
                    href="/bantuan/kontak"
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <MessageSquareWarning size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>Kontak Pengurus</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {isPublic && (
        <footer className="py-5 px-4 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          Kanal Resmi Layanan Warga RW 08 Perumahan Pesona Serpong
        </footer>
      )}
    </div>
  )
}

