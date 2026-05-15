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
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
      
      {successMessage && <SuccessToast message={successMessage} />}

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Halo, {profile.name}</h1>
            <p className="text-slate-600 dark:text-slate-500 font-medium text-sm md:text-base">Ada yang bisa kami bantu untuk lingkungan hari ini?</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all active:scale-95"
             >
                <Plus size={16} /> Buat Laporan
             </Link>
          </div>
        </section>

        {children}
      </main>
    </div>
  )
}
