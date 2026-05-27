'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  active?: boolean
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
  { href: '/dashboard', label: 'Admin', icon: LayoutGrid, isCenter: true },
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

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()
  const navItems = NAV_MAP[role] || ADMIN_NAV

  const isActive = (item: NavItem) => {
    if (item.isCenter) return false
    if (item.href.includes('status=')) return pathname.includes(item.href.split('status=')[1])
    return pathname === item.href
  }

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[60] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-brand-canvas/90 backdrop-blur-3xl border border-brand-hairline rounded-[2.5rem] px-2 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item)

          if (item.isCenter) {
            return (
              <Link key={index} href={item.href} className="flex flex-col items-center justify-center -translate-y-10 group">
                <div className="h-16 w-16 bg-brand-ink dark:bg-brand-primary rounded-[1.75rem] flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shadow-[0_15px_30px_rgba(0,217,146,0.3)] border-4 border-brand-canvas-soft ring-4 ring-brand-canvas/10 group-active:scale-90 transition-all duration-300">
                  <Icon size={32} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={index}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${active ? 'text-brand-primary' : 'text-brand-ink/40 active:scale-95'}`}
            >
              <Icon size={22} className={`${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,217,146,0.4)]' : 'opacity-70'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-normal ${active ? 'opacity-100' : 'opacity-50'}`}>{item.label}</span>
              {active && (
                <div className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(0,217,146,0.8)]" />
              )}
            </Link>
          )
        })}

      </div>
    </div>
  )
}
