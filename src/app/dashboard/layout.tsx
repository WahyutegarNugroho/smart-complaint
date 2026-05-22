import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Notification } from '@prisma/client'
import Link from 'next/link'
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Users,
  ShieldCheck,
  Megaphone,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
  History
} from 'lucide-react'
import { logout } from '@/app/auth/actions'
import MobileBottomNav from '@/components/MobileBottomNav'
import ThemeToggle from '@/components/ThemeToggle'
import { getCachedProfile } from '@/lib/profile'
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import NotificationDropdown from '@/components/dashboard/NotificationDropdown'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getCachedProfile()
  
  // Only redirect if explicitly unauthenticated
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  
  // Handle database error status gracefully
  if (data.status === 'ERROR') {
    return <SessionErrorState error={data.error} stack={data.stack} />
  }

  if (!data.profile) {
    return <SessionErrorState error="Profile is missing after successful auth" />
  }

  const { profile } = data

  const isAdmin = profile.role === 'ADMIN'
  const isWarga = profile.role === 'MASYARAKAT'

  // Fetch user notifications
  let notifications: Notification[] = []
  try {
    notifications = await prisma.notification.findMany({
      where: { userId: profile.id },
      orderBy: [
        { isRead: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 10
    })
  } catch (notifErr) {
    console.error('Notifications Fetch Error:', notifErr)
  }

  // 📊 Fetch Stats for Sidebar (Optimized - single GROUP BY query)
  const stats = { pending: 0, processing: 0, completed: 0 }
  
  try {
    const whereBase = isWarga ? { authorId: profile.id } : {}
    const groupCounts = await prisma.complaint.groupBy({
      by: ['status'],
      where: whereBase,
      _count: { status: true },
    })
    for (const g of groupCounts) {
      const key = g.status.toLowerCase() as 'pending' | 'processing' | 'completed'
      stats[key] = g._count.status
    }
  } catch (err) {
    console.error('Dashboard Stats Fetch Error:', err)
  }

  return (
    <div className="min-h-screen bg-brand-canvas-soft flex flex-col md:flex-row font-sans selection:bg-brand-primary/20 text-brand-ink transition-colors duration-500">

      {/* Skip to content link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-4 focus:bg-brand-ink focus:text-brand-canvas focus:rounded-xl focus:text-sm focus:font-bold focus:shadow-2xl focus:outline-none">
        Langsung ke konten utama
      </a>

      {/* 📱 Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-brand-canvas border-r border-brand-hairline flex-col sticky top-0 h-screen transition-colors duration-500 no-print" role="navigation" aria-label="Navigasi sidebar">

        {/* Logo Section */}
        <div className="px-8 pt-8 pb-4">
          <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
            <div className={`h-10 w-10 ${isAdmin ? 'bg-brand-primary text-[#0e0f0c]' : 'bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c]'} rounded-xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-105`}>
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-brand-ink leading-none">SmartComplaint<span>.</span></span>
              <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mt-1">Platform Pengaduan</span>
            </div>
          </Link>
        </div>

        {/* Desktop Quick Toolbar (Notifications & Theme Switcher) */}
        <div className="px-8 pb-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-brand-canvas-soft/80 border border-brand-hairline p-2.5 rounded-2xl shadow-sm justify-between">
             <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest pl-2">Aksi Cepat</span>
             <div className="flex items-center gap-2">
                <NotificationDropdown notifications={notifications} />
                <ThemeToggle />
             </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">

          <div className="px-4 mb-2 mt-4">
            <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest opacity-50">Modul Navigasi</span>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm"
          >
            <LayoutDashboard size={18} className="opacity-70 group-hover:opacity-100" />
            Beranda Utama
          </Link>

          {isWarga && (
            <Link
              href="/dashboard/create"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm transition-all group"
            >
              <PlusCircle size={18} className="opacity-70 group-hover:opacity-100" />
              Lapor Masalah
            </Link>
          )}

          <div className="px-4 mb-2 mt-8">
            <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest opacity-50">Status Pengaduan</span>
          </div>

          <Link
            href="/dashboard?status=PENDING"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-amber-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <Clock size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-amber-500" />
              Menunggu
            </div>
            {stats.pending > 0 && (
              <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-500/10">
                {stats.pending}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard?status=PROCESSING"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-blue-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <Activity size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-blue-500" />
              Diproses
            </div>
            {stats.processing > 0 && (
              <span className="bg-blue-500/10 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-500/10">
                {stats.processing}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard?status=COMPLETED"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-brand-primary" />
              Selesai
            </div>
            {stats.completed > 0 && (
              <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-lg border border-brand-primary/20">
                {stats.completed}
              </span>
            )}
          </Link>

          {isAdmin && (
            <>
              <div className="px-4 mb-2 mt-8">
                <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-wider opacity-50">Administrasi</span>
              </div>
              <Link
                href="/dashboard/admin/users"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm transition-all group"
              >
                <Users size={18} className="opacity-70 group-hover:opacity-100" />
                Data Penduduk
              </Link>
              <Link
                href="/dashboard/admin/announcements"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm transition-all group"
              >
                <Megaphone size={18} className="opacity-70 group-hover:opacity-100" />
                Manajemen Pengumuman
              </Link>
              <Link
                href="/dashboard/admin/audit-log"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-brand-ink/70 hover:bg-brand-canvas-soft hover:text-brand-primary hover:shadow-sm transition-all group"
              >
                <History size={18} className="opacity-70 group-hover:opacity-100" />
                Aktivitas Admin
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-brand-hairline bg-brand-canvas-soft/30 transition-colors">
          <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-canvas hover:shadow-sm transition-all group mb-2 border border-transparent hover:border-brand-hairline cursor-pointer">
            <div className="h-10 w-10 bg-brand-canvas-soft text-brand-ink font-bold text-sm shrink-0 flex items-center justify-center rounded-xl transition-colors">
              {(profile.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-brand-ink truncate leading-none transition-colors">{profile.name}</p>
              <p className="text-[10px] font-medium text-brand-ink/40 mt-1 transition-colors">Pengaturan Akun</p>
            </div>
            <ChevronRight size={14} className="text-brand-ink/30 group-hover:text-brand-primary transition-colors" />
          </Link>

          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all group cursor-pointer">
              <LogOut size={16} className="opacity-70 group-hover:opacity-100" />
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* 📱 Mobile Bottom Navigation */}
      <div className="no-print"><MobileBottomNav role={profile.role} /></div>

      {/* 📱 Mobile Top Bar */}
      <header className="md:hidden bg-brand-canvas/90 backdrop-blur-md border-b border-brand-hairline px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-500 no-print">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 ${isAdmin ? 'bg-brand-primary text-[#0e0f0c]' : 'bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c]'} rounded-lg flex items-center justify-center shadow-lg`}>
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-sm tracking-tight text-brand-ink uppercase transition-colors">SmartComplaint<span>.</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown notifications={notifications} />
          <ThemeToggle />
          <div className="h-8 w-8 bg-brand-canvas-soft border border-brand-hairline rounded-lg flex items-center justify-center text-brand-ink font-bold text-[10px] transition-colors">
            {(profile.name || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 mb-20 md:mb-0 bg-brand-canvas-soft overflow-x-hidden transition-colors duration-500">
        {children}
      </main>
    </div>
  )
}
