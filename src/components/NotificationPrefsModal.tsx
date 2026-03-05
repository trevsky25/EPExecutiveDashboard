'use client';

import { createPortal } from 'react-dom';
import { X, RotateCcw } from 'lucide-react';
import { useNotifications } from '@/lib/NotificationContext';
import { getThresholdMetas } from '@/lib/alertEngine';

const TAB_LABELS: Record<string, string> = {
  'executive-summary': 'Executive Summary',
  'collections': 'Collections',
  'customer-care': 'Customer Care',
  'originations': 'Originations',
  'credit-risk': 'Credit & Risk',
  'merchant-services': 'Merchant Services',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-[var(--color-ep-red)]',
  warning: 'bg-[var(--color-ep-orange)]',
  info: 'bg-[var(--color-ep-blue)]',
};

type Props = { open: boolean; onClose: () => void };

export default function NotificationPrefsModal({ open, onClose }: Props) {
  const { preferences, updatePreference, resetPreferences } = useNotifications();
  const metas = getThresholdMetas();

  if (!open || typeof document === 'undefined') return null;

  // Group by tab
  const grouped: Record<string, typeof metas> = {};
  for (const m of metas) {
    const tab = TAB_LABELS[m.tab] || m.tab;
    if (!grouped[tab]) grouped[tab] = [];
    grouped[tab].push(m);
  }

  const getPref = (id: string) => preferences.find(p => p.id === id);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--color-card-bg)] rounded-xl shadow-2xl border border-[var(--color-border)] w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-fadeInUp mx-4">
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Notification Preferences</h2>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Choose which alerts you want to receive</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-hover-bg)] cursor-pointer transition-colors">
            <X size={16} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {Object.entries(grouped).map(([tabName, items]) => (
            <div key={tabName}>
              <h3 className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-2">{tabName}</h3>
              <div className="space-y-0">
                {items.map(meta => {
                  const pref = getPref(meta.id);
                  const enabled = pref?.enabled ?? true;
                  return (
                    <div key={meta.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0">
                      <button
                        onClick={() => updatePreference(meta.id, !enabled)}
                        className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${enabled ? 'bg-[var(--color-ep-green)]' : 'bg-[var(--color-text-muted)]/30'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium ${enabled ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'} transition-colors`}>{meta.metric}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                          Alert when {meta.condition} {meta.threshold}{meta.metric.includes('Rate') || meta.metric.includes('%') ? '%' : ''}
                        </div>
                      </div>
                      <span className={`text-[9px] text-white px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLORS[meta.severity]}`}>
                        {meta.severity.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-[var(--color-border)] flex justify-between items-center">
          <button onClick={resetPreferences} className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors">
            <RotateCcw size={12} /> Reset to Defaults
          </button>
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-medium bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg hover:opacity-90 cursor-pointer transition-all">
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
