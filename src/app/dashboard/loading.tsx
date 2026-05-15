import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12 animate-pulse">
      {/* 👋 HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-4 w-48 bg-slate-100 dark:bg-slate-900 rounded-lg"></div>
        </div>
        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>

      {/* 📊 KPI CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 📋 LIST SKELETON */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-10 w-64 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 h-64">
              <div className="flex justify-between">
                <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
