import Link from 'next/link'
import { Plus, ShieldAlert } from 'lucide-react'
import SuccessToast from '@/components/SuccessToast'
import ErrorToast from '@/components/ErrorToast'

interface LayoutProps {
  profile: {
    id: string
    name: string
    role: string
    isVerified: boolean
  }
  successMessage?: string
  errorMessage?: string
  children: React.ReactNode
}

export default function MasyarakatDashboardLayout({ profile, successMessage, errorMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
      
      {successMessage && <SuccessToast message={successMessage} />}
      {errorMessage && <ErrorToast message={errorMessage} />}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* ⚠️ UNVERIFIED ACCOUNT ALERT BANNER */}
        {!profile.isVerified && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-lg flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <ShieldAlert aria-hidden="true" size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">Akun Belum Terverifikasi</h4>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
                  Akun Anda sedang dalam proses peninjauan oleh pengurus RT/RW setempat. Anda tetap dapat mengirimkan laporan, namun respon dan penanganan akan diprioritaskan bagi warga terverifikasi.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/settings" 
              className="px-4 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors text-center w-full md:w-auto shrink-0 shadow-sm min-h-[44px] inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
            >
              Lengkapi Profil
            </Link>
          </div>
        )}

        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-hairline pb-5">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-ink leading-tight">Halo, {profile?.name || 'Warga'}</h1>
            <p className="text-xs text-brand-ink/60">Pantau status pengaduan Anda dan kirim laporan baru jika ada kendala lingkungan.</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <Link
                href="/dashboard/create"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 w-full sm:w-auto min-h-[44px]"
             >
                <Plus aria-hidden="true" size={18} /> Buat Laporan Baru
             </Link>
          </div>
        </section>

        {children}
      </main>
    </div>
  )
}

