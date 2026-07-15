import Link from 'next/link'
import { ArrowLeft, ShieldCheck, PhoneCall, Bell } from 'lucide-react'

export const metadata = {
  title: 'Keamanan | Smart Complaint',
}

export default function KeamananPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans selection:bg-brand-primary/20 animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-10">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-ink dark:bg-brand-primary rounded-xl flex items-center justify-center text-brand-canvas dark:text-[#0e0f0c]">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-brand-ink">Keamanan Lingkungan</h1>
          </div>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Informasi dan panduan keamanan untuk warga Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="h-12 w-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <PhoneCall size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">Kontak Darurat</h3>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">Pos Keamanan: (021) 1234-5678</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-brand-ink">Layanan Keamanan 24 Jam</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Pos Satpam Utama', desc: 'Gerbang Utama — Siaga 24 jam', icon: ShieldCheck },
                { title: 'Pos Satpam 2', desc: 'Jalan Flamboyan — Siaga 24 jam', icon: ShieldCheck },
                { title: 'Pos Satpam 3', desc: 'Jalan Anggrek — 18.00 - 06.00', icon: ShieldCheck },
                { title: 'Patroli Malam', desc: 'Setiap jam 22.00 - 05.00', icon: Bell },
              ].map((item, i) => (
                <div key={i} className="bg-brand-canvas-soft rounded-xl p-4 border border-brand-hairline flex items-center gap-3">
                  <item.icon size={18} className="text-brand-primary shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-ink">{item.title}</h4>
                    <p className="text-xs text-brand-ink/50 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">Jika terjadi keadaan darurat, segera hubungi pos keamanan terdekat atau laporkan melalui platform Smart Complaint.</p>
          </div>
        </div>
      </main>
    </div>
  )
}


