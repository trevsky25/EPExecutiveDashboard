'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateInsights, type Insight, type InsightIcon } from '@/lib/insightEngine';

const ICON_MAP: Record<InsightIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
};

const SEVERITY_STYLES = {
  positive: {
    bg: 'bg-[var(--color-severity-green-bg)]',
    border: 'border-[var(--color-ep-green)]',
    icon: 'text-[var(--color-ep-green)]',
    dot: 'bg-[var(--color-ep-green)]',
  },
  info: {
    bg: 'bg-[var(--color-severity-blue-bg)]',
    border: 'border-[var(--color-ep-blue)]',
    icon: 'text-[var(--color-ep-blue)]',
    dot: 'bg-[var(--color-ep-blue)]',
  },
  warning: {
    bg: 'bg-[var(--color-severity-orange-bg)]',
    border: 'border-[var(--color-ep-orange)]',
    icon: 'text-[var(--color-ep-orange)]',
    dot: 'bg-[var(--color-ep-orange)]',
  },
  critical: {
    bg: 'bg-[var(--color-severity-red-bg)]',
    border: 'border-[var(--color-ep-red)]',
    icon: 'text-[var(--color-ep-red)]',
    dot: 'bg-[var(--color-ep-red)]',
  },
};

type InsightBannerProps = {
  tab: string;
};

export default function InsightBanner({ tab }: InsightBannerProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const all = generateInsights(tab);
    setInsights(all);
    setCurrentIndex(0);
  }, [tab]);

  // Auto-rotate every 8 seconds
  const visibleInsights = insights.filter((i) => !dismissed.has(i.id));

  const goNext = useCallback(() => {
    if (visibleInsights.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % visibleInsights.length);
    }
  }, [visibleInsights.length]);

  const goPrev = useCallback(() => {
    if (visibleInsights.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + visibleInsights.length) % visibleInsights.length);
    }
  }, [visibleInsights.length]);

  useEffect(() => {
    if (visibleInsights.length <= 1) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [visibleInsights.length, goNext]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    if (currentIndex >= visibleInsights.length - 1) {
      setCurrentIndex(0);
    }
  };

  if (!isVisible || visibleInsights.length === 0) return null;

  const insight = visibleInsights[currentIndex % visibleInsights.length];
  if (!insight) return null;

  const style = SEVERITY_STYLES[insight.severity];
  const IconComp = ICON_MAP[insight.icon];

  return (
    <div className={`mb-4 animate-slideDown`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-[3px] ${style.border} ${style.bg} transition-all`}>
        <div className={`flex-shrink-0 ${style.icon}`}>
          <IconComp size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] text-[var(--color-text-primary)] leading-snug">
            {insight.text}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {visibleInsights.length > 1 && (
            <>
              <button onClick={goPrev} className="p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer">
                <ChevronLeft size={14} className="text-[var(--color-text-muted)]" />
              </button>
              <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums min-w-[28px] text-center">
                {(currentIndex % visibleInsights.length) + 1}/{visibleInsights.length}
              </span>
              <button onClick={goNext} className="p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer">
                <ChevronRight size={14} className="text-[var(--color-text-muted)]" />
              </button>
            </>
          )}
          <button
            onClick={() => handleDismiss(insight.id)}
            className="p-0.5 rounded hover:bg-black/5 transition-colors ml-1 cursor-pointer"
          >
            <X size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
    </div>
  );
}
