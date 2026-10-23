'use client';

import React, { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Clock,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { login } from '@/app/auth/actions';
import SubmitButton from '@/components/SubmitButton';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    message?: string;
    remaining?: string;
    remainingAttempts?: string;
  }>;
}) {
  const { error, message, remaining, remainingAttempts } = use(searchParams);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const showRemaining = !locked && remainingAttempts;
  const remainingNum = showRemaining ? parseInt(remainingAttempts) || 0 : 0;

  // Inisialisasi status lock: prioritaskan API, fallback ke URL params
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    fetch('/api/login-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.locked) {
          setLocked(true);
          setCountdown(data.remainingSeconds);
        }
      })
      .catch(() => {
        if (error === 'locked' && remaining) {
          setLocked(true);
          setCountdown(parseInt(remaining) || 60);
        }
      });
  }, [error, remaining]);

  // Countdown timer: selalu 1 interval, selalu pakai latest countdown
  useEffect(() => {
    if (!locked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setLocked(false);
          router.replace('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [locked, router]);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-blue-600 selection:text-white relative">
      {/* Top Controls: Return to Home & Theme Toggle */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-2.5 py-2"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/5 p-7 sm:p-9 space-y-6 mt-12 sm:mt-0">
        {/* Brand Header */}
        <div className="space-y-4 text-center sm:text-left">
          <Link href="/" className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm shadow-blue-800/20 group-hover:scale-105 transition-transform">
              <Megaphone size={19} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Portal <span className="text-blue-800 dark:text-blue-400">Pengaduan</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-normal -mt-0.5">
                Warga Pesona Serpong
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Masuk ke Akun
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Gunakan email dan password terdaftar untuk mengelola pengaduan Anda.
            </p>
          </div>
        </div>

        {/* Lockout Screen */}
        {locked ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/40 p-6 text-center space-y-3 border border-red-200 dark:border-red-900/50">
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center text-red-700 dark:text-red-300">
                  <Clock size={24} />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-red-800 dark:text-red-300">
                  Terlalu Banyak Percobaan
                </h2>
                <p className="text-xs text-red-700 dark:text-red-400/90">
                  Akun diblokir sementara demi keamanan sistem.
                </p>
              </div>
              <span className="text-3xl font-black text-red-700 dark:text-red-400 tabular-nums tracking-tight font-mono block">
                {formatCountdown(countdown)}
              </span>
              <p className="text-[11px] text-red-600 dark:text-red-400/80">
                Silakan tunggu hingga waktu habis untuk mencoba kembali.
              </p>
            </div>

            <SubmitButton
              disabled={true}
              className="w-full min-h-[44px] rounded-xl bg-slate-300 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
            >
              Masuk
            </SubmitButton>
          </div>
        ) : (
          <form action={login} className="space-y-4.5">
            {message && (
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 p-3.5 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 flex items-start gap-2.5">
                <div className="h-2 w-2 bg-blue-700 dark:bg-blue-400 rounded-full mt-1.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {showRemaining && (
              <div
                className={`rounded-xl p-3.5 text-xs font-semibold flex items-start gap-2.5 border ${
                  remainingNum > 3
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40'
                    : remainingNum > 1
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/40'
                    : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/40'
                }`}
              >
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span>Sisa percobaan login: {remainingNum}</span>
                  <span className="block text-[11px] mt-0.5 opacity-80">
                    Akan diblokir sementara setelah batas percobaan habis.
                  </span>
                </div>
              </div>
            )}

            {error && error !== 'locked' && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3.5 text-xs font-semibold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5">
                <div className="h-2 w-2 bg-red-600 rounded-full mt-1.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="login-email"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={16}
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-800 dark:text-blue-400 hover:underline"
                >
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={16}
                />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-11 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <SubmitButton
              className="w-full min-h-[44px] rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-800/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 mt-2"
              icon={<ArrowRight size={15} />}
              loadingText="Memverifikasi..."
            >
              Masuk ke Dashboard
            </SubmitButton>
          </form>
        )}

        {/* Footer Link */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Belum memiliki akun warga?{' '}
            <Link
              href="/register"
              className="font-bold text-blue-800 dark:text-blue-400 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
