import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CivicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 py-12 border-t border-slate-200/80 dark:border-slate-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 text-left">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <ShieldCheck size={17} />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Portal <span className="text-blue-800 dark:text-blue-400">Pengaduan Masyarakat</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Sistem pengelolaan keluhan dan aspirasi warga resmi Perumahan Pesona Serpong, Kelurahan Serpong, Tangerang Selatan.
            </p>
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>Sekretariat: Balai Warga RW 08, Perumahan Pesona Serpong</p>
              <p>Hotline Pos Satpam: (021) 538-XXXX / WhatsApp: 0812-XXXX-XXXX</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Informasi Lingkungan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <Link
                  href="/informasi/struktur"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Struktur Pengurus RT/RW
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/keamanan"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Pos &amp; Jadwal Keamanan
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/agenda"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Agenda Kegiatan Warga
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi/darurat"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Kontak Darurat Terpadu
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Bantuan &amp; Regulasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <Link
                  href="/bantuan/panduan"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Panduan Penggunaan Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/bantuan/privasi"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Kebijakan Privasi &amp; Jaminan Anonim
                </Link>
              </li>
              <li>
                <Link
                  href="/bantuan/kontak"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Hubungi Pengurus Lingkungan
                </Link>
              </li>
              <li>
                <Link
                  href="/alur"
                  className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
                >
                  Diagram Alur Penanganan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
          <p>&copy; {currentYear} Warga Pesona Serpong. Hak cipta dilindungi.</p>
          <p className="mt-2 sm:mt-0">Modern Civic Tech Standard (WCAG AA)</p>
        </div>
      </div>
    </footer>
  );
}
