'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import type { DateRange, DatePeriod } from '@/lib/dateFilter';

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

const periods: { id: DatePeriod; label: string }[] = [
  { id: 'MTD', label: 'MTD' },
  { id: 'QTD', label: 'QTD' },
  { id: 'YTD', label: 'YTD' },
  { id: 'Custom', label: 'Custom' },
];

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState(value.startDate || '');
  const [endDate, setEndDate] = useState(value.endDate || '');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCustom) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowCustom(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCustom]);

  const handlePeriodClick = (period: DatePeriod) => {
    if (period === 'Custom') {
      setShowCustom(!showCustom);
      return;
    }
    setShowCustom(false);
    onChange({ period });
  };

  const handleApplyCustom = () => {
    if (startDate && endDate) {
      onChange({ period: 'Custom', startDate, endDate });
      setShowCustom(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      <div className="flex bg-white rounded-lg border border-[var(--color-border)] overflow-hidden">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePeriodClick(p.id)}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              value.period === p.id
                ? 'bg-[var(--color-ep-green)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-gray-50'
            } ${p.id === 'Custom' ? 'flex items-center gap-1' : ''}`}
          >
            {p.id === 'Custom' && <Calendar size={11} />}
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 bg-white rounded-lg border border-[var(--color-border)] shadow-lg p-3 z-50 min-w-[240px]"
        >
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-2">
            Custom Range
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-0.5 block">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-ep-green)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-0.5 block">End</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-ep-green)]"
              />
            </div>
            <button
              onClick={handleApplyCustom}
              disabled={!startDate || !endDate}
              className="w-full py-1.5 text-xs font-medium bg-[var(--color-ep-green)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
