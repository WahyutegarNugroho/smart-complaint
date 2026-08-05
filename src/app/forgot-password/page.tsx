'use client'

import { resetPassword } from '@/app/auth/actions'
import { ShieldCheck, ArrowRight, Mail, ArrowLeft, Activity } from 'lucide-react'
import Link from 'next/link'
import SubmitButton from '@/components/SubmitButton'
import ThemeToggle from '@/components/ThemeToggle'
import { use } from 'react'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = use(searchParams)

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-canvas-soft relative overflow-hidden px-6 transition-colors duration-500 animate-page">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-16">
          <Link href="/" className="inline-flex items-center gap-3 sm:gap-4 group">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-brand bg-brand-panel text-brand-primary shadow-xl shadow-brand-primary/10 group-hover:rotate-12 transition-transform border border-brand-hairline">
              <ShieldCheck size={28} className="sm:w-[32px] sm:h-[32px]" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-3xl font-bold text-brand-ink tracking-tight uppercase leading-none transition-colors">
                Smart<span className="text-brand-primary">Complaint</span>
              </span>
              <span className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal mt-1.5 leading-none transition-colors">Platform Pengaduan Warga</span>
            </div>
          </Link>
        </div>

        <div className="card-base p-7 sm:p-12 shadow-xl shadow-brand-ink/5 dark:shadow-black/40 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-brand-ink pointer-events-none hidden sm:block">
            <Activity size={150} />
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal hover:text-brand-primary transition-colors mb-12 relative z-10"
          >
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>

          <div className="mb-10 relative z-10 text-left">
            <h1 className="text-4xl font-bold text-brand-ink tracking-tight transition-colors leading-tight">Reset Password</h1>
            <p className="text-[11px] font-semibold text-brand-ink/40 mt-3 uppercase tracking-wider transition-colors">Masukkan email Anda</p>
          </div>

          <form action={resetPassword} className="space-y-8 relative z-10">
            {error && (
              <div className="rounded-brand bg-red-500/5 p-6 text-[11px] font-semibold text-red-500 border border-red-500/20 uppercase tracking-normal leading-relaxed transition-colors flex items-start gap-4">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>{error}</div>
              </div>
            )}

            <div className="space-y-3 text-left">
              <label htmlFor="forgot-email" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal ml-1">Email Terdaftar</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                    className="block w-full rounded-xl border border-brand-hairline bg-brand-canvas-soft pl-16 pr-8 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full h-16 rounded-brand bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-[13px] font-bold uppercase tracking-normal shadow-xl shadow-brand-ink/20 hover:bg-brand-primary hover:text-[#0e0f0c] transition-all active:scale-[0.98] group mt-10"
              icon={<ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />}
              loadingText="Mengirim..."
            >
              Kirim Link Reset
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}


