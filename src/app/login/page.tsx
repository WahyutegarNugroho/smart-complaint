'use client'

import { login } from '@/app/auth/actions'
import { Zap, ArrowRight, Lock, Mail, Eye, EyeOff, Clock } from 'lucide-react'
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
          <h1 className="text-2xl font-bold text-brand-ink tracking-tight">Masuk ke Dashboard</h1>
          <p className="text-xs text-brand-ink/50">Gunakan akun yang sudah terdaftar untuk mengelola pengaduan.</p>
        </div>

        {locked ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-red-500/5 p-5 text-center space-y-3 border border-red-500/20">
              <div className="flex justify-center">
                <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-red-500" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-red-600">Terlalu Banyak Percobaan</h2>
                <p className="text-[10px] text-red-500/70">Akun diblokir sementara setelah 5 kali gagal login</p>
              </div>
              <span className="text-3xl font-black text-red-600 tabular-nums tracking-tight font-mono block">
                {formatCountdown(countdown)}
              </span>
              <p className="text-[10px] font-semibold text-red-500/50">
                Tunggu hingga waktu habis untuk mencoba lagi
              </p>
            </div>

            <SubmitButton
              disabled={true}
              className="w-full h-11 rounded-lg bg-red-300 text-white text-xs font-bold uppercase tracking-wider cursor-not-allowed"
            >
              Masuk
            </SubmitButton>
          </div>
        ) : (
          <form action={login} className="space-y-5">
            {message && (
              <div className="rounded-lg bg-brand-primary/10 p-3 text-xs font-semibold text-brand-primary border border-brand-primary/20 flex items-start gap-3">
                <div className="h-2 w-2 bg-brand-primary rounded-full mt-1 shrink-0"></div>
                {message}
              </div>
            )}

            {showRemaining && (
              <div className={`rounded-lg p-3 text-xs font-semibold flex items-start gap-3 border ${
                remainingNum > 3 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                remainingNum > 1 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                'bg-red-500/10 text-red-600 border-red-500/20'
              }`}>
                <div className={`h-2 w-2 rounded-full mt-1 shrink-0 ${
                  remainingNum > 3 ? 'bg-emerald-500' :
                  remainingNum > 1 ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <span>Sisa percobaan: {remainingNum}</span>
                  <span className="block text-[10px] mt-0.5 opacity-60">Akan diblokir 1 menit setelah habis</span>
                </div>
              </div>
            )}

            {error && error !== 'locked' && (
              <div className="rounded-lg bg-red-500/5 p-3 text-xs font-semibold text-red-500 border border-red-500/20 flex items-start gap-3">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-1 shrink-0"></div>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-lg border border-brand-hairline bg-brand-canvas-soft pl-12 pr-4 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-primary focus:bg-brand-canvas focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                  placeholder="email@pesonaserpong.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-[10px] font-semibold text-brand-ink/40 hover:text-brand-primary transition-colors">Lupa?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-lg border border-brand-hairline bg-brand-canvas-soft pl-12 pr-12 py-3 text-sm font-medium text-brand-ink placeholder:text-brand-ink/30 focus:border-brand-primary focus:bg-brand-canvas focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                  placeholder="Masukkan password"
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
              className="w-full h-11 rounded-lg bg-brand-ink dark:bg-brand-primary text-brand-canvas dark:text-[#0e0f0c] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity mt-4"
              icon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              loadingText="Masuk..."
            >
              Masuk
            </SubmitButton>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-brand-hairline text-center">
          <p className="text-[11px] text-brand-ink/40">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-brand-primary hover:underline">
              Registrasi sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}



