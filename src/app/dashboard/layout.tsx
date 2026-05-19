import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
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
  ChevronRight
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
  if (data.status === 'ERROR' || !data.profile) {
    return <SessionErrorState />
  }

  const { profile } = data

  const isAdmin = profile.role === 'ADMIN'
  const isWarga = profile.role === 'MASYARAKAT'

  // Fetch user notifications
  let notifications: any[] = []
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

  // 📊 Fetch Stats for Sidebar (Optimized with error handling)
  let stats = { pending: 0, processing: 0, completed: 0 }
  
  try {
    const whereBase = isWarga ? { authorId: profile.id } : {}
    const [pendingCount, processingCount, completedCount] = await Promise.all([
      prisma.complaint.count({ where: { ...whereBase, status: 'PENDING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'PROCESSING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'COMPLETED' } }),
    ])
    
    stats = {
      pending: pendingCount,
      processing: processingCount,
      completed: completedCount
    }
  } catch (err) {
    console.error('Dashboard Stats Fetch Error:', err)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col md:flex-row font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* 📱 Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-[#FBFBFC] dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col sticky top-0 h-screen transition-colors">

        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
            <div className={`h-10 w-10 ${isAdmin ? 'bg-emerald-600' : 'bg-slate-900 dark:bg-blue-600'} rounded-xl flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-105`}>
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">SmartComplaint<span>.</span></span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Platform Pengaduan</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationDropdown notifications={notifications} />
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">

          <div className="px-4 mb-2 mt-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">Modul Navigasi</span>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm"
          >
            <LayoutDashboard size={18} className="opacity-70 group-hover:opacity-100" />
            Beranda Utama
          </Link>

          {isWarga && (
            <Link
              href="/dashboard/create"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition-all group"
            >
              <PlusCircle size={18} className="opacity-70 group-hover:opacity-100" />
              Lapor Masalah
            </Link>
          )}

          <div className="px-4 mb-2 mt-8">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">Status Pengaduan</span>
          </div>

          <Link
            href="/dashboard?status=PENDING"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <Clock size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-amber-500" />
              Menunggu
            </div>
            {stats.pending > 0 && (
              <span className="bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {stats.pending}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard?status=PROCESSING"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <Activity size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-blue-500" />
              Diproses
            </div>
            {stats.processing > 0 && (
              <span className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {stats.processing}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard?status=COMPLETED"
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="opacity-70 group-hover:opacity-100 group-hover:text-emerald-500" />
              Selesai
            </div>
            {stats.completed > 0 && (
              <span className="bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                {stats.completed}
              </span>
            )}
          </Link>

          {isAdmin && (
            <>
              <div className="px-4 mb-2 mt-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-50">Administrasi</span>
              </div>
              <Link
                href="/dashboard/admin/users"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition-all group"
              >
                <Users size={18} className="opacity-70 group-hover:opacity-100" />
                Data Penduduk
              </Link>
              <Link
                href="/dashboard/admin/announcements"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition-all group"
              >
                <Megaphone size={18} className="opacity-70 group-hover:opacity-100" />
                Manajemen Pengumuman
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 transition-colors">
          <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group mb-2 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-sm shrink-0 transition-colors">
              {(profile.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-none transition-colors">{profile.name}</p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 transition-colors">Pengaturan Akun</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
          </Link>

          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group">
              <LogOut size={16} className="opacity-70 group-hover:opacity-100" />
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* 📱 Mobile Bottom Navigation */}
      <MobileBottomNav role={profile.role} />

      {/* 📱 Mobile Top Bar */}
      <header className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 ${isAdmin ? 'bg-emerald-600' : 'bg-slate-900 dark:bg-blue-600'} rounded-lg flex items-center justify-center text-white shadow-lg`}>
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white uppercase transition-colors">SmartComplaint<span>.</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationDropdown notifications={notifications} />
          <ThemeToggle />
          <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white font-bold text-[10px] border border-slate-100 dark:border-slate-800 transition-colors">
            {(profile.name || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 mb-20 md:mb-0 bg-white dark:bg-slate-900 overflow-x-hidden transition-colors">
        {children}
      </main>
    </div>
  )
}
