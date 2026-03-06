'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, RotateCcw, TrendingUp, BarChart3, Activity, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { useDashboard, type MiniChartType, type CardSize } from '@/lib/DashboardContext';

const ACCENT_COLORS = [
  { label: 'Green', value: '#10b981' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Orange', value: '#f59e0b' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Slate', value: '#64748b' },
];

const CHART_OPTIONS: { type: MiniChartType; label: string; icon: typeof TrendingUp }[] = [
  { type: 'sparkline', label: 'Line', icon: TrendingUp },
  { type: 'bar', label: 'Bar', icon: BarChart3 },
  { type: 'area', label: 'Area', icon: Activity },
  { type: 'none', label: 'None', icon: EyeOff },
];

type CardCustomizePopoverProps = {
  kpiId: string;
  onClose: () => void;
};

export default function CardCustomizePopover({ kpiId, onClose }: CardCustomizePopoverProps) {
  const { kpiCustomizations, updateKPICustomization } = useDashboard();
  const custom = kpiCustomizations[kpiId] || {};
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-1 w-56 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden animate-fadeInUp"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Color Picker */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Accent Color</span>
          {custom.accentColor && (
            <button
              onClick={() => updateKPICustomization(kpiId, { accentColor: undefined })}
              className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <RotateCcw size={10} /> Reset
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ACCENT_COLORS.map(({ label, value }) => (
            <button
              key={value}
              title={label}
              onClick={() => updateKPICustomization(kpiId, { accentColor: value })}
              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${custom.accentColor === value ? 'border-[var(--color-text-primary)] scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)] mx-3" />

      {/* Chart Type */}
      <div className="px-3 py-2">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-2 block">Mini Chart</span>
        <div className="flex gap-1">
          {CHART_OPTIONS.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              title={label}
              onClick={() => updateKPICustomization(kpiId, { chartType: type })}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-[9px] font-medium transition-all cursor-pointer ${
                (custom.chartType || 'none') === type
                  ? 'bg-emerald-500/15 text-[var(--color-ep-green)] border border-[var(--color-ep-green)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover-bg)] border border-transparent'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)] mx-3" />

      {/* Card Size */}
      <div className="px-3 py-2 pb-3">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-2 block">Card Size</span>
        <div className="flex gap-1">
          {([['compact', 'Compact', Minimize2], ['expanded', 'Expanded', Maximize2]] as const).map(([size, label, Icon]) => (
            <button
              key={size}
              onClick={() => updateKPICustomization(kpiId, { cardSize: size })}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                (custom.cardSize || 'compact') === size
                  ? 'bg-emerald-500/15 text-[var(--color-ep-green)] border border-[var(--color-ep-green)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover-bg)] border border-transparent'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Small gear icon button to trigger the popover */
export function CustomizeButton({ kpiId }: { kpiId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
        title="Customize card"
      >
        <Settings size={13} />
      </button>
      {open && <CardCustomizePopover kpiId={kpiId} onClose={() => setOpen(false)} />}
    </div>
  );
}
