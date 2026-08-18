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
  const [totalReports, completedReports, completedComplaints, activeBlocksResult] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({ where: { status: 'COMPLETED' } }),
    prisma.complaint.findMany({
      where: { status: 'COMPLETED' },
      select: { createdAt: true, updatedAt: true }
    }),
    prisma.complaint.groupBy({
      by: ['rt'],
      where: { rt: { not: null } }
    }),
  ])
  
  const successRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 100;
  
  let averageResponseHours = 12;
  if (completedComplaints.length > 0) {
    const totalHours = completedComplaints.reduce((acc, c) => {
      const diffMs = c.updatedAt.getTime() - c.createdAt.getTime();
      return acc + (diffMs / (1000 * 60 * 60));
    }, 0);
    averageResponseHours = Math.max(1, Math.round(totalHours / completedComplaints.length));
  }

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
              <a href="#fitur" className="hover:text-brand-primary transition-colors">Fitur</a>
              <Link href="/alur" className="hover:text-brand-primary transition-colors">Alur</Link>
              <a href="#statistik" className="hover:text-brand-primary transition-colors">Statistik</a>
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

      {/* Hero Section - Asymmetric Data-First */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-20 bg-brand-canvas-soft border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Hero Content - 7 cols */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 rounded-md border border-brand-hairline bg-brand-canvas px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-ink mb-6">
                <span className="h-2 w-2 rounded-full bg-brand-primary"></span>
                Layanan Warga Pesona Serpong
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-brand-ink leading-[1.05] mb-5">
                Pengaduan dan Pemeliharaan Lingkungan Warga.
              </h1>
              
              <p className="text-base text-brand-ink/70 max-w-xl leading-relaxed mb-8 font-medium">
                Laporkan kerusakan jalan, fasilitas umum, kebersihan, atau gangguan keamanan. Laporan langsung diteruskan ke pengurus RT/RW dan petugas lapangan.
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
                  Lihat Alur Kerja
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-hairline flex items-center gap-4 text-xs text-brand-ink/60">
                <span className="font-mono tabular-nums font-bold text-brand-ink">{totalReports}</span> laporan terdaftar
                <span className="text-brand-hairline">•</span>
                <span className="font-mono tabular-nums font-bold text-brand-primary">{successRate}%</span> tuntas
                <span className="text-brand-hairline">•</span>
                <span className="font-mono tabular-nums font-bold text-brand-ink">{activeBlocks}</span> wilayah RT
              </div>
            </div>

            {/* Hero Card - 5 cols */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-brand-canvas border border-brand-hairline p-3 overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
                  <Image
                    src="/hero.png"
                    alt="Pesona Serpong"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - Tabular Numbers */}
      <section id="statistik" className="py-8 bg-brand-panel text-brand-panel-fg border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-brand-panel-fg/10">
            <div className="pt-4 md:pt-0 md:pl-0">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight font-mono tabular-nums">{totalReports}</p>
              <p className="mt-1 text-xs text-brand-panel-fg/60">Total Laporan Masuk</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-primary font-mono tabular-nums">{successRate}%</p>
              <p className="mt-1 text-xs text-brand-panel-fg/60">Tingkat Penanganan</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight font-mono tabular-nums">{averageResponseHours} <span className="text-sm font-sans opacity-60">jam</span></p>
              <p className="mt-1 text-xs text-brand-panel-fg/60">Waktu Respons Rata-rata</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight font-mono tabular-nums">{activeBlocks}</p>
              <p className="mt-1 text-xs text-brand-panel-fg/60">Wilayah RT Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Dense Asymmetric Split */}
      <section id="fitur" className="py-14 bg-brand-canvas border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mb-1">Cakupan Layanan</p>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-ink tracking-tight">Kategori & Fasilitas Pelaporan</h2>
            </div>
            <Link href="/bantuan/panduan" className="text-xs font-semibold text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center gap-1">
              Petunjuk penggunaan →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Primary Feature 6 cols */}
            <div className="md:col-span-6 p-6 rounded-xl border border-brand-hairline bg-brand-canvas-soft flex flex-col justify-between min-h-[220px]">
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-lg bg-brand-panel text-brand-primary flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <h3 className="text-base font-bold text-brand-ink">{LANDING_FEATURES[0].title}</h3>
                <p className="text-xs text-brand-ink/70 leading-relaxed max-w-md">{LANDING_FEATURES[0].desc}</p>
              </div>
              <span className="text-[10px] font-mono font-semibold text-brand-ink/40 uppercase tracking-wider pt-4">Pelaporan 24 Jam</span>
            </div>

            {/* Sub features 6 cols split into 2x2 grid */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LANDING_FEATURES.slice(1, 5).map((f, i) => (
                <div key={i} className="p-4 rounded-xl border border-brand-hairline bg-brand-canvas flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-brand-ink mb-1">{f.title}</h3>
                    <p className="text-xs text-brand-ink/60 leading-relaxed line-clamp-3">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Flattened, Direct */}
      <section className="py-14 bg-brand-panel text-brand-panel-fg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Punya kendala di lingkungan rumah Anda?</h2>
            <p className="text-xs sm:text-sm text-brand-panel-fg/60">Daftarkan akun warga atau masuk untuk memantau status aduan yang sedang berjalan.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="btn-primary py-3 px-6 text-xs uppercase tracking-wider"
            >
              Daftar Warga
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-brand border border-brand-panel-fg/20 text-brand-panel-fg text-xs font-bold hover:bg-brand-panel-fg/10 transition-colors uppercase tracking-wider"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Dense Directory Grid */}
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
    desc: 'Tidak perlu mencari pengurus RT secara fisik. Kirim laporan kapan saja, di mana saja.', 
    icon: Zap,
  },
  { 
    title: 'Titik Lokasi Akurat', 
    desc: 'Deteksi otomatis blok dan nomor rumah menggunakan GPS untuk mempermudah perbaikan.', 
    icon: MapPin,
  },
  { 
    title: 'Timeline Progres', 
    desc: 'Lihat kapan laporan Anda mulai diproses dan estimasi waktu penyelesaian dari pengurus.', 
    icon: Clock,
  },
  { 
    title: 'Laporan Kebersihan', 
    desc: 'Kelola jadwal pengambilan sampah dan laporan area hijau yang kurang terawat.', 
    icon: BarChart3,
  },
  { 
    title: 'Akses Keamanan', 
    desc: 'Laporkan hal mencurigakan langsung ke tim Security perumahan secara cepat.', 
    icon: ShieldCheck,
  },
  { 
    title: 'Data Terpusat', 
    desc: 'Semua data pengaduan tersimpan rapi untuk bahan evaluasi rapat bulanan warga.', 
    icon: Users,
  },
];


