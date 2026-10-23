import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Notification } from '@prisma/client'
import Link from 'next/link'
import { Suspense } from 'react'
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
  History,
  Map
} from 'lucide-react'
import { logout } from '@/app/auth/actions'
import MobileBottomNav from '@/components/MobileBottomNav'
import ThemeToggle from '@/components/ThemeToggle'
import SidebarLink from '@/components/dashboard/SidebarLink'
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
    return <SessionErrorState error={data.error} />
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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-4 focus:bg-brand-panel focus:text-brand-panel-fg focus:rounded-xl focus:text-sm focus:font-bold focus:shadow-xl focus:outline-none">
        Langsung ke konten utama
      </a>

      {/* 📱 Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-brand-canvas border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 h-screen transition-colors duration-500 no-print" role="navigation" aria-label="Navigasi sidebar">

        {/* Logo Section - compact, no card wrapper */}
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" aria-label="SmartComplaint - Beranda" className="flex items-center gap-3 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg">
            <div className="h-8 w-8 bg-blue-800 text-white rounded-lg flex items-center justify-center shadow-sm">
              <ShieldCheck aria-hidden="true" size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-brand-ink leading-none truncate">SmartComplaint<span className="text-emerald-500">.</span></span>
              <span className="text-[10px] font-medium text-brand-ink/50 uppercase tracking-normal">Platform Pengaduan</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu - flat, dense, no card wrappers */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">

          {/* Primary Navigation */}
          <div className="mb-3">
            <SidebarLink href="/dashboard" label="Beranda" iconNode={<LayoutDashboard size={16} />} />
            <SidebarLink href="/dashboard/map" label="Peta Laporan" iconNode={<Map size={16} />} />
            {isWarga && (
              <SidebarLink href="/dashboard/create" label="Lapor Masalah" iconNode={<PlusCircle size={16} />} />
            )}
          </div>

          {/* Status Filters - compact with badges inline */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="px-2 mb-1.5">
              <span className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Status Laporan</span>
            </div>
            <SidebarLink
              href="/dashboard?status=PENDING"
              label="Menunggu"
              iconNode={<Clock size={14} />}
              badge={stats.pending}
              badgeClassName="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              className="hover:text-slate-900"
              activeClassName="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold"
            />
            <SidebarLink
              href="/dashboard?status=PROCESSING"
              label="Diproses"
              iconNode={<Activity size={14} />}
              badge={stats.processing}
              badgeClassName="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
              className="hover:text-amber-600"
              activeClassName="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 font-semibold"
            />
            <SidebarLink
              href="/dashboard?status=COMPLETED"
              label="Selesai"
              iconNode={<CheckCircle2 size={14} />}
              badge={stats.completed}
              badgeClassName="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
              className="hover:text-emerald-600"
              activeClassName="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold"
            />
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="px-2 mb-1.5">
                <span className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal">Administrasi</span>
              </div>
              <SidebarLink href="/dashboard/admin/users" label="Data Penduduk" iconNode={<Users size={16} />} />
              <SidebarLink href="/dashboard/admin/announcements" label="Pengumuman" iconNode={<Megaphone size={16} />} />
              <SidebarLink href="/dashboard/admin/audit-log" label="Aktivitas Admin" iconNode={<History size={16} />} />
            </div>
          )}

        </nav>

        {/* User Profile & Logout - compact, no card wrapper */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <Link href="/dashboard/settings" aria-label={`Pengaturan akun ${profile.name}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-canvas-soft transition-colors group mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-sm shrink-0 flex items-center justify-center rounded-lg border border-blue-200 dark:border-blue-900">
              {(profile.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-ink truncate">{profile.name}</p>
              <p className="text-[10px] font-medium text-brand-ink/50">
                {profile.role === 'PETUGAS' ? 'Petugas Teknis' : profile.role === 'ADMIN' ? 'Administrator' : 'Warga'}
              </p>
            </div>
            <ChevronRight aria-hidden="true" size={12} className="text-brand-ink/40 group-hover:text-blue-600 transition-colors" />
          </Link>

          <form action={logout}>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <LogOut aria-hidden="true" size={14} />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* 📱 Mobile Bottom Navigation */}
      <div className="no-print">
        <Suspense fallback={<div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] h-[66px] bg-white border border-slate-200 rounded-2xl shadow-lg animate-pulse" />}>
          <MobileBottomNav role={profile.role} />
        </Suspense>
      </div>

      {/* 📱 Mobile Top Bar */}
      <header className="md:hidden bg-brand-canvas border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 transition-colors duration-500 no-print">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-800 text-white rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck aria-hidden="true" size={18} />
          </div>
          <span className="font-bold text-sm tracking-tight text-brand-ink uppercase transition-colors">SmartComplaint<span className="text-emerald-500">.</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown notifications={notifications} />
          <ThemeToggle />
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-[10px] transition-colors">
            {(profile.name || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 mb-24 md:mb-0 bg-brand-canvas-soft overflow-x-hidden transition-colors duration-500">
        {children}
      </main>
    </div>
  )
}

