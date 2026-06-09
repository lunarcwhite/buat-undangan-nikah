'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-muted border border-border p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center justify-between"
      aria-label="Toggle theme"
    >
      {/* Track icons */}
      <Sun className="w-3.5 h-3.5 text-amber-500 ml-1" />
      <Moon className="w-3.5 h-3.5 text-slate-400 mr-1" />

      {/* Slider knob */}
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md transform transition-transform duration-200 ease-in-out ${
          theme === 'dark' ? 'translate-x-6 bg-amber-500' : 'translate-x-0 bg-amber-500'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
        )}
      </div>
    </button>
  );
}
