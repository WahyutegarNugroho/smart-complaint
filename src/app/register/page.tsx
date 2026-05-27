'use client'

import { signup } from '@/app/auth/actions'
import { ShieldCheck, ArrowRight, Lock, Mail, User, ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import SubmitButton from '@/components/SubmitButton'
import ThemeToggle from '@/components/ThemeToggle'
import { useState, use } from 'react'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-canvas-soft relative overflow-hidden px-6 py-16 transition-colors duration-500 animate-page">
       <div className="absolute top-8 right-8 z-50">
          <ThemeToggle />
       </div>

      <div className="w-full max-w-md py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-16">
          <Link href="/" className="inline-flex items-center gap-3 sm:gap-4 group">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-brand bg-brand-ink text-brand-primary shadow-2xl shadow-brand-primary/10 group-hover:rotate-12 transition-transform border border-brand-hairline">
              <ShieldCheck size={28} className="sm:w-[32px] sm:h-[32px]" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-3xl font-extrabold text-brand-ink tracking-tight uppercase leading-none transition-colors">
                Smart<span className="text-brand-primary">Complaint</span>
              </span>
              <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal mt-1.5 leading-none transition-colors">Platform Pengaduan Warga</span>
            </div>
          </Link>
        </div>

        <div className="card-base p-7 sm:p-12 shadow-2xl shadow-brand-ink/5 dark:shadow-black/40 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-brand-ink pointer-events-none hidden sm:block">
             <ShieldAlert size={150} />
          </div>

          <Link 
            href="/login" 
            className="inline-flex items-center gap-3 text-[10px] font-bold text-brand-ink/40 uppercase tracking-normal hover:text-brand-primary transition-colors mb-12 relative z-10"
          >
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>

          <div className="mb-10 relative z-10 text-left">
            <h1 className="text-4xl font-extrabold text-brand-ink tracking-tight transition-colors leading-tight">Daftar Akun</h1>
            <p className="text-[11px] font-bold text-brand-ink/40 mt-3 uppercase tracking-wider transition-colors">Registrasi Identitas Warga</p>
          </div>

          <form action={signup} className="space-y-8 relative z-10 text-left">
            {error && (
              <div className="rounded-brand bg-red-500/5 p-6 text-[11px] font-bold text-red-500 border border-red-500/20 uppercase tracking-normal leading-relaxed transition-colors flex items-start gap-4">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>{error}</div>
              </div>
            )}
            
            <div className="space-y-3">
              <label htmlFor="reg-name" className="text-[10px] font-bold text-brand-ink/50 uppercase tracking-normal ml-1">Nama Lengkap Sesuai KTP</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  id="reg-name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full rounded-brand border border-brand-hairline bg-brand-canvas-soft pl-16 pr-8 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="reg-email" className="text-[10px] font-bold text-brand-ink/50 uppercase tracking-normal ml-1">Email Aktif</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-brand border border-brand-hairline bg-brand-canvas-soft pl-16 pr-8 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="reg-password" className="text-[10px] font-bold text-brand-ink/50 uppercase tracking-normal ml-1">Kredensial Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-brand border border-brand-hairline bg-brand-canvas-soft pl-16 pr-14 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 py-2 px-1">
              <div className="pt-1">
                 <input type="checkbox" id="terms" required className="h-5 w-5 rounded-md border-brand-hairline bg-brand-canvas text-brand-primary focus:ring-brand-primary cursor-pointer transition-all" />
              </div>
              <label htmlFor="terms" className="text-[10px] text-brand-ink/50 font-bold leading-relaxed uppercase tracking-wider cursor-pointer">
                Saya menyetujui <span className="text-brand-primary underline decoration-2">Syarat & Ketentuan</span> protokol manajemen warga.
              </label>
            </div>

            <SubmitButton
              className="w-full h-16 rounded-brand bg-brand-ink text-brand-canvas text-[13px] font-bold uppercase tracking-normal shadow-2xl shadow-brand-ink/20 hover:bg-brand-primary hover:text-[#0e0f0c] transition-all active:scale-[0.98] group mt-6"
              icon={<ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />}
              loadingText="Registrasi..."
            >
              Proses Registrasi
            </SubmitButton>
          </form>

          <div className="mt-12 pt-10 border-t border-brand-hairline text-center relative z-10 transition-colors">
            <p className="text-[11px] text-brand-ink/40 font-bold uppercase tracking-normal">
              Sudah memiliki akses?
              <Link href="/login" className="font-extrabold text-brand-primary hover:underline block mt-3 text-[13px] tracking-tight">
                MASUK KE DASHBOARD
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

