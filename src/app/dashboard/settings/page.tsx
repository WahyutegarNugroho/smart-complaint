import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/dashboard/actions'
import Link from 'next/link'
import { ChevronLeft, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { getCachedProfile } from '@/lib/profile'
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import SettingsForm from './SettingsForm'
import ErrorToast from '@/components/ErrorToast'
import SuccessToast from '@/components/SuccessToast'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const sp = await searchParams
  const errorMessage = sp.error
  const successMessage = sp.message

  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  if (data.status === 'ERROR' || !data.profile) return <SessionErrorState />

  const { profile } = data

  const isPetugas = profile.role === 'PETUGAS'
  const isAdmin = profile.role === 'ADMIN'
  const roleKicker = isPetugas 
    ? 'Konfigurasi Profil Petugas' 
    : isAdmin 
    ? 'Konfigurasi Profil Administrator' 
    : 'Konfigurasi Profil Warga'
  const roleSubtitle = isPetugas
    ? 'Perbarui identitas personel, kontak operasional, dan wilayah tugas RT/RW untuk koordinasi penanganan laporan.'
    : isAdmin
    ? 'Perbarui identitas pengelola dan kontak administrasi sistem pengaduan lingkungan.'
    : 'Perbarui identitas pribadi, kontak aktif, dan rincian domisili RT/RW untuk kelancaran verifikasi pengaduan.'

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-32">
      {errorMessage && <ErrorToast key={errorMessage} message={errorMessage} />}
      {successMessage && <SuccessToast key={successMessage} message={successMessage} />}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-1">
              <Link 
                href="/dashboard" 
                aria-label="Kembali ke beranda pengaduan" 
                className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </Link>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                {roleKicker}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Pengaturan Akun & Domisili
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
              {roleSubtitle}
            </p>
          </div>

          <div className="h-11 w-11 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
            {profile.name?.[0]?.toUpperCase() || '?'}
          </div>
        </section>

        <SettingsForm profile={profile} action={updateProfile} />

        {/* Logout Section */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Keamanan & Sesi Akun
          </p>
          <form action={logout} className="w-full max-w-sm">
            <button 
              type="submit" 
              className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider border border-rose-200 dark:border-rose-900/50 hover:bg-rose-600 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOut aria-hidden="true" size={16} /> Keluar Dari Sistem
            </button>
          </form>
          <p className="mt-4 text-xs font-mono text-slate-400 dark:text-slate-500">
            Smart Complaint App • Sesi Aman Terenkripsi Supabase SSR
          </p>
        </section>
      </main>
    </div>
  )
}

