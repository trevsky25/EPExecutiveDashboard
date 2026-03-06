'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Pin, PinOff, Check } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';
import { availableKPIs, type PinnableKPI } from '@/data/availableKPIs';

type KPIPinSelectorProps = {
  open: boolean;
  onClose: () => void;
};

const TAB_ORDER = [
  'executive-summary',
  'collections',
  'customer-care',
  'originations',
  'portfolio-health',
  'credit-risk',
  'sales',
  'merchant-services',
  'mobile-app',
  'website-traffic',
  'outbound-marketing',
];

export default function KPIPinSelector({ open, onClose }: KPIPinSelectorProps) {
  const { isPinned, togglePin, pinnedKPIIds } = useDashboard();
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filtered = search.trim()
    ? availableKPIs.filter(k =>
        k.title.toLowerCase().includes(search.toLowerCase()) ||
        k.tabLabel.toLowerCase().includes(search.toLowerCase())
      )
    : availableKPIs;

  // Group by tab
  const grouped = TAB_ORDER.map(tab => ({
    tab,
    label: filtered.find(k => k.tab === tab)?.tabLabel || tab,
    kpis: filtered.filter(k => k.tab === tab),
  })).filter(g => g.kpis.length > 0);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--color-card-bg)] rounded-xl shadow-2xl border border-[var(--color-border)] w-[560px] max-h-[80vh] flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Add KPIs to My Dashboard</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {pinnedKPIIds.length} KPI{pinnedKPIIds.length !== 1 ? 's' : ''} pinned
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-hover-bg)] text-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-hover-bg)] rounded-lg border border-[var(--color-border)]">
            <Search size={14} className="text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              autoFocus
            />
          </div>
        </div>

        {/* KPI List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {grouped.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">
              No KPIs match your search
            </div>
          ) : (
            grouped.map(({ tab, label, kpis }) => (
              <div key={tab} className="mb-4 last:mb-0">
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-2">
                  {label}
                </div>
                <div className="space-y-1">
                  {kpis.map((kpi) => {
                    const pinned = isPinned(kpi.id);
                    return (
                      <button
                        key={kpi.id}
                        onClick={() => togglePin(kpi.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                          pinned
                            ? 'bg-[var(--color-ep-green-light)] border border-[var(--color-ep-green)]/30'
                            : 'hover:bg-[var(--color-hover-bg)] border border-transparent'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          pinned ? 'bg-[var(--color-ep-green)] text-white' : 'border border-[var(--color-border)]'
                        }`}>
                          {pinned && <Check size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[var(--color-text-primary)]">{kpi.title}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)]">{kpi.getValue()}</div>
                        </div>
                        {pinned ? (
                          <PinOff size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                        ) : (
                          <Pin size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">
            {availableKPIs.length} KPIs available
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium bg-[var(--color-ep-green)] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
