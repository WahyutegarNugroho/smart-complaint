'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLinkProps {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  badgeClassName?: string
  /** Extra inactive-state hover classes, e.g. 'hover:text-amber-500' */
  className?: string
  /** Text color applied when this route is active */
  activeClassName?: string
}

// Fully SSR-safe client-only hook to read searchParams from window.location
export function useUrlSearchParams() {
  const [params, setParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    const updateParams = () => {
      setParams(new URLSearchParams(window.location.search))
    }

    // Initial setting
    updateParams()

    // Listen to history transitions
    window.addEventListener('popstate', updateParams)

    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      updateParams()
    }

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      updateParams()
    }

    return () => {
      window.removeEventListener('popstate', updateParams)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  return params
}

export default function SidebarLink({
  href,
  label,
  icon: Icon,
  badge = 0,
  badgeClassName = 'bg-brand-canvas-soft text-brand-ink/60 border-brand-hairline',
  className = '',
  activeClassName = 'text-brand-primary',
}: SidebarLinkProps) {
  const pathname = usePathname()
  const searchParams = useUrlSearchParams()

  const qIndex = href.indexOf('?')
  const basePath = qIndex === -1 ? href : href.slice(0, qIndex)
  const wantedStatus =
    qIndex !== -1
      ? new URLSearchParams(href.slice(qIndex + 1)).get('status')
      : null

  // Evaluate active status safely
  const active = wantedStatus
    ? pathname === basePath && searchParams && searchParams.get('status') === wantedStatus
    : pathname === basePath

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
        active
          ? `bg-brand-canvas-soft shadow-sm border border-brand-hairline ${activeClassName}`
          : `border border-transparent text-brand-ink/70 hover:bg-brand-canvas-soft hover:shadow-sm ${className}`
      }`}
    >
      <span className="flex items-center gap-3 min-w-0 flex-1">
        <Icon
          aria-hidden="true"
          size={18}
          className={`shrink-0 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
        />
        <span className="truncate">{label}</span>
      </span>
      {badge > 0 && (
        <span
          className={`shrink-0 text-[10px] font-semibold font-mono tabular-nums px-2 py-0.5 rounded-lg border ${badgeClassName}`}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
