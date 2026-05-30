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
    <div className="relative group bg-brand-canvas rounded-3xl p-20 md:p-32 text-center border border-brand-hairline shadow-sm overflow-hidden flex flex-col items-center justify-center gap-8 transition-all hover:shadow-xl">
       {/* Ambient Gradient Background */}
       <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none">
          <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-brand-primary rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-brand-primary rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
       </div>

       <div className="relative z-10 flex flex-col items-center">
          <div className="h-28 w-28 bg-brand-canvas-soft rounded-3xl flex items-center justify-center text-brand-ink/20 mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform duration-700 ease-out border border-brand-hairline">
             <Icon size={48} className="opacity-40 group-hover:text-brand-primary group-hover:opacity-100 transition-all duration-500" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-brand-ink tracking-tight leading-none mb-4">{title}</h3>
          <p className="text-sm font-medium text-brand-ink/60 max-w-sm mx-auto leading-relaxed">
             {description}
          </p>
       </div>

        {actionHref && actionLabel && (
           <Link 
             href={actionHref} 
             className="relative z-10 px-10 py-4 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] rounded-brand text-[10px] font-semibold uppercase tracking-normal hover:opacity-90 transition-all active:scale-95 shadow-xl"
          >
            {actionLabel}
          </Link>
       )}
    </div>
  )
}


