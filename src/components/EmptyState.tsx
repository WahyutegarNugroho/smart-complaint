import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionHref, 
  actionLabel 
}: EmptyStateProps) {
  return (
    <div className="relative group bg-white dark:bg-slate-900 rounded-[4rem] p-20 md:p-32 text-center border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col items-center justify-center gap-8 transition-all hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/40">
       {/* Ambient Gradient Background */}
       <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none">
          <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-emerald-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
       </div>

       <div className="relative z-10 flex flex-col items-center">
          <div className="h-28 w-28 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700 ease-out border border-slate-100/50 dark:border-slate-700/50">
             <Icon size={48} className="opacity-40 group-hover:text-emerald-500 group-hover:opacity-100 transition-all duration-500" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-4 transition-colors">{title}</h3>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-300 max-w-sm mx-auto leading-relaxed transition-colors">
             {description}
          </p>
       </div>

       {actionHref && actionLabel && (
          <Link 
            href={actionHref} 
            className="relative z-10 px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-bold uppercase tracking-normal hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-95 shadow-2xl shadow-slate-900/20 dark:shadow-emerald-600/40"
          >
            {actionLabel}
          </Link>
       )}
    </div>
  )
}
