'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Clock, HeartHandshake, PhoneCall } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  icon: React.ElementType;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    icon: ShieldCheck,
    question: 'Apakah identitas saya aman jika melaporkan masalah sensitif?',
    answer:
      'Sangat aman. Portal Pengaduan Masyarakat menjamin kerahasiaan data pelapor. Anda dapat memilih opsi "Lapor Anonim" saat mengisi formulir, sehingga identitas pribadi Anda tidak akan pernah dipublikasikan kepada umum maupun pihak terlapor.',
  },
  {
    icon: Clock,
    question: 'Berapa lama laporan pengaduan saya akan direspons?',
    answer:
      'Setiap aduan yang masuk akan diverifikasi oleh tim pengurus RT/RW dalam waktu kurang dari 24 jam kerja. Setelah diverifikasi, laporan diteruskan ke seksi teknis terkait dan estimasi waktu penanganan fisik akan diperbarui langsung pada tiket Anda.',
  },
  {
    icon: HeartHandshake,
    question: 'Apakah layanan pelaporan ini dipungut biaya?',
    answer:
      'Tidak sama sekali. Seluruh proses pelaporan kendala lingkungan melalui portal resmi ini 100% gratis dan merupakan hak pelayanan publik bagi seluruh warga Perumahan Pesona Serpong.',
  },
  {
    icon: PhoneCall,
    question: 'Bagaimana jika terjadi kondisi darurat yang membutuhkan penanganan saat itu juga?',
    answer:
      'Untuk kejadian mendesak seperti kebakaran, insiden kriminalitas, atau gangguan keamanan tengah malam, silakan langsung hubungi Pos Satpam Siaga 24 Jam atau akses menu Kontak Darurat untuk terhubung dengan petugas keamanan kawasan.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5 text-left">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
          >
            <button
              type="button"
              id={`faq-btn-${index}`}
              aria-controls={`faq-panel-${index}`}
              onClick={() => toggle(index)}
              className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 focus-visible:ring-inset"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-900/40">
                  <Icon size={18} />
                </div>
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-blue-800 dark:text-blue-400' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-btn-${index}`}
                className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80"
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
