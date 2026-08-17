import { ShieldAlert } from 'lucide-react'
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
    <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brand-ink">Moderasi</h3>
          <p className="text-[10px] font-medium text-brand-ink/50 uppercase tracking-wider">Kontrol Status Laporan</p>
        </div>
      </div>

      <form action={updateComplaintStatus} className="space-y-4">
        <input type="hidden" name="id" value={complaintId} />
        <div>
          <label className="block text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider mb-2">Ubah Progress</label>
          <select
            name="status"
            defaultValue={currentStatus}
            aria-label="Ubah status laporan"
            className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-ink focus:ring-2 focus:ring-brand-primary outline-none appearance-none cursor-pointer"
          >
            <option value="PENDING" className="dark:bg-brand-canvas">MENUNGGU KONFIRMASI</option>
            <option value="PROCESSING" className="dark:bg-brand-canvas">SEDANG DIPROSES</option>
            <option value="COMPLETED" className="dark:bg-brand-canvas">DINYATAKAN SELESAI</option>
          </select>
        </div>
        <SubmitButton
          className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-3 rounded-lg font-semibold text-[10px] uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
          loadingText="Menyimpan..."
        >
          Simpan Perubahan
        </SubmitButton>
      </form>

      {isAdmin && (
        <div className="mt-6 pt-4 border-t border-brand-hairline">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-3">Tindakan Destruktif</p>
          <DeleteComplaintButton id={complaintId} />
        </div>
      )}
    </div>
  )
}

