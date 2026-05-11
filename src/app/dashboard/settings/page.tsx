import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/dashboard/actions'
import Link from 'next/link'
import { User, Shield, Phone, MapPin, Home, ArrowLeft, ChevronLeft, Save, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import SubmitButton from '@/components/SubmitButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300 pb-32">
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12">
        
        {/* 👋 HEADER SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
               <Link href="/dashboard" className="h-10 w-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                  <ChevronLeft size={20} />
               </Link>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Konfigurasi Akun</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Pengaturan Profil</h1>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base transition-colors">Perbarui identitas dan informasi domisili Anda untuk verifikasi sistem.</p>
          </div>

          <div className="h-16 w-16 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 dark:shadow-blue-600/10 shrink-0 font-bold text-2xl transition-all rotate-3">
             {profile.name?.[0] || '?'}
          </div>
        </section>

        <form action={updateProfile} className="space-y-10">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 italic transition-colors">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      name="name"
                      type="text"
                      defaultValue={profile.name}
                      required
                      className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 italic transition-colors">Nomor Induk Kependudukan</label>
                  <div className="relative group">
                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      name="nik"
                      type="text"
                      defaultValue={profile.nik || ''}
                      placeholder="Masukkan 16 digit NIK"
                      className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
    
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 italic transition-colors">Nomor Kontak WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    name="phone"
                    type="text"
                    defaultValue={profile.phone || ''}
                    placeholder="Contoh: 08xxxxxxxxxx"
                    className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
    
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3 text-center">
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] italic transition-colors">RT</label>
                  <input
                    name="rt"
                    type="text"
                    defaultValue={profile.rt || ''}
                    placeholder="001"
                    className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-[15px] font-bold text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-3 text-center">
                  <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] italic transition-colors">RW</label>
                  <input
                    name="rw"
                    type="text"
                    defaultValue={profile.rw || ''}
                    placeholder="001"
                    className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-[15px] font-bold text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
    
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 italic transition-colors">Alamat Lengkap Domisili</label>
                <div className="relative group">
                  <Home className="absolute left-5 top-5 text-slate-300 dark:text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <textarea
                    name="address"
                    rows={4}
                    defaultValue={profile.address || ''}
                    placeholder="Sebutkan Blok dan Nomor Rumah Anda..."
                    className="block w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-5 text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none resize-none leading-relaxed italic transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 transition-colors">
            <Link href="/dashboard" className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.3em] hover:text-slate-900 dark:hover:text-white transition-colors italic">Batalkan</Link>
            <SubmitButton
              className="bg-slate-900 dark:bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 dark:shadow-blue-600/10 hover:opacity-90 transition-all active:scale-[0.98] flex items-center gap-3"
              loadingText="Menyimpan..."
              icon={<Save size={18} />}
            >
              Simpan Perubahan
            </SubmitButton>
          </div>
        </form>

        {/* 🚪 LOGOUT SECTION (For Mobile) */}
        <section className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col items-center">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-6">Sesi Akun</p>
          <form action={logout} className="w-full max-w-sm">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 font-bold text-xs uppercase tracking-[0.2em] border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
            >
              <LogOut size={18} /> Keluar Dari Sistem
            </button>
          </form>
          <p className="mt-8 text-[10px] font-medium text-slate-400 dark:text-slate-600 italic">Smart Complaint v2.0 • Sesi Aman Terenkripsi</p>
        </section>
      </main>
    </div>
  )
}
