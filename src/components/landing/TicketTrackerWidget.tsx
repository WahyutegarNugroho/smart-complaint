'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Loader2, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { trackTicketStatus, PublicTicketStatus } from '@/app/actions/track';

export default function TicketTrackerWidget() {
  const [ticketQuery, setTicketQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PublicTicketStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key for keyboard accessibility (R-32 WCAG AA)
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketQuery.trim()) return;

    startTransition(async () => {
      const res = await trackTicketStatus(ticketQuery);
      setResult(res);
      setIsModalOpen(true);
    });
  };

  const getStatusBadge = (status: 'PENDING' | 'PROCESSING' | 'COMPLETED') => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Menunggu Verifikasi',
          className: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          step: 1,
        };
      case 'PROCESSING':
        return {
          label: 'Sedang Diproses',
          className: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
          step: 2,
        };
      case 'COMPLETED':
        return {
          label: 'Selesai Ditangani',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
          step: 3,
        };
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Floating Ticket Tracker Bar */}
      <div className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 shadow-xl shadow-slate-900/5 transition-all">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-400 flex items-center justify-center pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={ticketQuery}
              onChange={(e) => setTicketQuery(e.target.value.toUpperCase())}
              placeholder="Sudah melapor? Masukkan Nomor Tiket (Contoh: LP-2026-XXXX)"
              aria-label="Nomor Tiket Pengaduan"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-sm font-mono tracking-wide text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-sans transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !ticketQuery.trim()}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm transition-all shadow-md shadow-blue-800/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shrink-0 whitespace-nowrap"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memeriksa...</span>
              </>
            ) : (
              <span>Lacak Status</span>
            )}
          </button>
        </form>
      </div>

      {/* Inline Modal Preview */}
      {isModalOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-status-title">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-left space-y-5">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
                <ShieldCheck size={20} />
                <span id="modal-status-title" className="font-bold text-sm">Status Verifikasi Pengaduan</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Tutup jendela"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Modal */}
            {result.found && result.data ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    ID: #{result.data.id.slice(-8).toUpperCase()}
                  </span>
                  {(() => {
                    const badge = getStatusBadge(result.data.status);
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {result.data.title}
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Pelapor: {result.data.maskedAuthor}</span>
                    <span>•</span>
                    <span>Wilayah: RT {result.data.rt || '-'} / RW {result.data.rw || '-'}</span>
                    <span>•</span>
                    <span>{new Date(result.data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">
                    Tahapan Penanganan:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {/* Step 1 */}
                    <div className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
                      <div className="h-6 w-6 rounded-full bg-blue-800 text-white flex items-center justify-center mx-auto mb-1.5 text-xs font-bold">
                        ✓
                      </div>
                      <span className="font-semibold block text-[11px] text-slate-900 dark:text-white">Diterima</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Antrean sistem</span>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-2.5 rounded-xl border ${result.data.status !== 'PENDING' ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60' : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-60'}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mx-auto mb-1.5 text-xs font-bold ${result.data.status !== 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        {result.data.status === 'COMPLETED' ? '✓' : '2'}
                      </div>
                      <span className="font-semibold block text-[11px] text-slate-900 dark:text-white">Diproses</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Tindak lanjut RT</span>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-2.5 rounded-xl border ${result.data.status === 'COMPLETED' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60' : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-60'}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mx-auto mb-1.5 text-xs font-bold ${result.data.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        {result.data.status === 'COMPLETED' ? '✓' : '3'}
                      </div>
                      <span className="font-semibold block text-[11px] text-slate-900 dark:text-white">Selesai</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Bukti diunggah</span>
                    </div>
                  </div>
                </div>

                {/* Latest Update Box */}
                {result.data.latestResponse && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1">
                    <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block">
                      Catatan Terkini dari Petugas:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      &ldquo;{result.data.latestResponse.content}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <AlertCircle size={24} />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {result.message}
                </p>
              </div>
            )}

            {/* Footer Modal Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
