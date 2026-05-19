'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const root = window.document.documentElement;
    const initialColorValue = localStorage.getItem('theme');
    let shouldBeDark = false;
    
    if (initialColorValue === 'dark') {
      root.classList.add('dark');
      shouldBeDark = true;
    } else if (initialColorValue === 'light') {
      root.classList.remove('dark');
      shouldBeDark = false;
    } else {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.matches) {
        root.classList.add('dark');
        shouldBeDark = true;
      } else {
        root.classList.remove('dark');
        shouldBeDark = false;
      }
    }
    
    setTimeout(() => {
      setIsDark(shouldBeDark);
    }, 0);
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  }

  if (!mounted) {
    return (
      <div 
        className="p-3 w-[46px] h-[46px] rounded-brand bg-brand-canvas border border-brand-hairline shadow-sm flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <div className="w-[18px] h-[18px] opacity-10 bg-brand-ink rounded-full" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-brand bg-brand-canvas text-brand-ink hover:bg-brand-primary hover:text-[#0e0f0c] transition-all border border-brand-hairline shadow-sm flex items-center justify-center group shrink-0"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun size={18} className="group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={18} className="group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  )
}
