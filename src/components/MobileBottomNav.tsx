'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Home, Plus, Settings2, Inbox, Map,
  LayoutDashboard, ClipboardList, Activity, UserCircle,
  BarChart, Users, LayoutGrid,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  isCenter?: boolean
}

const WARGA_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Beranda', icon: Home },
  { href: '/dashboard/map', label: 'Peta', icon: Map },
  { href: '/dashboard/create', label: 'Lapor', icon: Plus, isCenter: true },
  { href: '/dashboard?status=PENDING', label: 'Aduan', icon: Inbox },
  { href: '/dashboard/settings', label: 'Profil', icon: Settings2 },
]

const PETUGAS_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Monitor', icon: LayoutDashboard },
  { href: '/dashboard/map', label: 'Peta', icon: Map },
  { href: '/dashboard?status=PENDING', label: 'Tugas', icon: ClipboardList, isCenter: true },
  { href: '/dashboard?status=PROCESSING', label: 'Proses', icon: Activity },
  { href: '/dashboard/settings', label: 'Profil', icon: UserCircle },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Stats', icon: BarChart },
  { href: '/dashboard/map', label: 'Peta', icon: Map },
  { href: '/dashboard/admin/users', label: 'Admin', icon: LayoutGrid, isCenter: true },
  { href: '/dashboard/admin/users', label: 'Warga', icon: Users },
  { href: '/dashboard/settings', label: 'Profil', icon: Settings2 },
]

const NAV_MAP: Record<string, NavItem[]> = {
  MASYARAKAT: WARGA_NAV,
  PETUGAS: PETUGAS_NAV,
  ADMIN: ADMIN_NAV,
}

interface MobileBottomNavProps {
  role: 'ADMIN' | 'PETUGAS' | 'MASYARAKAT'
}

function ActiveMobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navItems = NAV_MAP[role] || ADMIN_NAV

  const isActive = (item: NavItem) => {
    if (item.isCenter) return false
    const qIndex = item.href.indexOf('?')
    if (qIndex !== -1) {
      const basePath = item.href.slice(0, qIndex)
      const wantedStatus = new URLSearchParams(item.href.slice(qIndex + 1)).get('status')
      return pathname === basePath && searchParams && searchParams.get('status') === wantedStatus
    }
    return pathname === item.href
  }

  return (
    <nav aria-label="Navigasi Bawah" className="bg-brand-canvas border border-brand-hairline rounded-xl px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item, index) => {
        const Icon = item.icon
        const active = isActive(item)

        if (item.isCenter) {
          return (
            <Link key={index} href={item.href} aria-label={item.label} className="flex items-center justify-center -translate-y-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl">
              <div className="h-14 w-14 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shadow-md border-2 border-brand-canvas group-active:scale-95 transition-transform">
                <Icon aria-hidden="true" size={24} />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={index}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-2 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${active ? 'text-brand-primary font-semibold' : 'text-brand-ink/60 hover:text-brand-ink'}`}
          >
            <Icon aria-hidden="true" size={20} />
            <span className="text-[10px] uppercase tracking-normal">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const [mounted, setMounted] = useState(false)
  const navItems = NAV_MAP[role] || ADMIN_NAV

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] z-[60]">
      {mounted ? (
        <ActiveMobileBottomNav role={role} />
      ) : (
        <nav aria-label="Navigasi Bawah" className="bg-brand-canvas border border-brand-hairline rounded-xl px-2 py-2 flex items-center justify-around shadow-lg">
          {navItems.map((item, index) => {
            const Icon = item.icon
            if (item.isCenter) {
              return (
                <div key={index} className="flex items-center justify-center -translate-y-5">
                  <div className="h-14 w-14 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shadow-md border-2 border-brand-canvas">
                    <Icon aria-hidden="true" size={24} />
                  </div>
                </div>
              )
            }
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-2 py-2 text-brand-ink/60"
              >
                <Icon aria-hidden="true" size={20} />
                <span className="text-[10px] uppercase tracking-normal">{item.label}</span>
              </div>
            )
          })}
        </nav>
      )}
    </div>
  )
}
