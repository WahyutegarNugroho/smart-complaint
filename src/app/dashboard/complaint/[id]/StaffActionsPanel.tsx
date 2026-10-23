import { ShieldAlert, ChevronDown } from 'lucide-react'
import { updateComplaintStatus } from '@/app/dashboard/actions'
import DeleteComplaintButton from './DeleteComplaintButton'
import SubmitButton from '@/components/SubmitButton'

export default function StaffActionsPanel({
  complaintId,
  currentStatus,
  isAdmin,
}: {
  complaintId: string
  currentStatus: string
  isAdmin: boolean
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 bg-amber-50 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 shrink-0">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Moderasi Laporan</h3>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pembaruan Tahap Progres</p>
        </div>
      </div>

      <form action={updateComplaintStatus} className="space-y-4">
        <input type="hidden" name="id" value={complaintId} />
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Tahap Penanganan
          </label>
          <div className="relative">
            <select
              name="status"
              defaultValue={currentStatus}
              aria-label="Ubah status laporan"
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none appearance-none cursor-pointer transition-colors"
            >
              <option value="PENDING">MENUNGGU VERIFIKASI</option>
              <option value="PROCESSING">SEDANG DITINDAKLANJUTI</option>
              <option value="COMPLETED">DINYATAKAN SELESAI</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <SubmitButton
          className="w-full bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          loadingText="Menyimpan..."
        >
          Simpan Perubahan
        </SubmitButton>
      </form>

      {isAdmin && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Tindakan Khusus Admin</p>
          <DeleteComplaintButton id={complaintId} />
        </div>
      )}
    </div>
  )
}

