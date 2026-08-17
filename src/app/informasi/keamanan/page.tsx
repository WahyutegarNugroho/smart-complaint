import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

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

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Kontak Cepat Keamanan</p>
              <h2 className="text-sm font-semibold text-brand-ink mt-0.5">Pos Keamanan Utama</h2>
            </div>
            <a 
              href="tel:02112345678"
              aria-label="Hubungi Pos Keamanan di (021) 1234-5678" 
              className="px-4 py-2 bg-brand-canvas-soft hover:bg-brand-hairline border border-brand-hairline rounded-lg text-sm font-mono font-bold tabular-nums text-brand-ink transition-colors"
            >
              (021) 1234-5678
            </a>
          </div>

          <div className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Jadwal & Titik Jaga</h3>
            <div className="divide-y divide-brand-hairline border border-brand-hairline rounded-lg">
              {[
                { title: 'Pos Utama', desc: 'Gerbang Utama', schedule: '24 Jam' },
                { title: 'Pos Jaga 2', desc: 'Jalan Flamboyan', schedule: '24 Jam' },
                { title: 'Pos Jaga 3', desc: 'Jalan Anggrek', schedule: '18.00 - 06.00 WIB' },
                { title: 'Patroli Lingkungan', desc: 'Keliling Blok A - F', schedule: '22.00 - 05.00 WIB' },
              ].map((item, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-brand-ink block">{item.title}</span>
                    <span className="text-brand-ink/60">{item.desc}</span>
                  </div>
                  <span className="font-mono text-brand-primary tabular-nums font-medium">{item.schedule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


