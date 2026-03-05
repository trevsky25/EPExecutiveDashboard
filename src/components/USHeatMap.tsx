'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { merchantProfiles, enrollmentsByState } from '@/data/mockData';
import { aggregateByState, STATE_NAMES, type StateAggregation } from '@/lib/stateAggregation';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

type ColorMetric = 'merchantCount' | 'totalVolumeMTD' | 'enrollmentCount';

const METRIC_LABELS: Record<ColorMetric, string> = {
  merchantCount: 'Merchants',
  totalVolumeMTD: 'Volume',
  enrollmentCount: 'Enrollments',
};

type Props = {
  onStateClick: (stateData: StateAggregation) => void;
};

export default function USHeatMap({ onStateClick }: Props) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [colorMetric, setColorMetric] = useState<ColorMetric>('merchantCount');

  const stateData = useMemo(() => {
    return aggregateByState(merchantProfiles, enrollmentsByState);
  }, []);

  const maxVal = useMemo(() => {
    let max = 1;
    for (const s of stateData.values()) {
      if (s[colorMetric] > max) max = s[colorMetric];
    }
    return max;
  }, [stateData, colorMetric]);

  const getStateColor = (stateCode: string) => {
    const data = stateData.get(stateCode);
    if (!data || data[colorMetric] === 0) return '#f1f5f9';
    const t = data[colorMetric] / maxVal;
    // Interpolate: light green (#d1fae5) → dark green (#059669)
    const r = Math.round(209 - t * (209 - 5));
    const g = Math.round(250 - t * (250 - 150));
    const b = Math.round(229 - t * (229 - 105));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const fipsToState = (geo: { properties: { name: string } }): string => {
    const name = geo.properties.name;
    for (const [code, n] of Object.entries(STATE_NAMES)) {
      if (n === name) return code;
    }
    return '';
  };

  const hovered = hoveredState ? stateData.get(hoveredState) : null;

  return (
    <div className="relative">
      {/* Metric toggle */}
      <div className="flex gap-1.5 mb-2">
        {(Object.keys(METRIC_LABELS) as ColorMetric[]).map((key) => (
          <button
            key={key}
            onClick={() => setColorMetric(key)}
            className={`px-3 py-1 text-[11px] rounded-md transition-all cursor-pointer ${
              colorMetric === key
                ? 'bg-[var(--color-ep-green)] text-white font-medium'
                : 'bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200'
            }`}
          >
            {METRIC_LABELS[key]}
          </button>
        ))}
      </div>

      <ComposableMap
        projection="geoAlbersUsa"
        width={900}
        height={380}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: Array<{ rsmKey?: string; id?: string; properties: { name: string } }> }) =>
            geographies.map((geo, i) => {
              const stateCode = fipsToState(geo);
              const data = stateData.get(stateCode);
              const isHovered = hoveredState === stateCode;
              return (
                <Geography
                  key={geo.rsmKey || geo.id || i}
                  geography={geo}
                  fill={isHovered ? '#10b981' : getStateColor(stateCode)}
                  stroke="#94a3b8"
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  style={{
                    default: { outline: 'none', cursor: data && data[colorMetric] > 0 ? 'pointer' : 'default' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(e: React.MouseEvent) => {
                    setHoveredState(stateCode);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e: React.MouseEvent) => {
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => {
                    if (data && (data.merchantCount > 0 || data.enrollmentCount > 0)) {
                      onStateClick(data);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip — portaled to body so parent transforms don't break fixed positioning */}
      {typeof document !== 'undefined' && hoveredState && hovered && (hovered.merchantCount > 0 || hovered.enrollmentCount > 0) && createPortal(
        <div
          className="fixed z-[9999] px-3 py-2.5 bg-[#1e293b] text-white text-xs rounded-lg shadow-lg pointer-events-none"
          style={{
            left: Math.min(tooltipPos.x + 14, window.innerWidth - 180),
            top: Math.max(tooltipPos.y - 14, 10),
          }}
        >
          <div className="font-semibold mb-1">{hovered.stateName}</div>
          <div className="text-white/70">{hovered.merchantCount} merchant{hovered.merchantCount !== 1 ? 's' : ''}</div>
          {hovered.totalVolumeMTD > 0 && (
            <div className="text-white/70">${(hovered.totalVolumeMTD / 1000).toFixed(0)}K volume MTD</div>
          )}
          {hovered.enrollmentCount > 0 && (
            <div className="text-white/70">{hovered.enrollmentCount} enrollments</div>
          )}
        </div>,
        document.body,
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-center">
        <span className="text-[10px] text-[var(--color-text-muted)]">Low</span>
        <div
          className="w-32 h-2 rounded-full"
          style={{ background: 'linear-gradient(to right, #d1fae5, #10b981, #059669)' }}
        />
        <span className="text-[10px] text-[var(--color-text-muted)]">High</span>
        <div className="w-3 h-2 rounded-sm bg-[#f1f5f9] border border-gray-300 ml-3" />
        <span className="text-[10px] text-[var(--color-text-muted)]">No data</span>
      </div>
    </div>
  );
}
