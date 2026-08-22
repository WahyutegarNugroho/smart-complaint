'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

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

function ActiveSidebarLink({
  href,
  label,
  icon: Icon,
  badge = 0,
  badgeClassName,
  className,
  activeClassName,
}: SidebarLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const qIndex = href.indexOf('?')
  const basePath = qIndex === -1 ? href : href.slice(0, qIndex)
  const wantedStatus =
    qIndex !== -1
      ? new URLSearchParams(href.slice(qIndex + 1)).get('status')
      : null

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

export default function SidebarLink(props: SidebarLinkProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Render static link during SSR / hydration to avoid calling useSearchParams
  if (!mounted) {
    const { href, label, icon: Icon, badge, badgeClassName, className } = props
    return (
      <Link
        href={href}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border border-transparent text-brand-ink/70 hover:bg-brand-canvas-soft hover:shadow-sm ${className}`}
      >
        <span className="flex items-center gap-3 min-w-0 flex-1">
          <Icon
            aria-hidden="true"
            size={18}
            className="shrink-0 opacity-70 group-hover:opacity-100"
          />
          <span className="truncate">{label}</span>
        </span>
        {badge !== undefined && badge > 0 && (
          <span
            className={`shrink-0 text-[10px] font-semibold font-mono tabular-nums px-2 py-0.5 rounded-lg border ${badgeClassName}`}
          >
            {badge}
          </span>
        )}
      </Link>
    )
  }

  return <ActiveSidebarLink {...props} />
}
