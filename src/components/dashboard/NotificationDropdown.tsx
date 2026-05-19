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
        className="relative h-10 w-10 bg-brand-canvas border border-brand-hairline rounded-xl flex items-center justify-center text-brand-ink/70 hover:text-brand-primary hover:border-brand-primary hover:shadow-sm transition-all cursor-pointer"
        aria-label="Notifikasi"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black tracking-tighter border-2 border-brand-canvas animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 📋 DROPDOWN MENU */}
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-brand-canvas-soft/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-4 top-20 z-50 bg-brand-canvas border border-brand-hairline rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 md:absolute md:inset-auto md:right-0 md:top-full md:mt-3 md:w-96 md:z-50 text-brand-ink">
            <div className="p-5 border-b border-brand-hairline flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-ink">Notifikasi Anda</h4>
              {unreadCount > 0 && (
                <span className="bg-red-50 dark:bg-red-950/20 text-red-500 text-[9px] font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-brand-hairline">
              {notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-brand-ink/40">
                  <BellOff size={28} className="mb-2 text-brand-ink/20" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Belum Ada Notifikasi</p>
                  <p className="text-[9px] font-medium text-brand-ink/50 mt-1">Laporan baru atau tanggapan akan muncul di sini</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-5 transition-colors flex items-start gap-4 ${notif.isRead ? 'bg-transparent' : 'bg-brand-canvas-soft'}`}
                  >
                    <div className="shrink-0 pt-0.5">
                      {notif.type === 'DELETE' ? (
                        <div className="h-8 w-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center border border-red-500/20">
                          <ShieldAlert size={16} />
                        </div>
                      ) : (
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${notif.isRead ? 'bg-brand-canvas-soft text-brand-ink/40 border-brand-hairline' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}>
                          <Bell size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-brand-ink/60' : 'text-brand-ink font-medium'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[8px] font-bold text-brand-ink/40 uppercase tracking-wider block">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="shrink-0 h-6 w-6 rounded-md hover:bg-brand-canvas-soft flex items-center justify-center text-brand-ink/40 hover:text-brand-primary transition-all cursor-pointer"
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
        </>
      )}
    </div>
  )
}
