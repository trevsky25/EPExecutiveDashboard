'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import KPIDetailModal, { type KPIDetailData } from './KPIDetailModal';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

/** Extract numeric value and prefix/suffix from formatted strings like "$12.4M" or "72.3%" */
function parseDisplayValue(value: string | number): { num: number; prefix: string; suffix: string; decimals: number } {
  if (typeof value === 'number') return { num: value, prefix: '', suffix: '', decimals: 0 };
  const str = String(value);
  const match = str.match(/^([^0-9-]*)([-]?[\d,]+\.?\d*)(.*)/);
  if (!match) return { num: 0, prefix: '', suffix: str, decimals: -1 }; // -1 = non-numeric
  const prefix = match[1];
  const numStr = match[2].replace(/,/g, '');
  const suffix = match[3];
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return { num: parseFloat(numStr) || 0, prefix, suffix, decimals };
}

type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number | null;
  trendLabel?: string;
  trendDir?: 'up' | 'down' | 'flat';
  status?: 'green' | 'orange' | 'red' | 'blue' | 'default';
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  detail?: KPIDetailData;
  target?: string;
  targetProgress?: number; // 0-100 percentage toward target
};

const TOOLTIP_WIDTH = 224; // w-56 = 14rem = 224px

function TooltipPortal({ text, anchorRef }: { text: string; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState(0);

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const half = TOOLTIP_WIDTH / 2;

      // Clamp so tooltip stays within viewport
      let left = centerX;
      let arrow = 0;
      if (centerX - half < 8) {
        left = half + 8;
        arrow = centerX - left;
      } else if (centerX + half > window.innerWidth - 8) {
        left = window.innerWidth - half - 8;
        arrow = centerX - left;
      }

      setPos({ top: rect.top - 8, left });
      setArrowOffset(arrow);
    }
  }, [anchorRef]);

  return createPortal(
    <div
      className="fixed z-[9999] -translate-x-1/2 -translate-y-full w-56 px-3 py-2 text-xs font-normal normal-case tracking-normal leading-relaxed text-white bg-[#1e293b] rounded-lg shadow-lg pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      {text}
      <div
        className="absolute top-full border-4 border-transparent border-t-[#1e293b]"
        style={{ left: `calc(50% + ${arrowOffset}px)`, transform: 'translateX(-50%)' }}
      />
    </div>,
    document.body
  );
}

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  trendDir,
  status = 'green',
  tooltip,
  detail,
  target,
  targetProgress,
}: KPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger animation once when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parse value and build animated display
  const { num, prefix, suffix, decimals } = parseDisplayValue(value);
  const formatFn = useCallback((v: number) => {
    if (decimals <= 0) return `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    return `${prefix}${v.toFixed(decimals)}${suffix}`;
  }, [num, prefix, suffix, decimals]);
  const animatedValue = useAnimatedNumber(isInView ? num : 0, 600, formatFn);
  // Use static value for non-numeric or zero values
  const displayValue = decimals === -1 || num === 0 ? value : animatedValue;

  const statusColors = {
    green: 'border-t-[var(--color-ep-green)]',
    orange: 'border-t-[var(--color-ep-orange)]',
    red: 'border-t-[var(--color-ep-red)]',
    blue: 'border-t-[var(--color-ep-blue)]',
    default: 'border-t-[var(--color-border)]',
  };

  const direction = trendDir || (trend !== undefined && trend !== null ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat') : 'flat');

  const trendColor =
    direction === 'up' ? 'text-[var(--color-ep-green)]' : direction === 'down' ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-text-muted)]';

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] border-t-[3px] ${statusColors[status]} p-4 flex flex-col gap-1 min-w-0 overflow-hidden cursor-pointer hover:shadow-md hover:border-[var(--color-text-muted)] transition-all`}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium truncate">
            {title}
          </span>
          {tooltip && (
            <div
              ref={iconRef}
              className="relative flex-shrink-0 p-1 -m-1 cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={13} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors" />
              {showTooltip && <TooltipPortal text={tooltip} anchorRef={iconRef} />}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)] tracking-tight truncate">
          {displayValue}
        </div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {trend !== undefined && trend !== null && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
              {direction === 'up' && <TrendingUp size={12} />}
              {direction === 'down' && <TrendingDown size={12} />}
              {direction === 'flat' && <Minus size={12} />}
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {trendLabel && (
            <span className={`text-xs ${trendColor}`}>{trendLabel}</span>
          )}
          {subtitle && !trend && trend !== 0 && (
            <span className="text-xs text-[var(--color-text-secondary)]">{subtitle}</span>
          )}
          {subtitle && (trend || trend === 0) && (
            <span className="text-xs text-[var(--color-text-muted)]">{subtitle}</span>
          )}
        </div>
        {target && targetProgress != null && (
          <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--color-text-muted)]">Target: {target}</span>
              <span className={`text-[10px] font-semibold ${targetProgress >= 100 ? 'text-[var(--color-ep-green)]' : targetProgress >= 80 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]'}`}>
                {Math.round(targetProgress)}%
              </span>
            </div>
            <div className="h-1.5 bg-[var(--color-hover-bg)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${targetProgress >= 100 ? 'bg-[var(--color-ep-green)]' : targetProgress >= 80 ? 'bg-[var(--color-ep-orange)]' : 'bg-[var(--color-ep-red)]'}`}
                style={{ width: `${Math.min(targetProgress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <KPIDetailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        value={value}
        tooltip={tooltip}
        trend={trend}
        trendDir={trendDir}
        status={status}
        detail={detail}
      />
    </>
  );
}
