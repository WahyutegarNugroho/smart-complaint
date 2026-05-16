import Link from 'next/link'
import { Download } from 'lucide-react'
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

export default function AdminDashboardLayout({ profile, successMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
       
       {successMessage && <SuccessToast message={successMessage} />}

       <main className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
         
         {/* 👋 HEADER SECTION */}
         <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-hairline pb-8 sm:pb-12">
           <div className="space-y-2">
             <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-brand-ink transition-colors leading-none">Halo, {profile.name}</h1>
             <p className="text-brand-ink/40 font-bold text-[10px] sm:text-[13px] uppercase tracking-widest leading-relaxed">Panel Administrasi Pesona Serpong</p>
           </div>
           
           <div className="flex items-center gap-4">
              <Link
                 href="/dashboard/admin/export"
                 className="inline-flex items-center justify-center gap-3 rounded-brand bg-brand-canvas px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold text-brand-ink shadow-sm border border-brand-hairline hover:bg-brand-canvas-soft transition-all uppercase tracking-widest w-full sm:w-auto"
              >
                 <Download size={18} /> Ekspor Laporan
              </Link>
           </div>
         </section>

         {children}
       </main>
    </div>
  )
}
