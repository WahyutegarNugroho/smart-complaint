'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Home, Plus, Settings2, Inbox, Map,
  LayoutDashboard, ClipboardList, Activity, UserCircle,
  BarChart, Users, Megaphone,
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
  { href: '/dashboard/admin/users', label: 'Warga', icon: Users, isCenter: true },
  { href: '/dashboard/admin/announcements', label: 'Siaran', icon: Megaphone },
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

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
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

  const isStaffOrAdmin = role === 'PETUGAS' || role === 'ADMIN'

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] z-[60]">
      <nav aria-label="Navigasi Bawah" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl px-2 py-1.5 flex items-center justify-around shadow-xl">

        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item)

          if (item.isCenter) {
            return (
              <Link 
                key={index} 
                href={item.href} 
                aria-label={item.label} 
                className={`flex items-center justify-center -translate-y-5 group focus-visible:outline-none focus-visible:ring-2 rounded-2xl ${
                  isStaffOrAdmin ? 'focus-visible:ring-blue-600' : 'focus-visible:ring-emerald-600'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-slate-50 dark:border-slate-950 group-active:scale-95 transition-transform ${
                  isStaffOrAdmin 
                    ? 'bg-blue-800 hover:bg-blue-900 shadow-blue-800/30' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                }`}>
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
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-2 py-1.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active 
                  ? 'text-blue-800 dark:text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium'
              }`}
            >
              <Icon aria-hidden="true" size={20} />
              <span className="text-[10px] tracking-normal">{item.label}</span>
            </Link>
          )
        })}

      </nav>
    </div>
  )
}
