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

  const levelConfig = {
    LEVEL_3: {
      label: '3',
      desc: 'Melebihi SLA Penanganan',
      cls: 'bg-red-500/10 text-red-600 border-red-500/20'
    },
    LEVEL_2: {
      label: '2',
      desc: 'Melebihi SLA Tanggapan Awal',
      cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    LEVEL_1: {
      label: '1',
      desc: 'Perlu Perhatian',
      cls: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    }
  } as const

  const config = levelConfig[escalationLevel as keyof typeof levelConfig] || levelConfig.LEVEL_1

  return (
    <div className="bg-brand-canvas p-5 rounded-xl border border-brand-hairline shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${config.cls}`}>
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-brand-ink">Eskalasi Level {config.label}</h3>
          <p className="text-[10px] font-medium text-brand-ink/50 uppercase tracking-wider">{config.desc}</p>
        </div>
      </div>

      {escalationLogs.length > 0 && (
        <div className="space-y-3 pl-1">
          {escalationLogs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-brand-ink">{log.reason}</p>
                <p className="text-[10px] font-mono tabular-nums text-brand-ink/40">
                  {log.createdAt 
                    ? new Date(log.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })
                    : '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

