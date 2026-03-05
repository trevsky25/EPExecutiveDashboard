'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/lib/NotificationContext';
import AlertPanel from './AlertPanel';

type AlertBellProps = {
  onNavigateTab?: (tab: string) => void;
};

export default function AlertBell({ onNavigateTab }: AlertBellProps) {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
        title="Alerts"
      >
        <Bell size={16} className="text-[var(--color-text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-[var(--color-ep-red)] rounded-full animate-pulseBadge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <AlertPanel
          onNavigateTab={(tab) => {
            onNavigateTab?.(tab);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
