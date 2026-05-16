'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = localStorage.getItem('theme');
    
    if (initialColorValue === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else if (initialColorValue === 'light') {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      // Fallback to system preference if no manual choice
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.matches) {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.remove('dark');
        setIsDark(false);
      }
    }
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

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-brand bg-brand-canvas text-brand-ink hover:bg-brand-primary hover:text-[#0e0f0c] transition-all border border-brand-hairline shadow-sm flex items-center justify-center group"
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
