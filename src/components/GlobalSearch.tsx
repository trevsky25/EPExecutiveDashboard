'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, X, LayoutDashboard, TrendingUp, Rocket, Store, Activity,
  ShieldCheck, DollarSign, Headphones, FileBarChart, MapPin, Users, Building2,
} from 'lucide-react';
import {
  merchantProfiles, repScorecard, territoryPerformance,
  branchDetails, type MerchantProfile, type BranchDetail,
} from '@/data/mockData';

type SearchResult = {
  id: string;
  label: string;
  sublabel: string;
  category: 'page' | 'merchant' | 'rep' | 'territory';
  icon: React.ReactNode;
  action: () => void;
};

type GlobalSearchProps = {
  open: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenMerchant: (merchant: MerchantProfile) => void;
  onOpenTerritory: (territory: BranchDetail) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  page: 'Pages',
  merchant: 'Merchants',
  rep: 'Sales Reps',
  territory: 'Territories',
};

const PAGE_RESULTS: { id: string; label: string; tab: string; icon: React.ReactNode }[] = [
  { id: 'p-exec', label: 'Executive Summary', tab: 'executive-summary', icon: <LayoutDashboard size={16} /> },
  { id: 'p-sales', label: 'Sales', tab: 'sales', icon: <TrendingUp size={16} /> },
  { id: 'p-orig', label: 'Originations', tab: 'originations', icon: <Rocket size={16} /> },
  { id: 'p-merch', label: 'Merchant Services', tab: 'merchant-services', icon: <Store size={16} /> },
  { id: 'p-port', label: 'Portfolio Health', tab: 'portfolio-health', icon: <Activity size={16} /> },
  { id: 'p-credit', label: 'Credit & Risk', tab: 'credit-risk', icon: <ShieldCheck size={16} /> },
  { id: 'p-coll', label: 'Collections', tab: 'collections', icon: <DollarSign size={16} /> },
  { id: 'p-care', label: 'Customer Care', tab: 'customer-care', icon: <Headphones size={16} /> },
  { id: 'p-custom', label: 'Custom Reports', tab: 'custom-reports', icon: <FileBarChart size={16} /> },
];

export default function GlobalSearch({ open, onClose, onNavigateTab, onOpenMerchant, onOpenTerritory }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) {
      // Show pages by default when empty
      return PAGE_RESULTS.map(p => ({
        id: p.id,
        label: p.label,
        sublabel: 'Page',
        category: 'page' as const,
        icon: p.icon,
        action: () => { onNavigateTab(p.tab); onClose(); },
      }));
    }

    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    // Pages
    PAGE_RESULTS.forEach(p => {
      if (p.label.toLowerCase().includes(q)) {
        items.push({
          id: p.id,
          label: p.label,
          sublabel: 'Page',
          category: 'page',
          icon: p.icon,
          action: () => { onNavigateTab(p.tab); onClose(); },
        });
      }
    });

    // Merchants
    merchantProfiles.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.dba.toLowerCase().includes(q) || m.industry.toLowerCase().includes(q) || m.city.toLowerCase().includes(q)) {
        items.push({
          id: `m-${m.id}`,
          label: m.name,
          sublabel: `${m.industry} · ${m.city}, ${m.state} · ${m.tier}`,
          category: 'merchant',
          icon: <Building2 size={16} />,
          action: () => { onOpenMerchant(m); onClose(); },
        });
      }
    });

    // Reps
    repScorecard.forEach(r => {
      if (r.name.toLowerCase().includes(q) || r.territory.toLowerCase().includes(q)) {
        items.push({
          id: `r-${r.name}`,
          label: r.name,
          sublabel: `${r.territory} · ${r.merchants} merchants · $${(r.volumeMTD / 1000).toFixed(0)}K vol`,
          category: 'rep',
          icon: <Users size={16} />,
          action: () => { onNavigateTab('sales'); onClose(); },
        });
      }
    });

    // Territories
    territoryPerformance.forEach(t => {
      if (t.territory.toLowerCase().includes(q)) {
        const bd = branchDetails[t.territory];
        items.push({
          id: `t-${t.territory}`,
          label: t.territory,
          sublabel: `${t.branchCount} branches · ${t.activeBranches} active · ${t.deltaPct > 0 ? '+' : ''}${t.deltaPct}% delta`,
          category: 'territory',
          icon: <MapPin size={16} />,
          action: () => { if (bd) { onOpenTerritory(bd); } onClose(); },
        });
      }
    });

    return items.slice(0, 20);
  }, [query, onNavigateTab, onOpenMerchant, onOpenTerritory, onClose]);

  // Reset selected index when results change
  useEffect(() => { setSelectedIndex(0); }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [results, selectedIndex, onClose]);

  if (!open) return null;

  // Group results by category
  const grouped = new Map<string, SearchResult[]>();
  results.forEach(r => {
    if (!grouped.has(r.category)) grouped.set(r.category, []);
    grouped.get(r.category)!.push(r);
  });

  let flatIdx = 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[var(--color-card-bg)] rounded-xl shadow-2xl border border-[var(--color-border)] overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <Search size={18} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search merchants, reps, territories, pages..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] rounded border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search size={24} className="text-[var(--color-text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-text-muted)]">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
                  {CATEGORY_LABELS[category] || category}
                </div>
                {items.map((item) => {
                  const idx = flatIdx++;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-[var(--color-ep-purple)]/5' : 'hover:bg-[var(--color-hover-bg)]'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isSelected ? 'text-[var(--color-ep-purple)]' : 'text-[var(--color-text-muted)]'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${isSelected ? 'text-[var(--color-ep-purple)] font-medium' : 'text-[var(--color-text-primary)]'}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)] truncate">{item.sublabel}</div>
                      </div>
                      {isSelected && (
                        <kbd className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] rounded border border-[var(--color-border)]">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-hover-bg)] flex items-center gap-4 text-[10px] text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[var(--color-hover-bg)] rounded border border-[var(--color-border)] font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[var(--color-hover-bg)] rounded border border-[var(--color-border)] font-mono">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[var(--color-hover-bg)] rounded border border-[var(--color-border)] font-mono">esc</kbd> Close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
