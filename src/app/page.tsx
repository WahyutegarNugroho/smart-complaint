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
      <nav className="fixed top-0 z-50 w-full border-b border-brand-hairline bg-brand-canvas/80 backdrop-blur-xl">
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

      {/* Hero Section - The Brand Moment */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 overflow-hidden bg-brand-canvas-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Hero Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-hairline bg-brand-canvas px-4 py-2 text-[10px] font-semibold uppercase tracking-normal text-brand-ink mb-10 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
                Ekosistem Pengaduan Perumahan
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-display font-black tracking-tight text-brand-ink leading-[1.1] lg:leading-[0.95] mb-6 sm:mb-8">
                Ciptakan Lingkungan <span className="text-brand-primary">Harmonis</span> di Pesona Serpong.
              </h1>
              
              <p className="text-xl text-brand-ink/70 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-medium">
                Sampaikan keluhan infrastruktur, keamanan, atau kebersihan secara transparan. Platform modern untuk kenyamanan bersama.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link
                  href="/register"
                  className="w-full sm:w-auto btn-primary py-5 px-10 text-base shadow-xl shadow-brand-primary/30"
                >
                  Buat Laporan Sekarang
                </Link>
                <Link
                  href="/alur"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-brand bg-brand-canvas px-10 py-5 text-base font-bold text-brand-ink shadow-sm border border-brand-hairline hover:bg-brand-canvas-soft transition-all"
                >
                  Pelajari Alur
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => {
                    const colors = ['bg-brand-primary', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500']
                    return (
                      <div key={i} className={`relative h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-4 ring-brand-canvas border border-brand-hairline ${colors[i]} flex items-center justify-center text-[#0e0f0c] text-xs sm:text-sm font-bold`}>
                        {letter}
                      </div>
                    )
                  })}
                </div>
                <p className="text-[11px] sm:text-[13px] font-bold text-brand-ink/50 uppercase tracking-normal text-center sm:text-left">
                  Dipercaya <span className="text-brand-ink underline decoration-brand-primary decoration-4">500+</span> Kepala Keluarga
                </p>
              </div>
            </div>

            {/* Hero Card - Wise Style Surface Contrast */}
            <div className="relative hidden lg:block z-10">
              <div className="relative rounded-3xl bg-brand-canvas shadow-xl ring-1 ring-brand-hairline p-4 aspect-[4/5] overflow-hidden group">
                <Image
                  src="/hero.png"
                  alt="Pesona Serpong"
                  fill
                  className="rounded-3xl object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - SF Mono for Dark Mode */}
      <section id="statistik" className="relative z-20 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-brand bg-brand-panel p-12 shadow-xl border border-brand-hairline">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center md:text-left">
                <p className="text-5xl font-bold tracking-tight text-brand-panel-fg font-mono">{totalReports}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-normal text-brand-primary">Total Laporan</p>
              </div>
              <div className="text-center md:text-left md:border-l md:border-brand-panel-fg/10 md:pl-12">
                <p className="text-5xl font-bold tracking-tight text-brand-primary font-mono">{successRate}%</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-normal text-brand-panel-fg/50">Tuntas Ditangani</p>
              </div>
              <div className="text-center md:text-left md:border-l md:border-brand-panel-fg/10 md:pl-12">
                <p className="text-5xl font-bold tracking-tight text-brand-panel-fg font-mono">{averageResponseHours}<span className="text-2xl opacity-50">h</span></p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-normal text-brand-panel-fg/50">Rata-Rata Penyelesaian</p>
              </div>
              <div className="text-center md:text-left md:border-l md:border-brand-panel-fg/10 md:pl-12">
                <p className="text-5xl font-bold tracking-tight text-brand-panel-fg font-mono">{activeBlocks}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-normal text-brand-panel-fg/50">Blok Terlaporkan</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section - Hairline Cards on Dark / White Cards on Sage */}
      <section id="fitur" className="py-32 bg-brand-canvas-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center lg:text-left">
            <h2 className="text-[11px] font-semibold tracking-normal text-brand-primary uppercase mb-4">Fitur Utama</h2>
            <p className="text-4xl lg:text-5xl font-display font-black text-brand-ink tracking-tight">Modernisasi Lingkungan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LANDING_FEATURES.map((f, i) => (
              <div key={i} className="card-base p-10 group hover:border-brand-primary/50">
                <div className="w-14 h-14 rounded-brand bg-brand-canvas-soft text-brand-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-brand-ink mb-4">{f.title}</h3>
                <p className="text-brand-ink/60 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Polarity Flip */}
      <section className="relative py-40 overflow-hidden bg-brand-panel border-y border-brand-hairline">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--brand-primary)_0%,_transparent_70%)]" />
        </div>
        
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black text-brand-panel-fg mb-8 sm:mb-10 tracking-tight">Wujudkan Pesona Serpong yang Lebih Nyaman!</h2>
          <p className="text-lg sm:text-xl text-brand-panel-fg/60 mb-10 sm:mb-14 max-w-2xl mx-auto font-medium">
            Suara Anda adalah penggerak perubahan. Laporkan kendala sekarang dan pantau progresnya secara transparan.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-brand bg-brand-primary px-10 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-bold text-[#0e0f0c] shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all w-full sm:w-auto"
          >
            Daftar Sebagai Warga
          </Link>
        </div>
      </section>

      {/* Footer - Minimalist Documentation Style */}
      <footer className="bg-brand-canvas py-24 border-t border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <Zap size={28} className="text-brand-primary" fill="currentColor" />
                <span className="text-2xl font-bold text-brand-ink tracking-tighter uppercase">Smart<span className="text-brand-primary">Complaint</span></span>
              </div>
              <p className="text-base text-brand-ink/50 leading-relaxed max-w-sm font-medium mb-10">
                Platform resmi warga Pesona Serpong untuk komunikasi dua arah demi lingkungan yang asri dan aman.
              </p>
              <div className="flex gap-6">
                <div className="h-12 w-12 rounded-brand bg-brand-canvas-soft flex items-center justify-center text-brand-ink/40 hover:text-brand-primary transition-colors cursor-pointer border border-brand-hairline">
                  <span className="text-xs font-bold">WA</span>
                </div>
                <div className="h-12 w-12 rounded-brand bg-brand-canvas-soft flex items-center justify-center text-brand-ink/40 hover:text-brand-primary transition-colors cursor-pointer border border-brand-hairline">
                  <span className="text-xs font-bold">IG</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-[11px] font-semibold text-brand-ink uppercase tracking-normal mb-8">Informasi</h4>
              <ul className="space-y-5 text-[13px] font-bold text-brand-ink/40 uppercase tracking-normal">
                <li><Link href="/informasi/struktur" className="hover:text-brand-primary transition-colors">Struktur</Link></li>
                <li><Link href="/informasi/keamanan" className="hover:text-brand-primary transition-colors">Keamanan</Link></li>
                <li><Link href="/informasi/agenda" className="hover:text-brand-primary transition-colors">Agenda</Link></li>
                <li><Link href="/informasi/darurat" className="hover:text-brand-primary transition-colors">Darurat</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[11px] font-semibold text-brand-ink uppercase tracking-[0.2em] mb-8">Bantuan</h4>
              <ul className="space-y-5 text-[13px] font-bold text-brand-ink/40 uppercase tracking-normal">
                <li><Link href="/bantuan/panduan" className="hover:text-brand-primary transition-colors">Panduan</Link></li>
                <li><Link href="/bantuan/privasi" className="hover:text-brand-primary transition-colors">Privasi</Link></li>
                <li><Link href="/bantuan/kontak" className="hover:text-brand-primary transition-colors">Kontak</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-hairline flex flex-col md:flex-row justify-between items-center text-[11px] font-semibold text-brand-ink/30 uppercase tracking-normal">
            <p>© {new Date().getFullYear()} Smart Complaint Pesona Serpong.</p>
            <p className="mt-4 md:mt-0">Dirancang untuk kenyamanan bersama.</p>
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


