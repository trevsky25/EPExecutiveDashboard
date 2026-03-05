'use client';

import { Store, DollarSign, Award, AlertTriangle, RefreshCw, Zap, TrendingUp, FileText, Bell } from 'lucide-react';
import type { ActivityEvent } from '@/data/activityFeed';

// Map icon names to components
const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Store,
  DollarSign,
  Award,
  AlertTriangle,
  RefreshCw,
  Zap,
  TrendingUp,
  FileText,
  Bell,
};

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type ActivityFeedItemProps = {
  event: ActivityEvent;
  onNavigate?: (tab: string) => void;
  isNew?: boolean;
};

export default function ActivityFeedItem({ event, onNavigate, isNew }: ActivityFeedItemProps) {
  const IconComponent = ICONS[event.icon];
  const isClickable = !!event.tab && !!onNavigate;

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--color-hover-bg)] transition-colors ${isClickable ? 'cursor-pointer' : ''} ${isNew ? 'animate-fadeInLeft' : ''}`}
      onClick={() => {
        if (isClickable && event.tab) {
          onNavigate(event.tab);
        }
      }}
    >
      {/* Colored icon circle */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${event.color}18` }}
      >
        {IconComponent && <IconComponent size={14} className="flex-shrink-0" style={{ color: event.color } as React.CSSProperties} />}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[var(--color-text-primary)] truncate">
            {event.title}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0">
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>
        <p className="text-[10px] text-[var(--color-text-secondary)] truncate leading-tight">
          {event.description}
        </p>
      </div>
    </div>
  );
}
