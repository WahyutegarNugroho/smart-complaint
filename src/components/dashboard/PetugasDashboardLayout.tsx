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
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 transition-colors duration-500 pb-20 animate-page">
       
       {successMessage && <SuccessToast key={successMessage} message={successMessage} />}

       <main className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
         
         {/* 👋 HEADER SECTION */}
         <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-hairline pb-6">
           <div className="space-y-1">
             <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-ink leading-tight">Halo, {profile.name}</h1>
             <p className="text-xs text-brand-ink/50">Pantau dan proses pengaduan warga yang masuk ke sistem.</p>
           </div>
         </section>

         {children}
       </main>
    </div>
  )
}

