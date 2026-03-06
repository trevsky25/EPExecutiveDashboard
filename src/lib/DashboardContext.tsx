'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ── Types ──
export type MiniChartType = 'sparkline' | 'bar' | 'area' | 'none';
export type CardSize = 'compact' | 'expanded';

export type KPICardCustomization = {
  accentColor?: string;
  chartType?: MiniChartType;
  cardSize?: CardSize;
};

type DashboardContextType = {
  // KPI pinning (existing)
  pinnedKPIIds: string[];
  pinKPI: (id: string) => void;
  unpinKPI: (id: string) => void;
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  reorderKPIs: (ids: string[]) => void;
  // Per-card customization
  kpiCustomizations: Record<string, KPICardCustomization>;
  updateKPICustomization: (kpiId: string, updates: Partial<KPICardCustomization>) => void;
  // Pinned saved reports
  pinnedReportIds: string[];
  pinReport: (reportId: string) => void;
  unpinReport: (reportId: string) => void;
  isReportPinned: (reportId: string) => boolean;
  reorderReports: (ids: string[]) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

const STORAGE_KEY = 'ep-pinned-kpis';
const CUSTOM_KEY = 'ep-kpi-customizations';
const REPORTS_KEY = 'ep-pinned-reports';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [pinnedKPIIds, setPinnedKPIIds] = useState<string[]>([]);
  const [kpiCustomizations, setKpiCustomizations] = useState<Record<string, KPICardCustomization>>({});
  const [pinnedReportIds, setPinnedReportIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPinnedKPIIds(JSON.parse(stored));
    } catch { /* ignore */ }
    try {
      const stored = localStorage.getItem(CUSTOM_KEY);
      if (stored) setKpiCustomizations(JSON.parse(stored));
    } catch { /* ignore */ }
    try {
      const stored = localStorage.getItem(REPORTS_KEY);
      if (stored) setPinnedReportIds(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedKPIIds));
  }, [pinnedKPIIds]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(kpiCustomizations));
  }, [kpiCustomizations]);

  useEffect(() => {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(pinnedReportIds));
  }, [pinnedReportIds]);

  // ── KPI pinning ──
  const pinKPI = useCallback((id: string) => {
    setPinnedKPIIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const unpinKPI = useCallback((id: string) => {
    setPinnedKPIIds(prev => prev.filter(k => k !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setPinnedKPIIds(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  }, []);

  const isPinned = useCallback((id: string) => pinnedKPIIds.includes(id), [pinnedKPIIds]);

  const reorderKPIs = useCallback((ids: string[]) => {
    setPinnedKPIIds(ids);
  }, []);

  // ── Per-card customization ──
  const updateKPICustomization = useCallback((kpiId: string, updates: Partial<KPICardCustomization>) => {
    setKpiCustomizations(prev => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], ...updates },
    }));
  }, []);

  // ── Pinned reports ──
  const pinReport = useCallback((reportId: string) => {
    setPinnedReportIds(prev => prev.includes(reportId) ? prev : [...prev, reportId]);
  }, []);

  const unpinReport = useCallback((reportId: string) => {
    setPinnedReportIds(prev => prev.filter(r => r !== reportId));
  }, []);

  const isReportPinned = useCallback((reportId: string) => pinnedReportIds.includes(reportId), [pinnedReportIds]);

  const reorderReports = useCallback((ids: string[]) => {
    setPinnedReportIds(ids);
  }, []);

  return (
    <DashboardContext.Provider value={{
      pinnedKPIIds, pinKPI, unpinKPI, togglePin, isPinned, reorderKPIs,
      kpiCustomizations, updateKPICustomization,
      pinnedReportIds, pinReport, unpinReport, isReportPinned, reorderReports,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
