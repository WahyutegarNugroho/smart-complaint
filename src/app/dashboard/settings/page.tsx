import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/dashboard/actions'
import Link from 'next/link'
import { ChevronLeft, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

import { getCachedProfile } from '@/lib/profile'

import SessionErrorState from '@/components/dashboard/SessionErrorState'
import SettingsForm from './SettingsForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SettingsPage() {
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  if (data.status === 'ERROR' || !data.profile) return <SessionErrorState />

  const { profile } = data

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-300 pb-32">
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/40 hover:text-brand-ink transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-brand-primary uppercase tracking-normal">Konfigurasi Akun</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-ink transition-colors">Pengaturan Profil</h1>
            <p className="text-brand-ink/60 font-medium text-sm md:text-base transition-colors">Perbarui identitas dan informasi domisili Anda untuk verifikasi sistem.</p>
          </div>

          <div className="h-16 w-16 bg-brand-ink dark:bg-brand-primary rounded-2xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c] shrink-0 font-bold text-2xl transition-all">
             {profile.name?.[0] || '?'}
          </div>
        </section>

        <SettingsForm profile={profile} action={updateProfile} />

        {/* 🚪 LOGOUT SECTION (For Mobile) */}
        <section className="pt-8 border-t border-brand-hairline flex flex-col items-center">
          <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal mb-6">Sesi Akun</p>
          <form action={logout} className="w-full max-w-sm">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-red-500/10 text-red-600 dark:text-red-500 font-bold text-xs uppercase tracking-normal border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <LogOut size={18} /> Keluar Dari Sistem
            </button>
          </form>
          <p className="mt-8 text-[10px] font-medium text-brand-ink/40">Smart Complaint v2.0 • Sesi Aman Terenkripsi</p>
        </section>
      </main>
    </div>
  )
}
