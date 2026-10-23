import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CivicPageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  kicker?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function CivicPageHeader({
  breadcrumbs,
  kicker,
  title,
  description,
  action,
}: CivicPageHeaderProps) {
  return (
    <header className="space-y-4 pb-8 border-b border-slate-200/80 dark:border-slate-800">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/"
          className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1.5 min-h-[44px]"
        >
          <ArrowLeft size={13} className="mr-0.5" />
          Beranda
        </Link>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600 shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1.5 min-h-[44px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center px-1 min-h-[44px]" aria-current="page">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          {kicker && (
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 block">
              {kicker}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {action && (
          <div className="shrink-0 flex items-center w-full sm:w-auto">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
