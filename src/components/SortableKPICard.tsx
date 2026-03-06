'use client';

import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomizeButton } from './CardCustomizePopover';
import PinButton from './PinButton';
import KPICard from './KPICard';
import MiniChart from './MiniChart';
import type { PinnableKPI } from '@/data/availableKPIs';
import type { KPICardCustomization } from '@/lib/DashboardContext';
import type { MiniChartType } from '@/lib/DashboardContext';

const STATUS_COLORS: Record<string, string> = {
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  default: '#94a3b8',
};

type SortableKPICardProps = {
  kpi: PinnableKPI;
  custom: KPICardCustomization;
  trendData: number[] | undefined;
  isEditMode: boolean;
  onNavigateTab?: (tab: string) => void;
};

export default function SortableKPICard({
  kpi,
  custom,
  trendData,
  isEditMode,
  onNavigateTab,
}: SortableKPICardProps) {
  const kpiCardRef = useRef<HTMLDivElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: kpi.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    touchAction: isEditMode ? 'none' as const : undefined,
  };

  const isExpanded = custom.cardSize === 'expanded';
  const chartType: MiniChartType = custom.chartType || 'none';
  const accentColor = custom.accentColor;
  const chartColor = accentColor || STATUS_COLORS[kpi.status] || '#10b981';
  const showChart = chartType !== 'none' && trendData;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
      className={`relative h-full ${isExpanded ? 'sm:col-span-2' : ''} ${
        isEditMode
          ? 'ring-2 ring-dashed ring-[var(--color-border)] rounded-lg cursor-grab active:cursor-grabbing'
          : ''
      }`}
    >
      {/* Tab label pill — always visible, color matches card accent */}
      <div className="absolute -top-3 left-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigateTab?.(kpi.tab);
          }}
          className="text-[9px] font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-sm bg-[var(--color-card-bg)]"
          style={{
            color: chartColor,
            border: `1px solid ${chartColor}40`,
          }}
        >
          {kpi.tabLabel}
        </button>
      </div>

      {/* Edit mode: settings + unpin overlays */}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5">
          <CustomizeButton kpiId={kpi.id} />
          <div data-tour="md-remove">
            <PinButton kpiId={kpi.id} />
          </div>
        </div>
      )}

      {/* Card content */}
      <div ref={kpiCardRef} className="flex flex-col h-full">
        <KPICard
          title={kpi.title}
          value={kpi.getValue()}
          trend={kpi.getTrend()}
          trendLabel={kpi.getTrendLabel?.()}
          subtitle={kpi.getSubtitle?.()}
          status={kpi.status}
          target={kpi.target?.()}
          targetProgress={kpi.targetProgress?.()}
          accentColorOverride={accentColor}
          hasChart={!!showChart}
          largeValue={isExpanded && !showChart}
        />
        {showChart && (
          <div
            className="bg-[var(--color-card-bg)] border border-t-0 border-[var(--color-border)] rounded-b-lg px-3 pb-2 cursor-pointer hover:shadow-md transition-all"
            onClick={() => {
              // Trigger click on the KPICard to open its modal
              const cardEl = kpiCardRef.current?.querySelector('[class*="border-t-"]') as HTMLElement;
              cardEl?.click();
            }}
          >
            <MiniChart
              data={trendData}
              type={chartType}
              color={chartColor}
              height={isExpanded ? 56 : 36}
            />
          </div>
        )}
      </div>
    </div>
  );
}
