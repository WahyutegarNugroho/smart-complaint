import React from 'react';
import { Calendar, Megaphone, Inbox } from 'lucide-react';
import prisma from '@/lib/prisma';
import LandingNavbar from '@/components/LandingNavbar';
import CivicFooter from '@/components/CivicFooter';
import CivicPageHeader from '@/components/CivicPageHeader';

export const revalidate = 60;

export const metadata = {
  title: 'Agenda & Pengumuman Warga | Portal Pengaduan Pesona Serpong',
  description: 'Jadwal kegiatan, agenda gotong royong, dan pengumuman resmi pengurus RT/RW Perumahan Pesona Serpong.',
};

const CATEGORY_MAP: Record<string, { label: string; cls: string }> = {
  umum: {
    label: 'Umum',
    cls: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  kegiatan: {
    label: 'Kegiatan Warga',
    cls: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/40',
  },
  darurat: {
    label: 'Penting & Darurat',
    cls: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-900/40',
  },
  kebersihan: {
    label: 'Kebersihan Lingkungan',
    cls: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/40',
  },
  kesehatan: {
    label: 'Kesehatan & Posyandu',
    cls: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200/80 dark:border-teal-900/40',
  },
  keagamaan: {
    label: 'Keagamaan',
    cls: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/40',
  },
};

export default async function AgendaPage() {
  let announcements: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
  }> = [];

  try {
    announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (err) {
    console.error('AgendaPage Error:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation */}
      <LandingNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Civic Header with Breadcrumb */}
        <CivicPageHeader
          breadcrumbs={[
            { label: 'Informasi', href: '/#kategori' },
            { label: 'Agenda Kegiatan' },
          ]}
          kicker="Kabar Lingkungan Warga"
          title="Agenda & Pengumuman Warga"
          description="Papan informasi digital untuk jadwal gotong royong, kegiatan posyandu, musyawarah RT/RW, dan pengumuman pemeliharaan sarana."
        />

        {/* Announcement List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Megaphone size={16} className="text-blue-800 dark:text-blue-400" />
              <span>Daftar Pengumuman Resmi</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {announcements.length} Kabar Tercatat
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Belum Ada Agenda Terbaru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Seluruh kegiatan lingkungan yang diagendakan oleh pengurus RW 08 akan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {announcements.map((item) => {
                const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.umum;
                return (
                  <article
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={
                          'text-xs font-semibold px-2.5 py-0.5 rounded-md border ' +
                          cat.cls
                        }
                      >
                        {cat.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <Calendar size={13} />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {item.title}
                    </h3>

                    {item.content && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Shared Civic Footer */}
      <CivicFooter />
    </div>
  );
}
