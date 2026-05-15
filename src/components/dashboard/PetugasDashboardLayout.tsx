import Link from 'next/link'
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

export default function PetugasDashboardLayout({ profile, successMessage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
       
       {successMessage && <SuccessToast message={successMessage} />}

       <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
         
         {/* 👋 HEADER SECTION */}
         <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Halo, {profile.name}</h1>
             <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Monitoring dan tangani laporan warga Pesona Serpong.</p>
           </div>
         </section>

         {children}
       </main>
    </div>
  )
}
