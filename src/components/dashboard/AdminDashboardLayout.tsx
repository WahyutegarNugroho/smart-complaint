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
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
       
       {successMessage && <SuccessToast message={successMessage} />}

       <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
         
         {/* 👋 HEADER SECTION */}
         <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Halo, {profile.name}</h1>
             <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Pantau operasional dan manajemen warga hari ini.</p>
           </div>
           
           <div className="flex items-center gap-3">
              <Link
                 href="/dashboard/admin/export"
                 className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
              >
                 <Download size={16} /> Ekspor Laporan
              </Link>
           </div>
         </section>

         {children}
       </main>
    </div>
  )
}
