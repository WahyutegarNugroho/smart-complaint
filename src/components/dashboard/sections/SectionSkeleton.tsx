import React from 'react'

export default function SectionSkeleton({ type }: { type: 'stats' | 'announcements' | 'list' }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4 h-32"></div>
        ))}
      </div>
    )
  }

  if (type === 'announcements') {
    return (
      <div className="space-y-6 animate-pulse pt-8">
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-40"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-pulse pt-12">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-10 w-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 h-64"></div>
        ))}
      </div>
    </div>
  )
}
