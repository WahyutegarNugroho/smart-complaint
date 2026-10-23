'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Menu, X, Plus, PhoneCall } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/#alur', label: 'Cara Melapor' },
    { href: '/#statistik', label: 'Statistik' },
    { href: '/#kategori', label: 'Kategori' },
    { href: '/#jelajah', label: 'Jelajah Laporan' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <nav aria-label="Navigasi Utama" className="fixed top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Identity (Instansi / Portal + Nama Sistem) */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm shadow-blue-800/30 group-hover:scale-105 transition-transform">
              <Megaphone size={19} />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Portal <span className="text-blue-800 dark:text-blue-400">Pengaduan</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-normal -mt-0.5">
                Warga Pesona Serpong
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Anchor Links per Design.md) */}
          <div className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors py-2 tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1.5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3.5">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-blue-400 px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
            >
              <Plus size={15} />
              <span>Buat Laporan</span>
            </Link>
            <div className="border-l border-slate-200 dark:border-slate-800 h-5 mx-1" />
            <ThemeToggle />
          </div>

          {/* Mobile Actions: ThemeToggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/informasi/darurat"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2"
            >
              <PhoneCall size={15} />
              Hotline Darurat
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 block"
            >
              + Buat Pengaduan Baru
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
