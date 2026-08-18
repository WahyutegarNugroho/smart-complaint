'use client'

import { updatePassword } from '@/app/auth/actions'
import { Zap, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import SubmitButton from '@/components/SubmitButton'
import ThemeToggle from '@/components/ThemeToggle'
import { useState, use } from 'react'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-canvas-soft px-6 animate-page">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md py-10">
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
          <h1 className="text-2xl font-bold text-brand-ink tracking-tight">Buat Password Baru</h1>
          <p className="text-xs text-brand-ink/50">Gunakan password baru minimal 6 karakter.</p>
        </div>

        <form action={updatePassword} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-500/5 p-3 text-xs font-semibold text-red-500 border border-red-500/20 flex items-start gap-3">
              <div className="h-2 w-2 bg-red-500 rounded-full mt-1 shrink-0"></div>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="reset-password" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">Password Baru</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input
                id="reset-password"
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

          <SubmitButton
            className="w-full h-11 rounded-lg bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            icon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            loadingText="Menyimpan..."
          >
            Simpan Password Baru
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}


