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
      cls: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/60'
    },
    LEVEL_2: {
      label: '2',
      desc: 'Melebihi SLA Tanggapan Awal',
      cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
    },
    LEVEL_1: {
      label: '1',
      desc: 'Perlu Perhatian',
      cls: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900/60'
    }
  } as const

  const config = levelConfig[escalationLevel as keyof typeof levelConfig] || levelConfig.LEVEL_1

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${config.cls} shrink-0`}>
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Eskalasi Level {config.label}</h3>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{config.desc}</p>
        </div>
      </div>

      {escalationLogs.length > 0 && (
        <div className="space-y-3 pl-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          {escalationLogs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.reason}</p>
                <p className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
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

