'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, Trash2, ShieldAlert, BellOff } from 'lucide-react'
import { markNotificationAsRead } from '@/app/dashboard/actions'

interface NotificationItem {
  id: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date | string
}

interface NotificationDropdownProps {
  notifications: NotificationItem[]
}

export default function NotificationDropdown({ notifications: initialNotifications }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync state if initialNotifications changes (e.g. Server Component updates)
  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
    
    try {
      await markNotificationAsRead(id)
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
      // Rollback on error
      setNotifications(initialNotifications)
    }
  }

  const formatTime = (dateInput: Date | string) => {
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) return 'Baru saja'
    
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    return `${diffDays} hari lalu`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all cursor-pointer"
        aria-label="Notifikasi"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black tracking-tighter border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 📋 DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-950 dark:text-white">Notifikasi Anda</h4>
            {unreadCount > 0 && (
              <span className="bg-red-50 dark:bg-red-950/20 text-red-500 text-[9px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 opacity-60">
                <BellOff size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Belum Ada Notifikasi</p>
                <p className="text-[9px] font-medium text-slate-500 mt-1">Laporan baru atau tanggapan akan muncul di sini</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 transition-colors flex items-start gap-4 ${notif.isRead ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/20'}`}
                >
                  <div className="shrink-0 pt-0.5">
                    {notif.type === 'DELETE' ? (
                      <div className="h-8 w-8 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-lg flex items-center justify-center border border-red-100 dark:border-red-900/30">
                        <ShieldAlert size={16} />
                      </div>
                    ) : (
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${notif.isRead ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'}`}>
                        <Bell size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="shrink-0 h-6 w-6 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
                      title="Tandai dibaca"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
