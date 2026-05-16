import Link from 'next/link'
import { Plus } from 'lucide-react'
import SuccessToast from '@/components/SuccessToast'

interface LayoutProps {
  profile: {
    id: string
    name: string
    role: string
  }
  successMessage?: string
  children: React.ReactNode
}

export default function MasyarakatDashboardLayout({ profile, successMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
      
      {successMessage && <SuccessToast message={successMessage} />}

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-hairline pb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black dark:font-normal tracking-tight text-brand-ink transition-colors leading-none">Halo, {profile?.name || 'Warga'}</h1>
            <p className="text-brand-ink/40 font-bold text-[13px] uppercase tracking-widest">Platform Pengaduan Warga Pesona Serpong</p>
          </div>
          
          <div className="flex items-center gap-4">
             <Link
                href="/dashboard/create"
                className="btn-primary py-4 px-8 text-[11px] tracking-widest uppercase shadow-2xl shadow-brand-primary/20"
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
