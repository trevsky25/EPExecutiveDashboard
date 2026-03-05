'use client';

import { useState } from 'react';
import { Plus, LayoutGrid, GripVertical, Pin } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';
import { kpiById } from '@/data/availableKPIs';
import KPICard from '../KPICard';
import PinButton from '../PinButton';
import KPIPinSelector from '../KPIPinSelector';

type MyDashboardProps = {
  onNavigateTab?: (tab: string) => void;
};

export default function MyDashboard({ onNavigateTab }: MyDashboardProps) {
  const { pinnedKPIIds } = useDashboard();
  const [selectorOpen, setSelectorOpen] = useState(false);

  const pinnedKPIs = pinnedKPIIds.map(id => kpiById.get(id)).filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid size={20} className="text-[var(--color-ep-green)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">My Dashboard</h2>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Your personalized view — pin KPIs from any tab to keep them front and center.
          </p>
        </div>
        <button
          onClick={() => setSelectorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={16} />
          Add KPIs
        </button>
      </div>

      {/* Pinned KPIs Grid */}
      {pinnedKPIs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pinnedKPIs.map((kpi) => {
            if (!kpi) return null;
            return (
              <div key={kpi.id} className="relative group">
                {/* Pin button overlay */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PinButton kpiId={kpi.id} />
                </div>
                {/* Tab source badge */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab?.(kpi.tab);
                    }}
                    className="text-[9px] font-medium bg-[var(--color-hover-bg)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)] hover:text-[var(--color-ep-blue)] cursor-pointer transition-colors"
                  >
                    {kpi.tabLabel}
                  </button>
                </div>
                <KPICard
                  title={kpi.title}
                  value={kpi.getValue()}
                  trend={kpi.getTrend()}
                  trendLabel={kpi.getTrendLabel?.()}
                  subtitle={kpi.getSubtitle?.()}
                  status={kpi.status}
                  target={kpi.target?.()}
                  targetProgress={kpi.targetProgress?.()}
                />
              </div>
            );
          })}

          {/* Add more card */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-ep-green)] hover:text-[var(--color-ep-green)] transition-all cursor-pointer min-h-[140px]"
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Add KPI</span>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-8 bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-ep-green-light)] flex items-center justify-center mb-4">
            <Pin size={28} className="text-[var(--color-ep-green)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">No KPIs pinned yet</h3>
          <p className="text-sm text-[var(--color-text-muted)] text-center max-w-md mb-6">
            Pin your most important KPIs from any tab to create a personalized at-a-glance view.
            Hover over any KPI card across the dashboard and click the pin icon, or use the button below.
          </p>
          <button
            onClick={() => setSelectorOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={16} />
            Browse & Pin KPIs
          </button>
        </div>
      )}

      {/* KPI Pin Selector Modal */}
      <KPIPinSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
    </div>
  );
}
