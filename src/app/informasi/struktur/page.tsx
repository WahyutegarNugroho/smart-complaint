import Link from 'next/link'

export const metadata = {
  title: 'Struktur Pengurus | Smart Complaint',
}

export default function StrukturPage() {
  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink font-sans animate-page">
      <main className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-16 space-y-8">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider hover:text-brand-primary transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">Struktur Pengurus</h1>
          <p className="text-brand-ink/60 font-medium text-sm leading-relaxed">Susunan kepengurusan Perumahan Pesona Serpong.</p>
        </div>

        <div className="bg-brand-canvas border border-brand-hairline rounded-xl divide-y divide-brand-hairline">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Ketua RW</p>
              <h2 className="text-base font-bold text-brand-ink mt-0.5">Pengurus RW Pesona Serpong</h2>
            </div>
            <span className="text-xs font-mono text-brand-ink/40">Periode Aktif</span>
          </div>

          <div className="p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Seksi & Bidang Kerja</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { role: 'Sekretaris', name: 'Sekretariat RW' },
                { role: 'Bendahara', name: 'Keuangan RW' },
                { role: 'Keamanan', name: 'Seksi Keamanan & Ketertiban' },
                { role: 'Kebersihan', name: 'Seksi Kebersihan & Lingkungan' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-brand-canvas-soft border border-brand-hairline rounded-lg">
                  <span className="text-[10px] font-bold text-brand-primary uppercase">{item.role}</span>
                  <p className="text-xs font-medium text-brand-ink mt-0.5">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Rukun Tetangga (RT)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { rt: 'RT 01', name: 'Koordinator RT 01' },
                { rt: 'RT 02', name: 'Koordinator RT 02' },
                { rt: 'RT 03', name: 'Koordinator RT 03' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-brand-canvas-soft border border-brand-hairline rounded-lg text-center">
                  <span className="text-[10px] font-bold text-brand-primary uppercase">{item.rt}</span>
                  <p className="text-xs font-medium text-brand-ink mt-0.5">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


