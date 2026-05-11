import React from 'react';
import { 
  Zap, 
  Camera, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  BarChart3,
  MessageSquare,
  Users,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans overflow-x-hidden">
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <MessageSquare size={20} className="fill-white/20" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent tracking-tight">
                Smart Complaint
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a href="#fitur" className="hover:text-emerald-600 transition-colors">Fitur Warga</a>
              <a href="#cara-kerja" className="hover:text-emerald-600 transition-colors">Alur Lapor</a>
              <a href="#statistik" className="hover:text-emerald-600 transition-colors">Statistik</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                Masuk
              </Link>
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 ease-out hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </span>
                <span>Daftar Warga</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Modern Blob Backgrounds */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl -z-10 opacity-40 mix-blend-multiply blur-3xl sm:opacity-50">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-300 animate-pulse" />
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-teal-300 animate-pulse delay-700" />
          <div className="absolute left-40 top-40 h-72 w-72 rounded-full bg-cyan-200 animate-pulse delay-1000" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 absolute"></span>
                Forum Pengaduan Warga Perumahan Pesona Serpong
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Ciptakan Lingkungan Harmonis di <span className="bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">Pesona Serpong</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Sampaikan keluhan infrastruktur, keamanan, atau kebersihan di lingkungan perumahan kita secara transparan. Mari bergotong-royong demi kenyamanan bersama.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  Buat Laporan Warga
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#cara-kerja"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                >
                  Pelajari Alur Lapor
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                  ))}
                </div>
                <p>Aktif digunakan oleh <span className="text-slate-800 font-bold">500+</span> Kepala Keluarga</p>
              </div>
            </div>

            {/* Hero Image / UI Mockup */}
            <div className="relative hidden lg:block z-10">
              <div className="relative rounded-[3rem] bg-white shadow-2xl ring-1 ring-slate-900/5 p-3 transition-transform duration-700">
                <img
                  src="/hero.png"
                  alt="Gerbang Utama RW Pesona Serpong 08"
                  className="rounded-[2.5rem] w-full h-[550px] object-cover shadow-inner"
                />
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-emerald-900/20 to-transparent mix-blend-overlay"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="statistik" className="relative z-20 -mt-10 mb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 shadow-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/50">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white">850+</p>
                <p className="mt-2 text-slate-400 font-medium">Total Laporan</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-emerald-400">95%</p>
                <p className="mt-2 text-slate-400 font-medium">Tuntas Ditangani</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white">12<span className="text-2xl text-slate-500">h</span></p>
                <p className="mt-2 text-slate-400 font-medium">Respon Pengurus</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-white">10</p>
                <p className="mt-2 text-slate-400 font-medium">Blok Terintegrasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="cara-kerja" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase">Alur Pengaduan</h2>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Hanya 4 Langkah Mudah</p>
            <p className="mt-4 text-lg text-slate-600">Proses didesain simpel agar setiap warga, dari anak muda hingga lansia, bisa melapor dengan nyaman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { title: 'Tulis Keluhan', desc: 'Sampaikan masalah di lingkungan (Misal: Sampah menumpuk).', icon: MessageSquare },
              { title: 'Foto Bukti', desc: 'Sertakan foto lokasi agar mudah ditemukan petugas.', icon: Camera },
              { title: 'Verifikasi RT/RW', desc: 'Pengurus akan mengevaluasi laporan Anda.', icon: ShieldCheck },
              { title: 'Tindak Lanjut', desc: 'Pantau pengerjaan hingga masalah selesai.', icon: CheckCircle },
            ].map((step, index) => (
              <div key={index} className="relative bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm text-center">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-4 border-white">
                  {index + 1}
                </div>
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 rotate-3 transition-transform hover:rotate-12">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest text-teal-600 uppercase">Fitur Perumahan</h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Modernisasi Lingkungan Hunian</p>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { 
                title: 'Lapor Dari Rumah', 
                desc: 'Tidak perlu mencari pengurus RT secara fisik. Kirim laporan kapan saja, di mana saja.', 
                icon: Zap,
                color: 'text-amber-500',
                bg: 'bg-amber-50'
              },
              { 
                title: 'Titik Lokasi Akurat', 
                desc: 'Deteksi otomatis blok dan nomor rumah menggunakan GPS untuk mempermudah perbaikan.', 
                icon: MapPin,
                color: 'text-rose-500',
                bg: 'bg-rose-50'
              },
              { 
                title: 'Timeline Progres', 
                desc: 'Lihat kapan laporan Anda mulai diproses dan estimasi waktu penyelesaian dari pengurus.', 
                icon: Clock,
                color: 'text-blue-500',
                bg: 'bg-blue-50'
              },
              { 
                title: 'Laporan Kebersihan', 
                desc: 'Kelola jadwal pengambilan sampah dan laporan area hijau yang kurang terawat.', 
                icon: BarChart3,
                color: 'text-indigo-500',
                bg: 'bg-indigo-50'
              },
              { 
                title: 'Akses Keamanan', 
                desc: 'Laporkan hal mencurigakan langsung ke tim Security perumahan secara cepat.', 
                icon: ShieldCheck,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50'
              },
              { 
                title: 'Data Terpusat', 
                desc: 'Semua data pengaduan tersimpan rapi untuk bahan evaluasi rapat bulanan warga.', 
                icon: Users,
                color: 'text-teal-500',
                bg: 'bg-teal-50'
              },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img 
            src="/cta-bg.png" 
            alt="Green landscape" 
            className="w-full h-full object-cover scale-110 blur-[1px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-900/40 to-emerald-900/80"></div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Mari Wujudkan Pesona Serpong yang Lebih Nyaman!</h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
            Suara Anda sangat berarti. Laporkan setiap kendala di sekitar hunian Anda agar pengurus bisa segera bertindak.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-emerald-700 shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
          >
            Daftar Sebagai Warga
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-16 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={24} className="text-emerald-500" />
                <span className="text-2xl font-bold text-white">Smart Complaint</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mb-6">
                Platform resmi warga Pesona Serpong untuk komunikasi dua arah antara masyarakat dan pengurus RT/RW demi lingkungan yang asri and aman.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                  <span className="text-sm font-bold">WA</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                  <span className="text-sm font-bold">IG</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Informasi Warga</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Struktur Pengurus</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Jadwal Keamanan</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Agenda Warga</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Darurat/Emergency</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Bantuan</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Panduan Melapor</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kontak Sekretariat</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Smart Complaint Pesona Serpong. Hak Cipta Dilindungi.</p>
            <p className="mt-2 md:mt-0">Dirancang untuk kenyamanan warga Pesona Serpong.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
