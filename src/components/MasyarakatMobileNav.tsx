'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Plus, 
  Settings2, 
  Inbox,
  LayoutGrid
} from 'lucide-react'

export default function MasyarakatMobileNav() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', label: 'Beranda', icon: Home, active: isActive('/dashboard') && !pathname.includes('status') },
    { href: '/dashboard?status=PENDING', label: 'Aduan', icon: Inbox, active: pathname.includes('status=PENDING') },
    { href: '/dashboard/create', label: 'Lapor', icon: Plus, isCenter: true },
    { href: '/dashboard#announcements', label: 'Info', icon: LayoutGrid, active: false },
    { href: '/dashboard/settings', label: 'Profil', icon: Settings2, active: isActive('/dashboard/settings') },
  ]

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[60] animate-in slide-in-from-bottom-10 duration-700">
        <div className="bg-slate-950/90 dark:bg-slate-900/95 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] px-2 py-3 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {navItems.map((item, index) => {
            const Icon = item.icon

            if (item.isCenter) {
              return (
                <Link key={index} href={item.href} className="flex flex-col items-center justify-center -translate-y-10 group">
                  <div className="h-16 w-16 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-4 border-slate-900 ring-4 ring-slate-900/10 group-active:scale-90 transition-all duration-300">
                    <Plus size={32} />
                  </div>
                </Link>
              )
            }

            return (
                <Link 
                  key={index} 
                  href={item.href} 
                  className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${item.active ? 'text-blue-400' : 'text-slate-500 active:scale-95'}`}
                >
                 <Icon size={22} className={`${item.active ? 'scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'opacity-70'}`} />
                 <span className={`text-[9px] font-bold uppercase tracking-widest ${item.active ? 'opacity-100' : 'opacity-50'}`}>{item.label}</span>
                 {item.active && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                 )}
               </Link>
            )
          })}

       </div>
    </div>
  )
}
