'use client'

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
    <form className="flex items-center gap-4">
      <select
        name="action"
        defaultValue={filterAction || ''}
        aria-label="Filter tindakan"
        onChange={(e) => e.target.form?.requestSubmit()}
        className="bg-brand-canvas-soft border border-brand-hairline rounded-xl px-4 py-3 text-[10px] font-semibold uppercase tracking-normal text-brand-ink focus:ring-4 focus:ring-brand-primary/5 outline-none cursor-pointer transition-all"
      >
        <option value="">Semua Tindakan</option>
        {Object.entries(ACTION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {filterAction && (
        <a href={baseUrl} className="text-[10px] font-semibold text-red-500 uppercase tracking-normal hover:underline">
          Reset
        </a>
      )}
    </form>
  )
}

