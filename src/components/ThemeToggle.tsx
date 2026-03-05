'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon size={16} className="text-[var(--color-text-secondary)]" />
      ) : (
        <Sun size={16} className="text-amber-400" />
      )}
    </button>
  );
}
