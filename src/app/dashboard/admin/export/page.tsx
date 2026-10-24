import { redirect } from 'next/navigation'
import { getAdminExportData, ComplaintWithAuthorForExport } from '@/lib/dal'
import { getCachedProfile } from '@/lib/profile'
import Link from 'next/link'
import { 
  ChevronLeft, 
  CheckCircle2,
  FileBarChart
} from 'lucide-react'
import { ExportButtons } from './export-buttons'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'MENUNGGU',
  PROCESSING: 'DIPROSES',
  COMPLETED: 'SELESAI',
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-500',
  PROCESSING: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
}

export default async function ExportPage() {
  const authData = await getCachedProfile()
  if (authData.status === 'UNAUTHENTICATED' || !authData.profile) redirect('/login')

  const { profile } = authData
  if (profile.role !== 'ADMIN') redirect('/dashboard')

  // 📊 Fetch complaints for print preview (with safety limit)
  let complaints: ComplaintWithAuthorForExport[] = []
  let exportError = false
  try {
    complaints = await getAdminExportData(500)
  } catch (err) {
    console.error('Export Fetch Error:', err)
    exportError = true
  }

  // Compute summary metrics
  const total = complaints.length
  const pending = complaints.filter(c => c.status === 'PENDING').length
  const processing = complaints.filter(c => c.status === 'PROCESSING').length
  const completed = complaints.filter(c => c.status === 'COMPLETED').length
  const urgent = complaints.filter(c => c.isUrgent && c.status !== 'COMPLETED').length
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const statuses = [
    { label: 'MENUNGGU', count: pending, pct: total > 0 ? Math.round((pending / total) * 100) : 0, color: 'bg-amber-500' },
    { label: 'DIPROSES', count: processing, pct: total > 0 ? Math.round((processing / total) * 100) : 0, color: 'bg-blue-500' },
    { label: 'SELESAI', count: completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0, color: 'bg-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 no-print">
        {/* HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                aria-label="Kembali ke Dashboard"
                className="h-11 w-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </Link>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Manajemen Rekapitulasi Data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Ekspor Data & Arsip Laporan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
              Unduh rekapitulasi data pengaduan masyarakat untuk evaluasi berkala dan pelaporan resmi RW.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <ExportButtons />

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Panduan Format Ekspor</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Format CSV dan Excel sangat cocok untuk pengolahan statistik lanjutan di spreadsheet, sedangkan Dokumen PDF menyajikan format dokumen resmi yang siap dipresentasikan pada musyawarah warga atau rapat evaluasi pengurus RT/RW.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 📄 PRINT-ONLY CONTENT */}
      <div className="hidden print:block">
        <style>{`
          @page {
            size: A4;
            margin: 2cm 2cm 2.5cm 2cm;
          }
          @page :first {
            margin-top: 2.5cm;
          }
          body {
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            line-height: 1.5;
          }
          table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
          .page-break { page-break-before: always; }
          .no-break { page-break-inside: avoid; }
          .summary-row td {
            padding: 2pt 6pt;
            font-size: 7.5pt;
          }
        `}</style>

        {/* ===== COVER PAGE ===== */}
        <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-16">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-10">
            <FileBarChart size={44} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Laporan Pengaduan Masyarakat
          </h1>
          <p className="text-[11pt] font-bold uppercase tracking-normal text-slate-400 mb-12">
            SmartComplaint
          </p>
          <div className="w-32 h-1 bg-slate-900 mb-12" />
          <div className="space-y-3 text-[10pt] text-slate-600">
            <p>Periode: <span className="font-bold text-slate-900">Seluruh Data</span></p>
            <p>Tanggal Cetak: <span className="font-bold text-slate-900">{today}</span></p>
            <p>Diekspor oleh: <span className="font-bold text-slate-900">{profile.name}</span></p>
          </div>
          <div className="mt-20 text-[9pt] text-slate-400 italic">
            Dokumen ini berisi ringkasan seluruh laporan pengaduan masyarakat
          </div>
        </div>

        {/* ===== PAGE 2: EXECUTIVE SUMMARY ===== */}
        <div className="page-break px-16 py-12">
          <div className="flex items-center justify-between mb-12 border-b-2 border-slate-900 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Ringkasan Eksekutif</h2>
              <p className="text-[9pt] text-slate-500 mt-1">Executive Summary Report</p>
            </div>
            <p className="text-[8pt] text-slate-400">{today}</p>
          </div>

          {/* KPI Cards */}
          <div className="flex gap-4 mb-10">
            <div className="flex-1 bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between min-h-[120px]">
              <div>
                <p className="text-[8pt] font-bold uppercase tracking-normal text-slate-400">Total Laporan</p>
                <p className="text-4xl font-bold tracking-tight mt-2 font-mono tabular-nums">{total}</p>
              </div>
            </div>
            <div className="flex-[3] grid grid-cols-3 gap-4">
              {[
                { label: 'Menunggu', value: pending, color: 'bg-amber-500' },
                { label: 'Diproses', value: processing, color: 'bg-blue-500' },
                { label: 'Selesai', value: completed, color: 'bg-emerald-500' },
              ].map(kpi => (
                <div key={kpi.label} className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between min-h-[120px]">
                  <div className="flex items-center justify-between">
                    <p className="text-[8pt] font-bold uppercase tracking-normal text-slate-400">{kpi.label}</p>
                    <div className={'w-2 h-2 rounded-full ' + kpi.color} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Alert */}
          {urgent > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-5 mb-10 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <p className="text-[10pt] font-bold text-red-700">
                {urgent} laporan berprioritas tinggi masih memerlukan penanganan segera.
              </p>
            </div>
          )}

          {/* Status Distribution */}
          <div className="no-break">
            <h3 className="text-[10pt] font-bold text-slate-900 uppercase tracking-normal mb-5">Distribusi Status</h3>
            <div className="space-y-4">
              {statuses.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-[9pt] mb-1.5">
                    <span className="font-bold text-slate-700">{s.label}</span>
                    <span className="font-bold text-slate-900">{s.count} laporan ({s.pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={'h-full rounded-full ' + s.color} style={{ width: s.pct + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== PAGE 3+: DETAIL TABLE ===== */}
        {!exportError && complaints.length > 0 && (
        <div className="page-break px-16 py-12">
          <div className="flex items-center justify-between mb-8 border-b-2 border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daftar Laporan</h2>
              <p className="text-[8pt] text-slate-500 mt-0.5">{total} laporan tercatat</p>
            </div>
            <p className="text-[7pt] text-slate-400">{today}</p>
          </div>

          <table className="w-full text-[7.5pt] border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500 w-8">No</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Judul Laporan</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Kategori</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Pelapor</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Domisili</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-left font-bold p-2.5 text-[7pt] uppercase tracking-wider text-slate-500">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => {
                const statusLabel = STATUS_LABEL[c.status] || c.status
                return (
                  <tr key={c.id} className={'border-b border-slate-100 ' + (i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                    <td className="p-2.5 align-top text-slate-400 font-medium">{i + 1}</td>
                    <td className="p-2.5 align-top font-bold text-slate-900">{c.title}</td>
                    <td className="p-2.5 align-top uppercase text-[7pt] text-slate-600">{c.category}</td>
                    <td className="p-2.5 align-top text-slate-700">{c.author?.name || 'Anonim'}</td>
                    <td className="p-2.5 align-top text-slate-600">RT {c.rt}/{c.rw}</td>
                    <td className="p-2.5 align-top">
                      <span className={'inline-block px-2 py-0.5 rounded text-white text-[6.5pt] font-bold uppercase ' + (STATUS_COLOR[c.status] || 'bg-slate-500')}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="p-2.5 align-top text-slate-600 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        )}

        {exportError && (
          <div className="px-16 py-12 text-center text-red-600 font-bold">
            Gagal memuat data laporan. Silakan coba refresh halaman.
          </div>
        )}

        {!exportError && complaints.length === 0 && (
          <div className="px-16 py-12 text-center text-slate-400 font-bold">
            Belum ada laporan masyarakat.
          </div>
        )}

        {/* ===== SIGNATURE ===== */}
        {complaints.length > 0 && (
        <div className="px-16 py-4 flex justify-end">
          <div className="border-t-2 border-slate-900 pt-6 text-right max-w-xs">
            <p className="text-[9pt] text-slate-500 mb-2">Mengetahui,</p>
            <p className="text-[10pt] font-bold text-slate-900 mb-6">{profile.name}</p>
            <p className="text-[8pt] text-slate-400">SmartComplaint - Platform Pengaduan Warga</p>
          </div>
        </div>
        )}

      </div>
    </div>
  )
}

