'use client'

import { login } from '@/app/auth/actions'
import { ShieldCheck, ArrowRight, Lock, Mail, Activity, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import SubmitButton from '@/components/SubmitButton'
import ThemeToggle from '@/components/ThemeToggle'
import { useState, use } from 'react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, message?: string }>
}) {
  const { error, message } = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-canvas-soft relative overflow-hidden px-6 transition-colors duration-500 animate-page">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="flex h-14 w-14 items-center justify-center rounded-brand bg-brand-ink text-brand-primary shadow-2xl shadow-brand-primary/10 group-hover:rotate-12 transition-transform border border-brand-hairline">
              <ShieldCheck size={32} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-3xl font-black text-brand-ink tracking-tighter uppercase italic leading-none transition-colors">
                Smart<span className="text-brand-primary">Complaint</span>
              </span>
              <span className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-[0.3em] mt-1.5 leading-none transition-colors">Platform Pengaduan Warga</span>
            </div>
          </Link>
        </div>

        <div className="card-base p-10 md:p-12 shadow-2xl shadow-brand-ink/5 dark:shadow-black/40 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-brand-ink pointer-events-none">
            <Activity size={150} />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest hover:text-brand-primary transition-colors mb-12 relative z-10"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <div className="mb-10 relative z-10 text-left">
            <h1 className="text-4xl font-black dark:font-normal text-brand-ink tracking-tight transition-colors leading-tight">Silahkan Masuk</h1>
            <p className="text-[11px] font-bold text-brand-ink/40 mt-3 uppercase tracking-wider transition-colors">Akses Dashboard Terpusat</p>
          </div>

          <form action={login} className="space-y-8 relative z-10">
            {message && (
              <div className="rounded-brand bg-brand-primary/5 p-6 text-[11px] font-bold text-brand-primary border border-brand-primary/20 uppercase tracking-widest leading-relaxed transition-colors flex items-start gap-4">
                <div className="h-2 w-2 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <div>{message}</div>
              </div>
            )}

            {error && (
              <div className="rounded-brand bg-red-500/5 p-6 text-[11px] font-bold text-red-500 border border-red-500/20 uppercase tracking-widest leading-relaxed transition-colors flex items-start gap-4">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>{error}</div>
              </div>
            )}

            <div className="space-y-3 text-left">
              <label className="text-[10px] font-bold text-brand-ink/50 uppercase tracking-widest ml-1">Email Warga / Petugas</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-brand border border-brand-hairline bg-brand-canvas-soft pl-16 pr-8 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="name@pesonaserpong.com"
                />
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-brand-ink/50 uppercase tracking-widest">Kredensial Password</label>
                <a href="#" className="text-[9px] font-bold text-brand-primary uppercase tracking-widest hover:underline decoration-2">Lupa?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-brand border border-brand-hairline bg-brand-canvas-soft pl-16 pr-14 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-8 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <SubmitButton
              className="w-full h-16 rounded-brand bg-brand-ink text-brand-canvas text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-brand-ink/20 hover:bg-brand-primary hover:text-[#0e0f0c] transition-all active:scale-[0.98] group mt-10"
              icon={<ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />}
              loadingText="Otentikasi..."
            >
              Masuk
            </SubmitButton>
          </form>

          <div className="mt-12 pt-10 border-t border-brand-hairline text-center relative z-10 transition-colors">
            <p className="text-[11px] text-brand-ink/40 font-bold uppercase tracking-widest">
              Belum terdaftar?
              <Link href="/register" className="font-black text-brand-primary hover:underline block mt-3 text-[13px] tracking-tight">
                REGISTRASI WARGA BARU
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

