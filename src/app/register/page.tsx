'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  ArrowRight,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { signup } from '@/app/auth/actions';
import SubmitButton from '@/components/SubmitButton';
import ThemeToggle from '@/components/ThemeToggle';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = use(searchParams);
  const [showPassword, setShowPassword] = useState(false);

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

      {/* Main Registration Card */}
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
              Pendaftaran Akun Warga
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Daftarkan diri Anda untuk mengirim laporan dan memantau perbaikan lingkungan.
            </p>
          </div>
        </div>

        <form action={signup} className="space-y-4.5 text-left">
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3.5 text-xs font-semibold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5">
              <div className="h-2 w-2 bg-red-600 rounded-full mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="reg-name"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={16}
              />
              <input
                id="reg-name"
                name="full_name"
                type="text"
                required
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                placeholder="Nama sesuai KTP"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-email"
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
                id="reg-email"
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-password"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={16}
              />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-11 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                placeholder="Minimal 6 karakter"
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

          <div className="flex items-start gap-2.5 py-1 min-h-[44px]">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-blue-800 focus:ring-blue-600 cursor-pointer mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs text-slate-600 dark:text-slate-400 leading-normal cursor-pointer"
            >
              Saya menyetujui{' '}
              <Link
                href="/bantuan/privasi"
                className="text-blue-800 dark:text-blue-400 font-semibold hover:underline"
              >
                Ketentuan Layanan &amp; Kebijakan Privasi
              </Link>{' '}
              warga Pesona Serpong.
            </label>
          </div>

          <SubmitButton
            className="w-full min-h-[44px] rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-800/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 mt-2"
            icon={<ArrowRight size={15} />}
            loadingText="Mendaftarkan Akun..."
          >
            Daftar Sekarang
          </SubmitButton>
        </form>

        {/* Footer Link */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sudah memiliki akun warga?{' '}
            <Link
              href="/login"
              className="font-bold text-blue-800 dark:text-blue-400 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
