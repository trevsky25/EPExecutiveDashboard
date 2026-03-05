/**
 * Shared chart configuration defaults for consistent Recharts styling across all tabs.
 */

// Helper to get computed CSS variable value at runtime
function getCSSVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function getAxisDefaults() {
  return {
    tick: { fontSize: 12, fill: getCSSVar('--color-chart-axis', '#94a3b8') },
  };
}

export function getGridDefaults() {
  return {
    strokeDasharray: '3 3',
    stroke: getCSSVar('--color-chart-grid', '#e2e8f0'),
  };
}

// Static defaults (don't depend on theme)
export const axisDefaults = {
  tick: { fontSize: 12, fill: '#94a3b8' },
};

export const gridDefaults = {
  strokeDasharray: '3 3',
  stroke: '#e2e8f0',
};

export const legendDefaults = {
  iconSize: 8,
  wrapperStyle: { fontSize: 12 },
};

export const areaDefaults = {
  fillOpacity: 0.15,
  strokeWidth: 2,
};

export const barDefaults = {
  radius: [4, 4, 0, 0] as [number, number, number, number],
};

export const lineDefaults = {
  strokeWidth: 2,
  dot: { r: 3 },
};

export const colors = {
  green: '#10b981',
  teal: '#14b8a6',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  gray: '#94a3b8',
};
