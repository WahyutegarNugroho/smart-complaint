'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Check, ShieldAlert, BellOff, CheckCheck } from 'lucide-react'
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/app/dashboard/actions'

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
  const [now, setNow] = useState<number>(0)
  const [desktopPos, setDesktopPos] = useState<{ top: number; left: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  // Sync state if initialNotifications changes (e.g. Server Component updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(initialNotifications)
    }, 0)
    return () => clearTimeout(timer)
  }, [initialNotifications])

  // Get current time on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(Date.now())
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Polling: fetch notifications every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data: NotificationItem[] = await res.json()
          setNotifications(data)
        }
      } catch (err) {
        console.error('Notification polling error:', err)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
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
    if (now === 0) return 'Baru saja'
    
    const diffMs = now - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    return `${diffDays} hari lalu`
  }

  const handleToggle = () => {
    const willOpen = !isOpen
    setIsOpen(willOpen)
    if (willOpen && bellRef.current && window.innerWidth >= 768) {
      const rect = bellRef.current.getBoundingClientRect()
      setDesktopPos({
        top: rect.bottom + 12,
        left: rect.left,
      })
    } else {
      setDesktopPos(null)
    }
  }

  const dropdownContent = (
    <>
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Notifikasi Anda</h4>
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <>
              <button
                onClick={async () => {
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
                  try {
                    await markAllNotificationsAsRead()
                  } catch (err) {
                    console.error('Mark all as read error:', err)
                    setNotifications(initialNotifications)
                  }
                }}
                className="text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                title="Tandai semua telah dibaca"
              >
                <CheckCheck size={14} /> Sudah Dibaca
              </button>
              <span className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
              <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider tabular-nums">
                {unreadCount} Baru
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <BellOff aria-hidden="true" size={28} className="mb-2 text-slate-400 dark:text-slate-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Belum Ada Notifikasi</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Laporan baru atau tanggapan petugas akan muncul di sini</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 transition-colors flex items-start gap-3.5 ${notif.isRead ? 'bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-850/50' : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/60'}`}
            >
              <div className="shrink-0 pt-0.5">
                {notif.type === 'DELETE' ? (
                  <div className="h-8 w-8 bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl flex items-center justify-center border border-rose-200 dark:border-rose-900/50">
                    <ShieldAlert aria-hidden="true" size={16} />
                  </div>
                ) : (
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'}`}>
                    <Bell aria-hidden="true" size={16} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white font-semibold'}`}>
                  {notif.message}
                </p>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                  {formatTime(notif.createdAt)}
                </span>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="shrink-0 h-7 w-7 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-center text-slate-400 hover:text-blue-800 dark:hover:text-blue-400 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  title="Tandai dibaca"
                  aria-label="Tandai notifikasi telah dibaca"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 BELL BUTTON */}
      <button
        ref={bellRef}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Escape') setIsOpen(false) }}
        className="relative h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell aria-hidden="true" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold tabular-nums border border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 📋 DROPDOWN MENU */}
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Dropdown */}
          <div className="fixed inset-x-4 top-20 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden md:hidden text-slate-900 dark:text-white">
            {dropdownContent}
          </div>

          {/* Desktop Dropdown (Portal to body) */}
          {desktopPos && createPortal(
            <div
              className="fixed z-[9999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-white"
              style={{ top: desktopPos.top, left: desktopPos.left, width: '384px' }}
            >
              {dropdownContent}
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  )
}

