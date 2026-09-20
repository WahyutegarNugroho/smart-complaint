'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Menu, X, PhoneCall } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#kategori', label: 'Kategori Aduan' },
    { href: '#rekap', label: 'Rekap Wilayah' },
    { href: '/alur', label: 'Alur Penanganan' },
    { href: '/informasi/struktur', label: 'Pengurus Lingkungan' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-brand-hairline bg-brand-canvas/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-brand-ink shadow-sm">
              <Megaphone size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-brand-ink tracking-tight">
                Smart<span className="text-brand-primary">Complaint</span>
              </span>
              <span className="text-[11px] text-brand-ink/75 font-medium tracking-normal -mt-0.5">
                Warga Pesona Serpong
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-ink transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-brand-ink/80 hover:text-brand-ink px-3 py-2 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary py-2.5 px-5 text-xs tracking-wider uppercase font-bold"
            >
              Lapor Kendala
            </Link>
            <div className="border-l border-brand-hairline h-5 mx-1" />
            <ThemeToggle />
          </div>

          {/* Mobile Actions: ThemeToggle & Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg border border-brand-hairline bg-brand-canvas text-brand-ink hover:bg-brand-canvas-soft transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {isOpen && (
        <div className="sm:hidden border-t border-brand-hairline bg-brand-canvas px-4 pt-4 pb-6 space-y-3 shadow-lg animate-page">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-ink/90 hover:bg-brand-canvas-soft hover:text-brand-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/informasi/darurat"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-ink/90 hover:bg-brand-canvas-soft hover:text-brand-ink transition-colors flex items-center gap-2"
            >
              <PhoneCall size={15} className="text-brand-primary" />
              Kontak Darurat
            </Link>
          </div>

          <div className="pt-3 border-t border-brand-hairline flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg border border-brand-hairline text-xs font-semibold uppercase tracking-wider text-brand-ink hover:bg-brand-canvas-soft transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center py-3 px-4 text-xs font-bold uppercase tracking-wider block"
            >
              Lapor Kendala Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
