'use client';

import { AlertTriangle, CheckCircle, Info, X, ExternalLink, CheckCheck } from 'lucide-react';
import { useNotifications, } from '@/lib/NotificationContext';
import type { Alert } from '@/lib/alertEngine';

type AlertPanelProps = {
  onNavigateTab?: (tab: string) => void;
  onClose: () => void;
};

const SEVERITY_STYLES: Record<string, { dot: string; bg: string }> = {
  critical: { dot: 'bg-[var(--color-ep-red)]', bg: 'bg-[var(--color-severity-red-bg)]' },
  warning: { dot: 'bg-[var(--color-ep-orange)]', bg: 'bg-[var(--color-severity-orange-bg)]' },
  info: { dot: 'bg-[var(--color-ep-blue)]', bg: 'bg-[var(--color-severity-blue-bg)]' },
};

const TAB_LABELS: Record<string, string> = {
  'executive-summary': 'Executive Summary',
  'collections': 'Collections',
  'customer-care': 'Customer Care',
  'originations': 'Originations',
  'portfolio-health': 'Portfolio Health',
  'credit-risk': 'Credit & Risk',
  'sales': 'Sales',
  'merchant-services': 'Merchant Services',
};

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function AlertItem({
  alert,
  onNavigate,
  onDismiss,
  onRead,
}: {
  alert: Alert;
  onNavigate?: () => void;
  onDismiss: () => void;
  onRead: () => void;
}) {
  const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;

  return (
    <div
      className={`px-3 py-2.5 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] transition-colors ${!alert.read ? style.bg : ''}`}
      onMouseEnter={() => { if (!alert.read) onRead(); }}
    >
      <div className="flex items-start gap-2.5">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-semibold text-[var(--color-text-primary)] ${!alert.read ? '' : 'opacity-70'}`}>
              {alert.title}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-1.5">
            {alert.message}
          </p>
          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                onClick={onNavigate}
                className="flex items-center gap-1 text-[10px] text-[var(--color-ep-blue)] hover:underline cursor-pointer"
              >
                <ExternalLink size={10} />
                {TAB_LABELS[alert.tab] || alert.tab}
              </button>
            )}
            <button
              onClick={onDismiss}
              className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] cursor-pointer ml-auto"
            >
              <X size={10} />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlertPanel({ onNavigateTab, onClose }: AlertPanelProps) {
  const { alerts, unreadCount, dismissAlert, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] bg-[var(--color-card-bg)] rounded-xl shadow-xl border border-[var(--color-border)] z-50 overflow-hidden animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Alerts</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-medium bg-[var(--color-ep-red)] text-white px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] text-[var(--color-ep-blue)] hover:underline cursor-pointer"
          >
            <CheckCheck size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* Alert list */}
      <div className="max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <CheckCircle size={24} className="text-[var(--color-ep-green)] mx-auto mb-2" />
            <div className="text-sm font-medium text-[var(--color-text-primary)]">All clear</div>
            <div className="text-xs text-[var(--color-text-muted)]">No active alerts</div>
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onNavigate={onNavigateTab ? () => onNavigateTab(alert.tab) : undefined}
              onDismiss={() => dismissAlert(alert.id)}
              onRead={() => markAsRead(alert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
