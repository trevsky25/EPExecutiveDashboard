'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, X, SkipForward, SkipBack, Monitor } from 'lucide-react';

const CYCLE_TABS = [
  'executive-summary',
  'collections',
  'customer-care',
  'originations',
  'portfolio-health',
  'credit-risk',
  'sales',
  'merchant-services',
];

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

const CYCLE_INTERVAL = 15000; // 15 seconds

type PresentationBarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit: () => void;
};

export default function PresentationBar({ activeTab, onTabChange, onExit }: PresentationBarProps) {
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const hideTimerRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = CYCLE_TABS.indexOf(activeTab);

  const goNext = useCallback(() => {
    const idx = CYCLE_TABS.indexOf(activeTab);
    const next = (idx + 1) % CYCLE_TABS.length;
    onTabChange(CYCLE_TABS[next]);
    setProgress(0);
  }, [activeTab, onTabChange]);

  const goPrev = useCallback(() => {
    const idx = CYCLE_TABS.indexOf(activeTab);
    const prev = (idx - 1 + CYCLE_TABS.length) % CYCLE_TABS.length;
    onTabChange(CYCLE_TABS[prev]);
    setProgress(0);
  }, [activeTab, onTabChange]);

  // Auto-cycle timer
  useEffect(() => {
    if (paused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / CYCLE_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= CYCLE_INTERVAL) {
        goNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [paused, activeTab, goNext]);

  // Auto-hide the bar after 3s of no mouse movement, show on move
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleMove = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 3000);
    };

    handleMove(); // start the timer
    document.addEventListener('mousemove', handleMove);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1a2332]/90 backdrop-blur-md rounded-full shadow-2xl border border-white/10">
        {/* Tab indicator */}
        <div className="flex items-center gap-2">
          <Monitor size={14} className="text-[var(--color-ep-green)]" />
          <span className="text-xs font-medium text-white/90 min-w-[120px]">
            {TAB_LABELS[activeTab] || activeTab}
          </span>
          <span className="text-[10px] text-white/40">
            {currentIndex + 1}/{CYCLE_TABS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-ep-green)] rounded-full transition-none"
            style={{ width: `${paused ? progress : progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Previous tab"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setPaused(p => !p)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title={paused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            onClick={goNext}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Next tab"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/15" />

        {/* Exit */}
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white text-xs transition-colors cursor-pointer"
          title="Exit presentation (Esc)"
        >
          <X size={13} />
          Exit
        </button>
      </div>
    </div>
  );
}
