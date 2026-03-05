'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Radio } from 'lucide-react';
import { activityEvents, getNewEvent } from '@/data/activityFeed';
import type { ActivityEvent } from '@/data/activityFeed';
import ActivityFeedItem from './ActivityFeedItem';

type ActivityFeedProps = {
  onNavigateTab?: (tab: string) => void;
};

export default function ActivityFeed({ onNavigateTab }: ActivityFeedProps) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ActivityEvent[]>(() => [...activityEvents]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate new events arriving every 30-45 seconds
  const addNewEvent = useCallback(() => {
    const evt = getNewEvent();
    setEvents(prev => [evt, ...prev]);
    setNewIds(prev => new Set(prev).add(evt.id));
    if (!open) setUnreadCount(prev => prev + 1);

    setTimeout(() => {
      setNewIds(prev => {
        const next = new Set(prev);
        next.delete(evt.id);
        return next;
      });
    }, 500);
  }, [open]);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 30000 + Math.random() * 15000;
      timerRef.current = setTimeout(() => {
        addNewEvent();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [addNewEvent]);

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

  const handleToggle = () => {
    setOpen(prev => !prev);
    if (!open) setUnreadCount(0);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
        title="Live Activity"
      >
        <Radio size={16} className="text-[var(--color-text-secondary)]" />
        {/* Pulsing green dot */}
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-ep-green)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-ep-green)]" />
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-[var(--color-ep-red)] rounded-full animate-pulseBadge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] bg-[var(--color-card-bg)] rounded-xl shadow-xl border border-[var(--color-border)] z-50 overflow-hidden animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-ep-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-ep-green)]" />
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Live Activity
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-full font-medium">
              {events.length}
            </span>
          </div>

          {/* Event list */}
          <div className="max-h-[400px] overflow-y-auto">
            {events.map(event => (
              <ActivityFeedItem
                key={event.id}
                event={event}
                onNavigate={(tab) => {
                  onNavigateTab?.(tab);
                  setOpen(false);
                }}
                isNew={newIds.has(event.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
