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
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden px-4 transition-colors duration-300">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl -z-10 opacity-30 dark:opacity-10 blur-[120px]">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-200 dark:bg-emerald-900" />
        <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-200 dark:bg-blue-900" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xl group-hover:rotate-12 transition-transform">
              <ShieldCheck size={26} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none transition-colors">
                Smart<span className="text-emerald-600 dark:text-emerald-400"> Complaint</span>
              </span>
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] mt-1 leading-none transition-colors">Platform Pengaduan Warga</span>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Activity size={120} />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors mb-8 relative z-10"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>

          <div className="mb-8 relative z-10 text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Silahkan Masuk</h1>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-500 mt-2 uppercase tracking-wider transition-colors">Akses Dashboard Terpusat</p>
          </div>

          <form action={login} className="space-y-6 relative z-10">
            {error && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-5 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 uppercase tracking-widest leading-relaxed transition-colors">
                <div className="flex items-center gap-2 mb-1 text-[11px]">
                  <div className="h-1.5 w-1.5 bg-red-600 dark:bg-red-400 rounded-full"></div> Autentikasi Gagal
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Warga / Petugas</label>
              </div>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-14 pr-6 py-4.5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                  placeholder="name@pesonaserpong.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kredensial Password</label>
                <a href="#" className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest hover:underline">Lupa?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-14 pr-12 py-4.5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <SubmitButton
              className="w-full h-16 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95 group mt-8"
              icon={<ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
              loadingText="Otentikasi..."
            >
              Masuk
            </SubmitButton>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center relative z-10 transition-colors">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">
              Belum terdaftar dalam sistem?
              <Link href="/register" className="font-bold text-emerald-600 hover:underline block mt-2 tracking-normal">
                REGISTRASI WARGA BARU
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
