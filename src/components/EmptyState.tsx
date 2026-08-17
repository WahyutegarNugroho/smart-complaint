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
    <div className="bg-brand-canvas rounded-xl p-12 md:p-16 text-center border border-brand-hairline shadow-sm flex flex-col items-center justify-center gap-6">
       <div className="flex flex-col items-center max-w-sm mx-auto">
          <div className="h-14 w-14 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-ink/40 mb-4">
             <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-brand-ink tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-brand-ink/60 leading-relaxed">
             {description}
          </p>
       </div>

        {actionHref && actionLabel && (
           <Link 
             href={actionHref} 
             className="px-6 py-2.5 bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {actionLabel}
          </Link>
       )}
    </div>
  )
}


