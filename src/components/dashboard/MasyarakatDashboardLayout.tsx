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
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                <ShieldAlert aria-hidden="true" size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Akun Belum Terverifikasi</h4>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                  Akun Anda sedang dalam proses peninjauan oleh pengurus RT/RW setempat. Anda tetap dapat mengirimkan laporan, namun respon dan penanganan akan diprioritaskan bagi warga terverifikasi.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/settings" 
              className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-900 font-semibold text-xs uppercase tracking-wider hover:bg-amber-600 transition-colors text-center w-full md:w-auto shrink-0 shadow-sm"
            >
              Lengkapi Profil
            </Link>
          </div>
        )}

        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-hairline pb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-ink leading-tight">Halo, {profile?.name || 'Warga'}</h1>
            <p className="text-xs text-brand-ink/50">Pantau status pengaduan Anda dan kirim laporan baru jika ada kendala lingkungan.</p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
             <Link
                href="/dashboard/create"
                className="btn-primary py-3 px-6 text-[10px] tracking-normal uppercase w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
             >
                <Plus aria-hidden="true" size={18} /> Buat Laporan
             </Link>
          </div>
        </section>

        {children}
      </main>
    </div>
  )
}

