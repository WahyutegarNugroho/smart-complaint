import React from 'react'

export default function SectionSkeleton({ type }: { type: 'stats' | 'announcements' | 'list' | 'detail' | 'form' | 'users' | 'export' | 'chart' }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-brand-canvas p-6 md:p-8 rounded-xl border border-brand-hairline space-y-4 h-32"></div>
        ))}
      </div>
    )
  }

  if (type === 'announcements') {
    return (
      <div className="space-y-6 animate-pulse pt-8">
        <div className="h-4 w-32 bg-brand-hairline rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-brand-canvas p-6 md:p-8 rounded-2xl border border-brand-hairline h-40"></div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-24 bg-brand-hairline rounded-lg"></div>
        <div className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 space-y-6">
          <div className="flex gap-3">
            <div className="h-8 w-20 bg-brand-hairline rounded-lg"></div>
            <div className="h-8 w-32 bg-brand-hairline rounded-lg"></div>
          </div>
          <div className="h-10 w-3/4 bg-brand-hairline rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-brand-hairline rounded"></div>
            <div className="h-4 w-5/6 bg-brand-hairline rounded"></div>
            <div className="h-4 w-2/3 bg-brand-hairline rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-brand-hairline rounded-2xl"></div>
            <div className="h-48 bg-brand-hairline rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-brand-hairline rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-brand-hairline rounded-2xl"></div>
                ))}
              </div>
              <div className="h-14 bg-brand-hairline rounded-2xl"></div>
              <div className="h-40 bg-brand-hairline rounded-2xl"></div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 h-72"></div>
            <div className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 h-80"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'users') {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-brand-canvas rounded-2xl border border-brand-hairline p-6 h-20"></div>
        ))}
      </div>
    )
  }

  if (type === 'export') {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 h-72"></div>
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-brand-canvas rounded-3xl border border-brand-hairline p-8 h-72">
          <div className="h-full w-full bg-brand-hairline rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-pulse pt-12">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-brand-hairline rounded-lg"></div>
        <div className="h-10 w-64 bg-brand-hairline rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-brand-canvas p-5 rounded-2xl border border-brand-hairline h-64"></div>
        ))}
      </div>
    </div>
  )
}
