import Link from 'next/link'
import { Map, ClipboardList } from 'lucide-react'
import SuccessToast from '@/components/SuccessToast'
import ErrorToast from '@/components/ErrorToast'

interface LayoutProps {
  profile: {
    id: string
    name: string
    role: string
  }
  successMessage?: string
  errorMessage?: string
  children: React.ReactNode
}

export default function PetugasDashboardLayout({ profile, successMessage, errorMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
       
       {successMessage && <SuccessToast key={successMessage} message={successMessage} />}
       {errorMessage && <ErrorToast key={errorMessage} message={errorMessage} />}

       <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
         
         {/* HEADER SECTION */}
         <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
           <div className="space-y-1">
             <div className="flex items-center gap-2 mb-0.5">
               <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                 Divisi Lapangan & Ketertiban
               </span>
             </div>
             <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-ink leading-tight">Halo, {profile.name}</h1>
             <p className="text-xs text-brand-ink/60">Pantau dan tindak lanjuti laporan warga yang masuk ke sistem penanganan lingkungan.</p>
           </div>

           <div className="flex flex-wrap items-center gap-2.5 shrink-0">
             <Link
               href="/dashboard/map"
               className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
             >
               <Map size={16} className="text-blue-700 dark:text-blue-400" />
               <span>Peta Sebaran</span>
             </Link>
             <Link
               href="/dashboard?status=PENDING"
               className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-semibold text-xs transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
             >
               <ClipboardList size={16} />
               <span>Antrean Menunggu</span>
             </Link>
           </div>
         </section>

         {children}
       </main>
    </div>
  )
}

