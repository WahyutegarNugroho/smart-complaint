import Link from 'next/link'
import { Plus, ShieldAlert } from 'lucide-react'
import SuccessToast from '@/components/SuccessToast'

interface LayoutProps {
  profile: {
    id: string
    name: string
    role: string
    isVerified: boolean
  }
  successMessage?: string
  children: React.ReactNode
}

export default function MasyarakatDashboardLayout({ profile, successMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
      
      {successMessage && <SuccessToast message={successMessage} />}

      <main className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
        
        {/* ⚠️ UNVERIFIED ACCOUNT ALERT BANNER */}
        {!profile.isVerified && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20">
                <ShieldAlert size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Akun Belum Terverifikasi</h4>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                  Akun Anda sedang dalam proses peninjauan oleh pengurus RT/RW setempat. Anda tetap dapat mengirimkan laporan, namun respon dan penanganan akan diprioritaskan bagi warga terverifikasi.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/settings" 
              className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-900 font-bold text-[10px] uppercase tracking-normal hover:bg-amber-600 transition-all text-center w-full md:w-auto shrink-0 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
            >
              Lengkapi Profil
            </Link>
          </div>
        )}

        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-hairline pb-8 sm:pb-12">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-brand-ink transition-colors leading-none">Halo, {profile?.name || 'Warga'}</h1>
            <p className="text-brand-ink/40 font-bold text-[10px] sm:text-[13px] uppercase tracking-normal leading-relaxed">Platform Pengaduan Warga Pesona Serpong</p>
          </div>
          
          <div className="flex items-center gap-4">
             <Link
                href="/dashboard/create"
                className="btn-primary py-3 sm:py-4 px-6 sm:px-8 text-[10px] sm:text-[11px] tracking-normal uppercase shadow-xl shadow-brand-primary/20 w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
             >
                <Plus size={18} /> Buat Laporan
             </Link>
          </div>
        </section>

        {children}
      </main>
    </div>
  )
}

