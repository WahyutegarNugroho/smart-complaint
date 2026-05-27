import { Zap } from 'lucide-react'

interface EscalationLog {
  id: string
  reason: string
  createdAt: Date
}

export default function EscalationStatus({
  escalationLevel,
  escalationLogs,
}: {
  escalationLevel: string
  escalationLogs: EscalationLog[]
}) {
  if (escalationLevel === 'NONE') return null

  return (
    <div className={`bg-brand-canvas p-8 rounded-[2rem] border shadow-sm transition-all ${
      escalationLevel === 'LEVEL_3' ? 'border-red-500/30' :
      escalationLevel === 'LEVEL_2' ? 'border-amber-500/30' : 'border-orange-500/30'
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
          escalationLevel === 'LEVEL_3' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
          escalationLevel === 'LEVEL_2' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
          'bg-orange-500/10 text-orange-600 border-orange-500/20'
        }`}>
          <Zap size={24} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-ink leading-none mb-1">Eskalasi Level {
            escalationLevel === 'LEVEL_3' ? '3' :
            escalationLevel === 'LEVEL_2' ? '2' : '1'
          }</h3>
          <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal">
            {escalationLevel === 'LEVEL_3' ? 'Melebihi SLA penanganan' :
             escalationLevel === 'LEVEL_2' ? 'Melebihi SLA tanggapan awal' :
             'Perlu perhatian'}
          </p>
        </div>
      </div>

      {escalationLogs.length > 0 && (
        <div className="space-y-4 pl-2">
          {escalationLogs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
              <div>
                <p className="text-[12px] font-bold text-brand-ink">{log.reason}</p>
                <p className="text-[10px] font-medium text-brand-ink/40">
                  {new Date(log.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
