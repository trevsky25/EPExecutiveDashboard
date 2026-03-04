'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { merchantProfiles, type MerchantProfile } from '@/data/mockData';

type MerchantSearchProps = {
  onSelect: (merchant: MerchantProfile) => void;
};

export default function MerchantSearch({ onSelect }: MerchantSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length >= 1
    ? merchantProfiles.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.dba.toLowerCase().includes(q) ||
          m.industry.toLowerCase().includes(q) ||
          m.state.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.assignedRep.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
        );
      })
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const statusColor: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Dormant: 'bg-amber-100 text-amber-700',
    Suspended: 'bg-red-100 text-red-700',
    Terminated: 'bg-gray-100 text-gray-600',
  };

  const tierColor: Record<string, string> = {
    Platinum: 'text-violet-600',
    Gold: 'text-amber-600',
    Silver: 'text-gray-500',
    Bronze: 'text-orange-700',
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query.length >= 1) setOpen(true); }}
          placeholder="Search merchants by name, industry, state, rep..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-ep-green)] focus:border-transparent placeholder:text-[var(--color-text-muted)] transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {results.map((m) => (
            <button
              key={m.id}
              onClick={() => { onSelect(m); setOpen(false); setQuery(''); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-[var(--color-border)] last:border-0 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{m.name}</span>
                  <span className={`text-[10px] font-semibold ${tierColor[m.tier]}`}>{m.tier}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                <span>{m.industry}</span>
                <span>{m.city}, {m.state}</span>
                <span>Rep: {m.assignedRep}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-50 px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
          No merchants found matching &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
