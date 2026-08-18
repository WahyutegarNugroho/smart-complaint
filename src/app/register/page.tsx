'use client'

import { signup } from '@/app/auth/actions'
import { Zap, ArrowRight, Lock, Mail, User, Eye, EyeOff } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-brand-canvas-soft px-6 py-12 animate-page">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-brand-primary text-[#0e0f0c] flex items-center justify-center">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="text-base font-bold text-brand-ink tracking-tight uppercase">
              Smart<span className="text-brand-primary">Complaint</span>
            </span>
          </Link>
        </div>

        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold text-brand-ink tracking-tight">Daftar Akun Warga</h1>
          <p className="text-xs text-brand-ink/50">Lengkapi data akun untuk mulai membuat pengaduan lingkungan.</p>
        </div>

        <form action={signup} className="space-y-4 text-left">
          {error && (
            <div className="rounded-lg bg-red-500/5 p-3 text-xs font-semibold text-red-500 border border-red-500/20 flex items-start gap-3">
              <div className="h-2 w-2 bg-red-500 rounded-full mt-1 shrink-0"></div>
              <div>{error}</div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input
                id="reg-name"
                name="full_name"
                type="text"
                required
                className="block w-full rounded-lg border border-brand-hairline bg-brand-canvas-soft pl-12 pr-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-primary focus:bg-brand-canvas focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                placeholder="Nama sesuai KTP"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-brand-hairline bg-brand-canvas-soft pl-12 pr-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-primary focus:bg-brand-canvas focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                placeholder="email@domain.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="block w-full rounded-lg border border-brand-hairline bg-brand-canvas-soft pl-12 pr-12 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-primary focus:bg-brand-canvas focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink/30 hover:text-brand-ink transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 py-1">
            <input 
              type="checkbox" 
              id="terms" 
              required 
              className="h-4 w-4 rounded border-brand-hairline bg-brand-canvas text-brand-primary focus:ring-brand-primary cursor-pointer mt-0.5" 
            />
            <label htmlFor="terms" className="text-xs text-brand-ink/60 leading-normal cursor-pointer">
              Saya menyetujui <Link href="/bantuan/privasi" className="text-brand-primary hover:underline">Ketentuan & Kebijakan Privasi</Link> warga.
            </label>
          </div>

          <SubmitButton
            className="w-full h-11 rounded-lg bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity mt-4"
            icon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            loadingText="Mendaftarkan..."
          >
            Daftar Sekarang
          </SubmitButton>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-hairline text-center">
          <p className="text-[11px] text-brand-ink/40">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-brand-primary hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}



