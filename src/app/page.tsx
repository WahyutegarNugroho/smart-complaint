import React from 'react';
import { 
  Zap,
  MapPin,
  Clock,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import prisma from '@/lib/prisma';

export const revalidate = 60;

export default async function LandingPage() {
  // Query dynamic stats — all parallel
  const [totalReports, completedReports, avgHoursResult, activeBlocksResult] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({ where: { status: 'COMPLETED' } }),
    prisma.$queryRaw<{ avg_hours: number | null }[]>`
      SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 3600) AS avg_hours
      FROM "Complaint"
      WHERE "status" = 'COMPLETED'
    `,
    prisma.complaint.groupBy({
      by: ['rt'],
      where: { rt: { not: null } }
    }),
  ])
  
  const successRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 100;

  const avgHours = avgHoursResult?.[0]?.avg_hours;
  const averageResponseHours = avgHours && avgHours > 0 ? Math.max(1, Math.round(avgHours)) : 12;

  const activeBlocks = activeBlocksResult.length || 5;

  return (
    <div className="min-h-screen bg-brand-canvas-soft selection:bg-brand-primary selection:text-brand-ink font-sans overflow-x-hidden animate-page">
      {/* Navigation - Clean & Brand Native */}
      <nav className="fixed top-0 z-50 w-full border-b border-brand-hairline bg-brand-canvas shadow-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-brand bg-brand-primary text-[#0e0f0c] shadow-lg shadow-brand-primary/20">
                <Zap size={18} className="sm:w-[22px] sm:h-[22px]" fill="currentColor" />
              </div>
              <span className="text-base sm:text-xl font-bold text-brand-ink tracking-tight uppercase">
                Smart<span className="text-brand-primary">Complaint</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-normal text-brand-ink/60">
              <a href="#fitur" className="hover:text-brand-primary transition-colors">Kategori</a>
              <Link href="/alur" className="hover:text-brand-primary transition-colors">Alur Pelayanan</Link>
              <a href="#statistik" className="hover:text-brand-primary transition-colors">Statistik Wilayah</a>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/login" className="text-[11px] sm:text-[13px] font-bold uppercase tracking-normal text-brand-ink/60 hover:text-brand-primary transition-colors">
                Masuk
              </Link>
              <Link
                href="/register"
                className="btn-primary py-2 sm:py-2.5 px-4 sm:px-6 text-[11px] sm:text-[13px] tracking-normal uppercase"
              >
                Daftar
              </Link>
              <div className="hidden md:block border-l border-brand-hairline h-6 mx-2" />
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Data-First & Content Split (No Centered Slop) */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-20 bg-brand-canvas-soft border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Contextual & Structural Data */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-brand-hairline bg-brand-canvas px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-ink">
                <span className="h-2 w-2 rounded-full bg-brand-primary"></span>
                Sistem Pengaduan Pesona Serpong
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-brand-ink leading-[1.05]">
                Laporkan Kendala Lingkungan. Pantau Proses Perbaikan.
              </h1>
              
              <p className="text-base text-brand-ink/70 max-w-xl leading-relaxed font-medium">
                Pusat aduan infrastruktur, kebersihan, dan keamanan warga Pesona Serpong. Laporan langsung dikirim ke pengurus RT/RW untuk penanganan terintegrasi.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/register"
                  className="btn-primary py-3.5 px-6 text-xs text-center uppercase tracking-wider shadow-sm"
                >
                  Kirim Laporan Warga
                </Link>
                <Link
                  href="/alur"
                  className="inline-flex items-center justify-center gap-2 rounded-brand bg-brand-canvas px-6 py-3.5 text-xs font-bold text-brand-ink border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                >
                  Prosedur Penanganan
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="pt-6 border-t border-brand-hairline flex items-center gap-4 text-xs text-brand-ink/60">
                <span>Total <span className="font-mono tabular-nums font-bold text-brand-ink">{totalReports}</span> aduan warga</span>
                <span className="text-brand-hairline">•</span>
                <span>Penyelesaian <span className="font-mono tabular-nums font-bold text-brand-primary">{successRate}%</span></span>
                <span className="text-brand-hairline">•</span>
                <span>Aktif di <span className="font-mono tabular-nums font-bold text-brand-ink">{activeBlocks}</span> RT</span>
              </div>
            </div>

            {/* Right Column: Dynamic Stats & Asymmetric Real Data Visualization */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-brand-canvas border border-brand-hairline p-5 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
                  <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider">Metrik Operasional</span>
                  <span className="text-[10px] font-mono tabular-nums font-bold text-brand-primary uppercase tracking-normal">Live</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-brand-ink mb-1.5">
                      <span>Efisiensi Respons Tindakan</span>
                      <span className="font-mono tabular-nums">{successRate}%</span>
                    </div>
                    <div className="h-2 bg-brand-canvas-soft rounded-full overflow-hidden border border-brand-hairline">
                      <div className="h-full bg-brand-primary rounded-full" style={{ width: `${successRate}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-brand-canvas-soft p-3 rounded-lg border border-brand-hairline">
                      <span className="text-[9px] font-semibold text-brand-ink/50 uppercase block">Respons Lapangan</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-brand-ink mt-0.5 block">{averageResponseHours} jam</span>
                    </div>
                    <div className="bg-brand-canvas-soft p-3 rounded-lg border border-brand-hairline">
                      <span className="text-[9px] font-semibold text-brand-ink/50 uppercase block">Wilayah Terintegrasi</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-brand-ink mt-0.5 block">{activeBlocks} RT</span>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-brand-hairline bg-brand-canvas-soft">
                  <Image
                    src="/hero.png"
                    alt="Peta wilayah operasional Pesona Serpong"
                    fill
                    sizes="(min-width: 1024px) 35vw, 90vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Activity Summary (Replaces Banned Cards Row Layout) */}
      <section id="statistik" className="py-6 bg-brand-panel text-brand-panel-fg border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider block">Pemantauan Terkini</span>
              <span className="text-xs text-brand-panel-fg/60 mt-0.5 block">Akumulasi laporan dan kinerja tindak lanjut petugas di area pemukiman</span>
            </div>
            
            <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 border-t border-brand-panel-fg/10 pt-4 md:pt-0 md:border-t-0">
              <div>
                <span className="text-[9px] text-brand-panel-fg/50 uppercase block">Aduan Masuk</span>
                <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{totalReports}</span>
              </div>
              <div>
                <span className="text-[9px] text-brand-panel-fg/50 uppercase block">Tingkat Solusi</span>
                <span className="text-xl font-bold font-mono tabular-nums text-brand-primary mt-0.5 block">{successRate}%</span>
              </div>
              <div>
                <span className="text-[9px] text-brand-panel-fg/50 uppercase block">Rata-rata Penanganan</span>
                <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{averageResponseHours} jam</span>
              </div>
              <div>
                <span className="text-[9px] text-brand-panel-fg/50 uppercase block">Wilayah Aktif</span>
                <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{activeBlocks} RT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Actions Section - Dense & Structured */}
      <section id="fitur" className="py-14 bg-brand-canvas border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Grid Content: Context & Action Callouts */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">Kategori Laporan</span>
                <h2 className="text-2xl font-bold text-brand-ink tracking-tight mt-1">Sektor Penanganan Pengaduan Lingkungan</h2>
              </div>
              <p className="text-xs text-brand-ink/75 leading-relaxed font-medium">
                Setiap laporan diklasifikasikan ke bidang operasional spesifik guna memastikan delegasi tugas yang akurat ke tim pemeliharaan RT/RW.
              </p>
              <div>
                <Link href="/bantuan/panduan" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-ink transition-colors">
                  Panduan Pelaporan Warga →
                </Link>
              </div>
            </div>

            {/* Right Grid Content: Dense Asymmetric Listing (Not Uniform Cards Grid) */}
            <div className="lg:col-span-7 border border-brand-hairline rounded-xl bg-brand-canvas-soft divide-y divide-brand-hairline overflow-hidden">
              {LANDING_FEATURES.map((f, i) => (
                <div key={i} className="p-4 sm:p-5 flex gap-4 items-start hover:bg-brand-canvas transition-colors">
                  <div className="h-8 w-8 bg-brand-canvas border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink/60 shrink-0">
                    <f.icon size={16} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs font-bold text-brand-ink uppercase tracking-normal">{f.title}</h3>
                    <p className="text-xs text-brand-ink/60 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section - Simple & Directly Semantic */}
      <section className="py-12 bg-brand-panel text-brand-panel-fg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-bold tracking-tight">Kirimkan kendala lingkungan Anda sekarang</h2>
            <p className="text-xs text-brand-panel-fg/60">Daftarkan akun atau masuk untuk melaporkan kendala dan melihat progress pengerjaan.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/register"
              className="flex-1 md:flex-none btn-primary py-3 px-6 text-xs text-center uppercase tracking-wider"
            >
              Daftar Akun
            </Link>
            <Link
              href="/login"
              className="flex-1 md:flex-none px-6 py-3 rounded-brand border border-brand-panel-fg/20 text-brand-panel-fg text-xs font-bold text-center hover:bg-brand-panel-fg/10 transition-colors uppercase tracking-wider"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Clear Directory Map */}
      <footer className="bg-brand-canvas py-12 border-t border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-brand-primary text-[#0e0f0c] flex items-center justify-center font-bold text-xs">
                  <Zap size={14} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-brand-ink uppercase tracking-tight">Smart<span className="text-brand-primary">Complaint</span></span>
              </div>
              <p className="text-xs text-brand-ink/60 leading-relaxed max-w-sm">
                Sistem pengelolaan pengaduan warga resmi Perumahan Pesona Serpong, Tangerang Selatan.
              </p>
            </div>
            
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-bold text-brand-ink uppercase tracking-wider">Informasi Lingkungan</h4>
              <ul className="space-y-2 text-xs text-brand-ink/60">
                <li><Link href="/informasi/struktur" className="hover:text-brand-ink transition-colors">Struktur Pengurus</Link></li>
                <li><Link href="/informasi/keamanan" className="hover:text-brand-ink transition-colors">Keamanan Lingkungan</Link></li>
                <li><Link href="/informasi/agenda" className="hover:text-brand-ink transition-colors">Agenda Kegiatan</Link></li>
                <li><Link href="/informasi/darurat" className="hover:text-brand-ink transition-colors">Kontak Darurat</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-bold text-brand-ink uppercase tracking-wider">Bantuan & Regulasi</h4>
              <ul className="space-y-2 text-xs text-brand-ink/60">
                <li><Link href="/bantuan/panduan" className="hover:text-brand-ink transition-colors">Panduan Pengguna</Link></li>
                <li><Link href="/bantuan/privasi" className="hover:text-brand-ink transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/bantuan/kontak" className="hover:text-brand-ink transition-colors">Kontak Pengelola</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-brand-hairline flex flex-col sm:flex-row justify-between items-center text-[10px] text-brand-ink/40 font-mono">
            <p>© {new Date().getFullYear()} Pesona Serpong. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">v1.0.0 · Sistem Pengaduan Warga</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const LANDING_FEATURES = [
  { 
    title: 'Lapor Dari Rumah', 
    desc: 'Kirim laporan kendala lingkungan kapan saja secara online tanpa harus mencari pengurus RT secara fisik.', 
    icon: Zap,
  },
  { 
    title: 'Titik Lokasi Akurat', 
    desc: 'Deteksi otomatis koordinat lokasi dan data RT/RW untuk mempermudah pengerjaan tim di lapangan.', 
    icon: MapPin,
  },
  { 
    title: 'Progress Transparan', 
    desc: 'Pantau tahapan status perbaikan laporan dari mulai diterima, dikerjakan, hingga dinyatakan selesai.', 
    icon: Clock,
  },
  { 
    title: 'Sektor Kebersihan', 
    desc: 'Penanganan aduan pembuangan sampah liar, tumpukan limbah jalanan, serta area hijau terbengkalai.', 
    icon: BarChart3,
  },
  { 
    title: 'Sektor Keamanan', 
    desc: 'Saluran pelaporan cepat untuk gangguan ketertiban umum dan kendala keamanan lingkungan pemukiman.', 
    icon: ShieldCheck,
  },
  { 
    title: 'Data Evaluasi Warga', 
    desc: 'Akumulasi seluruh data laporan tersimpan rapi sebagai bahan pertimbangan rapat berkala warga.', 
    icon: Users,
  },
];


