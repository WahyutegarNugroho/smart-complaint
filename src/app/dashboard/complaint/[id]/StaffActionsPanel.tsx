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
    <div className="bg-brand-canvas p-8 rounded-[2rem] border border-brand-hairline shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-ink leading-none mb-1">Moderasi</h3>
          <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal">Kontrol Status Laporan</p>
        </div>
      </div>

      <form action={updateComplaintStatus} className="space-y-6">
        <input type="hidden" name="id" value={complaintId} />
        <div>
          <label className="block text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal mb-3 ml-1">Ubah Progress</label>
          <div className="relative group">
            <select
              name="status"
              defaultValue={currentStatus}
              aria-label="Ubah status laporan"
              className="w-full bg-brand-canvas-soft border border-brand-hairline rounded-2xl px-5 py-4 text-[11px] font-bold text-brand-ink focus:ring-4 focus:ring-brand-primary/5 outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="PENDING" className="dark:bg-brand-canvas">MENUNGGU KONFIRMASI</option>
              <option value="PROCESSING" className="dark:bg-brand-canvas">SEDANG DIPROSES</option>
              <option value="COMPLETED" className="dark:bg-brand-canvas">DINYATAKAN SELESAI</option>
            </select>
          </div>
        </div>
        <SubmitButton
          className="w-full bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] py-4.5 rounded-2xl font-bold text-[10px] uppercase tracking-normal hover:opacity-90 transition-all shadow-xl active:scale-[0.98] cursor-pointer"
          loadingText="Menyimpan..."
        >
          Simpan Perubahan
        </SubmitButton>
      </form>

      {isAdmin && (
        <div className="mt-10 pt-10 border-t border-brand-hairline">
          <p className="text-[9px] font-bold text-red-500 uppercase tracking-normal mb-5 ml-1">Tindakan Destruktif</p>
          <DeleteComplaintButton id={complaintId} />
        </div>
      )}
    </div>
  )
}
