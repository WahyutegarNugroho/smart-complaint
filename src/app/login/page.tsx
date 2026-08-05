'use client'

import { login } from '@/app/auth/actions'
import { ShieldCheck, ArrowRight, Lock, Mail, Activity, ArrowLeft, Eye, EyeOff, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import ThemeToggle from '@/components/ThemeToggle'
import { useState, use, useEffect, useRef } from 'react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, message?: string, remaining?: string, remainingAttempts?: string }>
}) {
  const { error, message, remaining, remainingAttempts } = use(searchParams)
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initRef = useRef(false)
  const [showPassword, setShowPassword] = useState(false)
  const [locked, setLocked] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const showRemaining = !locked && remainingAttempts
  const remainingNum = showRemaining ? (parseInt(remainingAttempts) || 0) : 0

  // Inisialisasi status lock: prioritaskan API, fallback ke URL params
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    fetch('/api/login-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.locked) {
          setLocked(true)
          setCountdown(data.remainingSeconds)
        }
      })
      .catch(() => {
        if (error === 'locked' && remaining) {
          setLocked(true)
          setCountdown(parseInt(remaining) || 60)
        }
      })
  }, [error, remaining])

  // Countdown timer — selalu 1 interval, selalu pakai latest countdown
  useEffect(() => {
    if (!locked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          setLocked(false)
          router.replace('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [locked, router])

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

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
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-semibold text-brand-ink/40 uppercase tracking-normal hover:text-brand-primary transition-colors mb-12 relative z-10"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          {locked ? (
            <div className="relative z-10 space-y-8">
              <div className="rounded-brand bg-red-500/10 p-8 text-center space-y-6 border border-red-500/20">
                <div className="flex justify-center">
                  <div className="h-20 w-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
                    <Clock size={40} className="text-red-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-black text-red-600 uppercase tracking-normal">
                    Terlalu Banyak Percobaan
                  </h2>
                  <p className="text-[12px] font-bold text-red-500/70 uppercase tracking-wider leading-relaxed">
                    Akun Anda diblokir sementara karena 5 kali gagal login berturut-turut
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-red-500/10 rounded-2xl px-10 py-5 border border-red-500/10">
                    <span className="text-5xl font-black text-red-600 tabular-nums tracking-tight">
                      {formatCountdown(countdown)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-red-500/50 uppercase tracking-normal">
                  Tunggu hingga waktu habis untuk mencoba lagi
                </p>
              </div>

              <SubmitButton
                disabled={true}
                className="w-full h-16 rounded-brand bg-red-300 text-white text-[13px] font-bold uppercase tracking-normal cursor-not-allowed mt-10"
              >
                Masuk
              </SubmitButton>
            </div>
          ) : (
            <form action={login} className="space-y-8 relative z-10">
              {message && (
                <div className="rounded-brand bg-brand-primary/5 p-6 text-[11px] font-semibold text-brand-primary border border-brand-primary/20 uppercase tracking-normal leading-relaxed transition-colors flex items-start gap-4">
                  <div className="h-2 w-2 bg-brand-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>{message}</div>
                </div>
              )}

              {showRemaining && (
                <div className={`rounded-brand p-6 text-[11px] font-semibold uppercase tracking-normal leading-relaxed transition-colors flex items-start gap-4 border ${
                  remainingNum > 3 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  remainingNum > 1 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                  'bg-red-500/10 text-red-600 border-red-500/20'
                }`}>
                  <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                    remainingNum > 3 ? 'bg-emerald-500' :
                    remainingNum > 1 ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <span className="block">SISA PERCOBAAN ANDA: {remainingNum}</span>
                    <span className="block text-[9px] mt-1 opacity-70">Setelah habis, login akan diblokir 1 menit</span>
                  </div>
                </div>
              )}

              {error && error !== 'locked' && (
                <div className="rounded-brand bg-red-500/5 p-6 text-[11px] font-semibold text-red-500 border border-red-500/20 uppercase tracking-normal leading-relaxed transition-colors flex items-start gap-4">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>{error}</div>
                </div>
              )}

              <div className="space-y-3 text-left">
                <label htmlFor="login-email" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal ml-1">Email Warga / Petugas</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-xl border border-brand-hairline bg-brand-canvas-soft pl-16 pr-8 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    placeholder="name@pesonaserpong.com"
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="login-password" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-normal">Kredensial Password</label>
                  <Link href="/forgot-password" className="text-[9px] font-semibold text-brand-primary uppercase tracking-normal hover:underline decoration-2">Lupa?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full rounded-xl border border-brand-hairline bg-brand-canvas-soft pl-16 pr-14 py-5 text-base font-bold text-brand-ink placeholder:text-brand-ink/20 focus:border-brand-primary focus:bg-brand-canvas focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    placeholder="••••••••"
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

              <SubmitButton
                className="w-full h-16 rounded-brand bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-[13px] font-bold uppercase tracking-normal shadow-xl shadow-brand-ink/20 hover:bg-brand-primary hover:text-[#0e0f0c] transition-all active:scale-[0.98] group mt-10"
                icon={<ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />}
                loadingText="Otentikasi..."
              >
                Masuk
              </SubmitButton>
            </form>
          )}

          <div className="mt-12 pt-10 border-t border-brand-hairline text-center relative z-10 transition-colors">
            <p className="text-[11px] text-brand-ink/40 font-bold uppercase tracking-normal">
              Belum terdaftar?
              <Link href="/register" className="font-bold text-brand-primary hover:underline block mt-3 text-[13px] tracking-tight">
                REGISTRASI WARGA BARU
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



