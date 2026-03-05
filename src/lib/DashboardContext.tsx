'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type DashboardContextType = {
  pinnedKPIIds: string[];
  pinKPI: (id: string) => void;
  unpinKPI: (id: string) => void;
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  reorderKPIs: (ids: string[]) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

const STORAGE_KEY = 'ep-pinned-kpis';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [pinnedKPIIds, setPinnedKPIIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPinnedKPIIds(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedKPIIds));
  }, [pinnedKPIIds]);

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

  return (
    <DashboardContext.Provider value={{ pinnedKPIIds, pinKPI, unpinKPI, togglePin, isPinned, reorderKPIs }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
