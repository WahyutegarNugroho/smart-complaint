import React from 'react';
import {
  Megaphone,
  MapPin,
  Trash2,
  Wrench,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  ClipboardList
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
  ]);

  const successRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 100;

  const avgHours = avgHoursResult?.[0]?.avg_hours;
  const averageResponseHours = avgHours && avgHours > 0 ? Math.max(1, Math.round(avgHours)) : 12;

  const activeBlocks = activeBlocksResult.length || 5;

  return (
    <div className="min-h-screen bg-brand-canvas-soft selection:bg-brand-primary selection:text-brand-ink font-sans overflow-x-hidden animate-page">
      {/* Navigation - Civic & Brand Native */}
      <nav className="fixed top-0 z-50 w-full border-b border-brand-hairline bg-brand-canvas/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-brand-ink shadow-sm">
                <Megaphone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-brand-ink tracking-tight">
                  Smart<span className="text-brand-primary">Complaint</span>
                </span>
                <span className="text-[10px] text-brand-ink/50 font-semibold tracking-normal -mt-0.5">
                  Warga Pesona Serpong
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-brand-ink/60">
              <a href="#kategori" className="hover:text-brand-ink transition-colors">Kategori Aduan</a>
              <a href="#rekap" className="hover:text-brand-ink transition-colors">Rekap Wilayah</a>
              <Link href="/alur" className="hover:text-brand-ink transition-colors">Alur Penanganan</Link>
              <Link href="/informasi/struktur" className="hover:text-brand-ink transition-colors">Pengurus Lingkungan</Link>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 hover:text-brand-ink px-2 py-2 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="btn-primary py-2.5 px-4 sm:px-5 text-xs tracking-wider uppercase font-bold"
              >
                Lapor Kendala
              </Link>
              <div className="hidden sm:block border-l border-brand-hairline h-5 mx-1" />
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Content-First & Civic Clarity */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-brand-hairline bg-brand-canvas-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Contextual & Narrative Lead */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink/60 uppercase tracking-wider">
                <MapPin size={15} className="text-brand-primary shrink-0" />
                <span>Kanal Resmi Pengaduan RT/RW Perumahan Pesona Serpong</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-brand-ink leading-[1.1]">
                Laporkan Kendala Lingkungan, Kawal Perbaikan Hingga Tuntas.
              </h1>

              <p className="text-sm sm:text-base text-brand-ink/75 max-w-xl leading-relaxed">
                Pusat aduan warga untuk sarana jalan, sanitasi lingkungan, hingga ketertiban umum. Setiap laporan diteruskan langsung ke pengurus lingkungan dan dipantau proses tindak lanjutnya secara terbuka.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="btn-primary py-3.5 px-6 text-xs text-center uppercase tracking-wider"
                >
                  Kirim Pengaduan Baru
                </Link>
                <Link
                  href="/alur"
                  className="inline-flex items-center justify-center gap-2 rounded-brand bg-brand-canvas px-6 py-3.5 text-xs font-bold text-brand-ink border border-brand-hairline hover:bg-brand-canvas-soft transition-colors"
                >
                  Lihat Prosedur Tindak Lanjut
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="pt-6 border-t border-brand-hairline grid grid-cols-3 gap-3 text-left">
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase font-semibold">Total Aduan</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-brand-ink mt-0.5 block">{totalReports} laporan</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase font-semibold">Terselesaikan</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-brand-primary mt-0.5 block">{successRate}% tuntas</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase font-semibold">Rukun Tetangga</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-brand-ink mt-0.5 block">{activeBlocks} RT aktif</span>
                </div>
              </div>
            </div>

            {/* Right Column: Grounded Community Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-brand-canvas border border-brand-hairline p-4 sm:p-5 space-y-4 shadow-sm">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-brand-hairline bg-brand-canvas-soft">
                  <Image
                    src="/hero.png"
                    alt="Peta Wilayah Lingkungan Pesona Serpong"
                    fill
                    sizes="(min-width: 1024px) 35vw, 90vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-brand-canvas/90 backdrop-blur-sm border border-brand-hairline px-3 py-2 text-[11px] font-medium text-brand-ink flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-brand-primary" />
                      Area Pemantauan Pemukiman
                    </span>
                    <span className="font-mono text-[10px] text-brand-ink/60">Tangerang Selatan</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-brand-canvas-soft border border-brand-hairline">
                    <span className="text-[10px] font-semibold text-brand-ink/50 uppercase block">Rata-rata Respon</span>
                    <span className="text-base font-bold font-mono text-brand-ink mt-0.5 block">~{averageResponseHours} Jam</span>
                    <span className="text-[10px] text-brand-ink/60 mt-0.5 block">Penanganan terkoordinasi</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-brand-canvas-soft border border-brand-hairline">
                    <span className="text-[10px] font-semibold text-brand-ink/50 uppercase block">Status Pengawasan</span>
                    <span className="text-base font-bold text-brand-ink mt-0.5 flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                      Siaga RT/RW
                    </span>
                    <span className="text-[10px] text-brand-ink/60 mt-0.5 block">Koordinasi petugas aktif</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real Performance & Monitoring Summary */}
      <section id="rekap" className="py-12 bg-brand-canvas border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">Transparansi Kinerja</span>
            <h2 className="text-2xl font-bold tracking-tight text-brand-ink mt-1">Rekapitulasi Pengaduan Lingkungan</h2>
            <p className="text-xs sm:text-sm text-brand-ink/70 mt-1">
              Data dihimpun langsung dari sistem penanganan lapangan pengurus RT/RW untuk menjaga keterbukaan informasi warga.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-xl bg-brand-canvas-soft border border-brand-hairline">
              <span className="text-[10px] font-semibold text-brand-ink/60 uppercase block">Total Laporan</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-ink mt-2 block">{totalReports}</span>
              <span className="text-[11px] text-brand-ink/50 mt-1 block">Aduan masuk ke sistem</span>
            </div>
            <div className="p-5 rounded-xl bg-brand-canvas-soft border border-brand-hairline">
              <span className="text-[10px] font-semibold text-brand-ink/60 uppercase block">Terselesaikan</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-primary mt-2 block">{completedReports}</span>
              <span className="text-[11px] text-brand-ink/50 mt-1 block">{successRate}% tingkat penyelesaian</span>
            </div>
            <div className="p-5 rounded-xl bg-brand-canvas-soft border border-brand-hairline">
              <span className="text-[10px] font-semibold text-brand-ink/60 uppercase block">Rata-rata Waktu</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-ink mt-2 block">{averageResponseHours} jam</span>
              <span className="text-[11px] text-brand-ink/50 mt-1 block">Dari verifikasi hingga tuntas</span>
            </div>
            <div className="p-5 rounded-xl bg-brand-canvas-soft border border-brand-hairline">
              <span className="text-[10px] font-semibold text-brand-ink/60 uppercase block">Wilayah Tercakup</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-ink mt-2 block">{activeBlocks} RT</span>
              <span className="text-[11px] text-brand-ink/50 mt-1 block">Lingkungan rukun tetangga</span>
            </div>
          </div>
        </div>
      </section>

      {/* Authentic Complaint Categories */}
      <section id="kategori" className="py-16 bg-brand-canvas-soft border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">Klasifikasi Permasalahan</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-ink tracking-tight mt-1">Sektor Penanganan Aduan Warga</h2>
            <p className="text-xs sm:text-sm text-brand-ink/70 mt-1.5 leading-relaxed">
              Setiap aduan dikelompokkan ke bidang operasional yang tepat agar petugas terkait dapat segera melakukan peninjauan dan perbaikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CIVIC_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-brand-canvas border border-brand-hairline hover:border-brand-primary/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink">
                      <cat.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-brand-ink">{cat.title}</h3>
                      <span className="text-[11px] text-brand-ink/50 font-medium">{cat.tagline}</span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-ink/75 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-3 border-t border-brand-hairline space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/40 block">Contoh Masalah Terkait:</span>
                    <ul className="space-y-1">
                      {cat.examples.map((ex, i) => (
                        <li key={i} className="text-xs text-brand-ink/65 flex items-start gap-2">
                          <span className="text-brand-primary leading-none mt-1">•</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-brand-hairline flex items-center justify-between">
                  <Link
                    href="/register"
                    className="text-xs font-bold text-brand-primary hover:text-brand-ink transition-colors flex items-center gap-1.5"
                  >
                    Lapor di Sektor Ini
                    <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/bantuan/panduan"
                    className="text-[11px] text-brand-ink/40 hover:text-brand-ink transition-colors"
                  >
                    Panduan Lengkap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Workflow Section (Replacing Template Content) */}
      <section className="py-14 bg-brand-canvas border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block">Prosedur Respons</span>
              <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Alur Tindak Lanjut dari Laporan ke Solusi</h2>
              <p className="text-xs sm:text-sm text-brand-ink/70 leading-relaxed">
                Setiap laporan yang dikirimkan warga melewati tahapan verifikasi yang transparan. Petugas lapangan diwajibkan menyertakan bukti dokumentasi sebelum laporan ditutup.
              </p>
              <div className="pt-2">
                <Link
                  href="/alur"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-ink transition-colors"
                >
                  Buka Rincian Diagram Alur Kerja
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-brand-primary">01</span>
                  <h4 className="text-xs font-bold text-brand-ink uppercase">Input & Foto</h4>
                </div>
                <p className="text-[11px] text-brand-ink/65 leading-relaxed">
                  Warga mengisi detail kendala, melampirkan foto kondisi nyata, dan menentukan nomor RT.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-brand-primary">02</span>
                  <h4 className="text-xs font-bold text-brand-ink uppercase">Disposisi RT</h4>
                </div>
                <p className="text-[11px] text-brand-ink/65 leading-relaxed">
                  Pengurus RT/RW memvalidasi laporan dan menugaskan petugas teknis/lapangan yang berwenang.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-brand-primary">03</span>
                  <h4 className="text-xs font-bold text-brand-ink uppercase">Hasil & Selesai</h4>
                </div>
                <p className="text-[11px] text-brand-ink/65 leading-relaxed">
                  Petugas mengunggah foto penyelesaian pekerjaan. Pelapor menerima pemberitahuan status tuntas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harmonized Civic Callout */}
      <section className="py-14 bg-brand-canvas-soft border-b border-brand-hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-brand-panel text-brand-panel-fg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left max-w-xl">
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Partisipasi Warga</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Ada kendala atau kerusakan di sekitar rumah Anda?</h2>
              <p className="text-xs sm:text-sm text-brand-panel-fg/70 leading-relaxed">
                Sampaikan laporan sekarang untuk membantu pengurus RT/RW mempercepat perbaikan fasilitas dan menjaga ketertiban bersama di Pesona Serpong.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                href="/register"
                className="btn-primary py-3 px-6 text-xs text-center uppercase tracking-wider font-bold"
              >
                Kirim Laporan
              </Link>
              <Link
                href="/informasi/darurat"
                className="px-5 py-3 rounded-brand border border-brand-panel-fg/20 text-brand-panel-fg text-xs font-bold text-center hover:bg-brand-panel-fg/10 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} />
                Kontak Darurat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Civic Directory */}
      <footer className="bg-brand-canvas py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded bg-brand-primary text-brand-ink flex items-center justify-center font-bold text-xs">
                  <Megaphone size={15} />
                </div>
                <span className="text-sm font-bold text-brand-ink tracking-tight">
                  Smart<span className="text-brand-primary">Complaint</span>
                </span>
              </div>
              <p className="text-xs text-brand-ink/65 leading-relaxed max-w-sm">
                Sistem pengelolaan pengaduan dan aspirasi warga resmi Perumahan Pesona Serpong, Kelurahan Serpong, Tangerang Selatan.
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs text-brand-ink/50">
                <Link href="/informasi/darurat" className="hover:text-brand-ink transition-colors flex items-center gap-1">
                  <PhoneCall size={12} />
                  Nomor Darurat
                </Link>
                <span>•</span>
                <Link href="/alur" className="hover:text-brand-ink transition-colors flex items-center gap-1">
                  <ClipboardList size={12} />
                  Alur Pengaduan
                </Link>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-bold text-brand-ink uppercase tracking-wider">Informasi Lingkungan</h4>
              <ul className="space-y-2 text-xs text-brand-ink/60">
                <li><Link href="/informasi/struktur" className="hover:text-brand-ink transition-colors">Struktur Pengurus RT/RW</Link></li>
                <li><Link href="/informasi/keamanan" className="hover:text-brand-ink transition-colors">Pos & Jadwal Keamanan</Link></li>
                <li><Link href="/informasi/agenda" className="hover:text-brand-ink transition-colors">Agenda Kegiatan Warga</Link></li>
                <li><Link href="/informasi/darurat" className="hover:text-brand-ink transition-colors">Kontak Darurat Terpadu</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-bold text-brand-ink uppercase tracking-wider">Bantuan & Regulasi</h4>
              <ul className="space-y-2 text-xs text-brand-ink/60">
                <li><Link href="/bantuan/panduan" className="hover:text-brand-ink transition-colors">Panduan Penggunaan</Link></li>
                <li><Link href="/bantuan/privasi" className="hover:text-brand-ink transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/bantuan/kontak" className="hover:text-brand-ink transition-colors">Hubungi Pengelola</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-hairline flex flex-col sm:flex-row justify-between items-center text-[10px] text-brand-ink/40 font-mono">
            <p>© {new Date().getFullYear()} Warga Pesona Serpong. Hak cipta dilindungi.</p>
            <p className="mt-2 sm:mt-0">Sistem Pengaduan Lingkungan Warga</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const CIVIC_CATEGORIES = [
  {
    title: 'Kebersihan & Sanitasi Lingkungan',
    tagline: 'Seksi Lingkungan Hidup',
    desc: 'Penanganan masalah sampah yang terlambat diangkut, pembersihan saluran air drainase lingkungan, dan penumpukan limbah liar.',
    icon: Trash2,
    examples: [
      'Tempat pembuangan sampah liar di bahu jalan blok',
      'Saluran got mampet dan bau saat musim hujan',
      'Pohon tumbang atau dahan lebat menutup jalan komplek',
    ],
  },
  {
    title: 'Infrastruktur Jalan & Penerangan',
    tagline: 'Seksi Pembangunan & Sarana',
    desc: 'Perbaikan sarana fisik pemukiman demi keselamatan berkendara dan kenyamanan pejalan kaki warga perumahan.',
    icon: Wrench,
    examples: [
      'Lampu Penerangan Jalan Umum (PJU) padam',
      'Paving block jalan lingkungan amblas atau berlubang',
      'Tutup selokan/drainase rusak atau hilang',
    ],
  },
  {
    title: 'Keamanan & Ketertiban Pemukiman',
    tagline: 'Seksi Keamanan & Ketenteraman',
    desc: 'Koordinasi pos pengamanan satpam perumahan untuk ketertiban bersama dan antisipasi gangguan lingkungan.',
    icon: ShieldCheck,
    examples: [
      'Kendaraan tamu atau warga parkir menutup akses darurat',
      'Gangguan kebisingan di luar jam ketenangan malam',
      'Laporan tamu mencurigakan di area perumahan',
    ],
  },
  {
    title: 'Fasilitas Sosial & Ruang Bersama',
    tagline: 'Seksi Sarana & Prasarana',
    desc: 'Pemeliharaan fasilitas umum milik warga agar tetap bersih, layak pakai, dan aman bagi anak-anak serta keluarga.',
    icon: Building2,
    examples: [
      'Kerusakan sarana bermain anak di taman warga',
      'Fasilitas balai warga atau pos ronda perlu perbaikan',
      'Area lapangan olahraga warga yang terbengkalai',
    ],
  },
];
