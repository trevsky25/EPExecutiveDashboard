/**
 * Shared chart configuration defaults for consistent Recharts styling across all tabs.
 */

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
