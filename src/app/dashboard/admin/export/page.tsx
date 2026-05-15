import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  ChevronLeft, 
  CheckCircle2,
  FileBarChart,
  Download,
  ShieldCheck
} from 'lucide-react'
import { ExportButtons } from './export-buttons'
import PrintStyles from './PrintStyles'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ExportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')

  // 📊 Fetch latest complaints for print preview
  const complaints = await prisma.complaint.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: 50 // Limit for print stability
  })

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-20">
      <PrintStyles />
      
      <main className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12 no-print">
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Manajemen Laporan</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Ekspor Data & Arsip</h1>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm md:text-base transition-colors">Unduh data laporan masyarakat untuk keperluan evaluasi berkala.</p>
          </div>
        </section>

        <section className="space-y-8">
           <ExportButtons />

           <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-5 transition-colors">
              <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2 transition-colors">Panduan Ekspor</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                    Format CSV sangat cocok untuk diolah kembali di Excel, sementara Cetak PDF akan menghasilkan dokumen ringkasan yang siap dipresentasikan pada rapat warga atau pengurus RT/RW.
                 </p>
              </div>
           </div>
        </section>
      </main>

      {/* 📄 PRINT-ONLY CONTENT */}
      <div className="hidden print:block p-10 bg-white text-slate-900">
        <div className="flex items-center justify-between mb-10 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-bold tracking-tight">SmartComplaint<span>.</span></h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Laporan Pengaduan Masyarakat - Pesona Serpong</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold uppercase tracking-widest">Tanggal Cetak</p>
             <p className="text-lg font-bold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left font-bold p-3">NO</th>
              <th className="text-left font-bold p-3">JUDUL LAPORAN</th>
              <th className="text-left font-bold p-3">KATEGORI</th>
              <th className="text-left font-bold p-3">DOMISILI</th>
              <th className="text-left font-bold p-3">STATUS</th>
              <th className="text-left font-bold p-3">TANGGAL</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={c.id} className="border-b">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-bold">{c.title}</td>
                <td className="p-3 uppercase">{c.category}</td>
                <td className="p-3">RT {c.rt}/{c.rw}</td>
                <td className="p-3 font-bold uppercase">{c.status}</td>
                <td className="p-3">{c.createdAt.toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-20 flex justify-end">
           <div className="text-center w-64 border-t border-slate-900 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-16">Admin Pesona Serpong</p>
              <p className="text-sm font-bold underline">{profile.name}</p>
           </div>
        </div>
      </div>
    </div>
  )
}
