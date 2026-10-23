'use client'

import React from 'react'
import { Status } from '@prisma/client'
import { CheckCircle2, Activity, Send, Check } from 'lucide-react'

function safeFormatDate(dateVal: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!dateVal) return '-'
  const date = new Date(dateVal)
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', options)
}

function formatTime(dateVal: Date | string | number | null | undefined) {
  if (!dateVal) return ''
  const date = new Date(dateVal)
  return isNaN(date.getTime()) ? '' : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

interface ComplaintStatusStepperProps {
  currentStatus: Status
  createdAt: Date
  responses: Array<{
    createdAt: Date
    officerId?: string | null
    officer?: { name?: string | null; role?: string | null } | null
  }>
}

export default function ComplaintStatusStepper({ currentStatus, createdAt, responses }: ComplaintStatusStepperProps) {
  
  // Ambil respons pertama untuk waktu penanganan dimulai
  const firstResponse = responses.length > 0 ? responses[0] : null;
  // Ambil respons terakhir (asumsi jika status COMPLETED, respons terakhir adalah penutup)
  const lastResponse = responses.length > 0 ? responses[responses.length - 1] : null;

  const steps = [
    { 
      id: Status.PENDING, 
      label: 'Laporan Dikirim', 
      desc: 'Menunggu Verifikasi',
      icon: Send,
      date: createdAt,
      person: null
    },
    { 
      id: Status.PROCESSING, 
      label: 'Penanganan', 
      desc: firstResponse ? 'Sedang Ditindaklanjuti' : 'Menunggu Petugas',
      icon: Activity,
      date: firstResponse ? firstResponse.createdAt : null,
      person: firstResponse?.officer?.name || null
    },
    { 
      id: Status.COMPLETED, 
      label: 'Selesai', 
      desc: currentStatus === Status.COMPLETED ? 'Laporan Ditutup' : 'Belum Selesai',
      icon: CheckCircle2,
      date: currentStatus === Status.COMPLETED && lastResponse ? lastResponse.createdAt : null,
      person: currentStatus === Status.COMPLETED && lastResponse?.officer?.name ? lastResponse.officer.name : null
    }
  ]

  const getStepStatus = (stepId: Status) => {
    if (currentStatus === Status.COMPLETED) return 'completed'
    if (currentStatus === Status.PROCESSING) {
      if (stepId === Status.PENDING) return 'completed'
      if (stepId === Status.PROCESSING) return 'current'
      return 'upcoming'
    }
    // currentStatus === PENDING
    if (stepId === Status.PENDING) return 'current'
    return 'upcoming'
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Status Penanganan</h2>
      
      <div className="relative pl-3 space-y-8">
        {/* Vertical Line */}
        <div className="absolute left-[23px] top-[24px] bottom-[24px] w-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
        
        {steps.map((step) => {
          const status = getStepStatus(step.id)
          const isCompleted = status === 'completed'
          const isCurrent = status === 'current'
          const Icon = isCompleted ? Check : step.icon

          return (
            <div key={step.id} className="flex gap-4 relative">
              <div 
                className={`shrink-0 h-9 w-9 mt-0.5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm' 
                    : isCurrent 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-4 ring-blue-100 dark:ring-blue-950/60' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon size={16} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold tracking-tight transition-colors ${
                    isCompleted || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </h4>
                  {step.date && (
                    <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400 text-right">
                      {formatTime(step.date)}
                    </span>
                  )}
                </div>
                
                <p className={`text-xs mt-0.5 transition-colors ${
                  isCurrent ? 'text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {step.desc}
                </p>

                {(step.date || step.person) && (
                  <div className={`mt-2 flex flex-col gap-1 text-[10px] font-mono p-2.5 rounded-xl border ${
                    isCurrent ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                  }`}>
                    {step.person && (
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white">Petugas:</span> {step.person}
                      </div>
                    )}
                    {step.date && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        {safeFormatDate(step.date, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
