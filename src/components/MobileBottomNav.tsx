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
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] z-[60]">
      <nav aria-label="Navigasi Bawah" className="bg-brand-canvas border border-brand-hairline rounded-xl px-2 py-2 flex items-center justify-around shadow-lg">

        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item)

          if (item.isCenter) {
            return (
              <Link key={index} href={item.href} aria-label={item.label} className="flex flex-col items-center justify-center -translate-y-5 group">
                <div className="h-12 w-12 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shadow-md border-2 border-brand-canvas group-active:scale-95 transition-transform">
                  <Icon size={24} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${active ? 'text-brand-primary font-semibold' : 'text-brand-ink/60 hover:text-brand-ink'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] uppercase tracking-normal">{item.label}</span>
            </Link>
          )
        })}

      </nav>
    </div>
  )
}

