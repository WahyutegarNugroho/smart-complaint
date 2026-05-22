'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Settings2, 
  Megaphone, 
  Users,
  BarChart,
  LayoutGrid,
  Map
} from 'lucide-react'
import MasyarakatMobileNav from './MasyarakatMobileNav'
import PetugasMobileNav from './PetugasMobileNav'

interface MobileBottomNavProps {
  role: 'ADMIN' | 'PETUGAS' | 'MASYARAKAT'
}

export default function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const isWarga = role === 'MASYARAKAT'
  const isPetugas = role === 'PETUGAS'

  if (isWarga) return <MasyarakatMobileNav />
  if (isPetugas) return <PetugasMobileNav />

  // Define nav items based on role (Specifically for ADMIN here)
  const getNavItems = () => {
    return [
      { href: '/dashboard', label: 'Stats', icon: BarChart, active: isActive('/dashboard') },
      { href: '/dashboard/map', label: 'Peta', icon: Map, active: isActive('/dashboard/map') },
      { href: '/dashboard', label: 'Admin', icon: LayoutGrid, isCenter: true },
      { href: '/dashboard/admin/users', label: 'Warga', icon: Users, active: isActive('/dashboard/admin/users') },
      { href: '/dashboard/settings', label: 'Profil', icon: Settings2, active: isActive('/dashboard/settings') },
    ]
  }

  const items = getNavItems()

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[60] animate-in slide-in-from-bottom-10 duration-700">
       <div className="bg-brand-canvas/90 backdrop-blur-3xl border border-brand-hairline rounded-[2.5rem] px-2 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          
          {items.map((item, index) => {
            const Icon = item.icon
            
            if (item.isCenter) {
              return (
                <Link key={index} href={item.href} className="flex flex-col items-center justify-center -translate-y-10 group">
                  <div className="h-16 w-16 bg-brand-ink dark:bg-brand-primary rounded-[1.75rem] flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shadow-[0_15px_30px_rgba(0,217,146,0.3)] border-4 border-brand-canvas-soft ring-4 ring-brand-canvas/10 group-active:scale-90 transition-all duration-300">
                    <Icon size={28} />
                  </div>
                </Link>
              )
            }

            return (
              <Link 
                key={index} 
                href={item.href} 
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${item.active ? 'text-brand-primary' : 'text-brand-ink/40 active:scale-95'}`}
              >
                <Icon size={22} className={`${item.active ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,217,146,0.4)]' : 'opacity-70'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-widest ${item.active ? 'opacity-100' : 'opacity-50'}`}>{item.label}</span>
                {item.active && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(0,217,146,0.8)]" />
                )}
              </Link>
            )
          })}

       </div>
    </div>
  )
}
