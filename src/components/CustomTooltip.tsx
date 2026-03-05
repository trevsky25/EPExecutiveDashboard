'use client';

import type { CSSProperties } from 'react';

/** Dark-aware styles for Recharts' built-in <Tooltip /> */
export const TOOLTIP_STYLES: {
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  itemStyle: CSSProperties;
  cursor: { fill: string };
} = {
  contentStyle: {
    backgroundColor: 'var(--color-card-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    color: 'var(--color-text-primary)',
  },
  labelStyle: {
    color: 'var(--color-text-muted)',
    fontSize: 11,
    marginBottom: 4,
  },
  itemStyle: {
    color: 'var(--color-text-primary)',
    fontSize: 12,
    padding: '1px 0',
  },
  cursor: { fill: 'var(--color-hover-bg)' },
};

type Payload = {
  name: string;
  value: number;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Payload[];
  label?: string;
  formatter?: (value: number, name: string) => string;
};

export default function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--color-sidebar)] text-white rounded-lg px-3 py-2.5 shadow-xl border border-white/10 min-w-[140px]">
      {label && (
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300">{entry.name}</span>
            </div>
            <span className="font-semibold tabular-nums">
              {formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
