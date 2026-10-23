'use client'

import Link from 'next/link'

const ACTION_LABELS: Record<string, string> = {
  DELETE_REPORT: 'Hapus Laporan',
  DELETE_USER: 'Hapus Akun',
  UPDATE_ROLE: 'Ubah Role',
  VERIFY_USER: 'Verifikasi Akun',
  UPDATE_STATUS: 'Ubah Status',
}

interface AuditLogActionFilterProps {
  filterAction?: string
  baseUrl: string
}

export default function AuditLogActionFilter({ filterAction, baseUrl }: AuditLogActionFilterProps) {
  return (
    <form className="flex items-center gap-3">
      <select
        name="action"
        defaultValue={filterAction || ''}
        aria-label="Filter tindakan"
        onChange={(e) => e.target.form?.requestSubmit()}
        className="min-h-[44px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none cursor-pointer transition-all"
      >
        <option value="">Semua Tindakan</option>
        {Object.entries(ACTION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {filterAction && (
        <Link
          href={baseUrl}
          className="min-h-[44px] px-3 inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
        >
          Reset
        </Link>
      )}
    </form>
  )
}

