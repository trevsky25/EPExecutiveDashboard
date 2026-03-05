'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { checkAlertsWithPrefs, getThresholdMetas, type Alert, type NotificationPreference } from '@/lib/alertEngine';

const PREFS_KEY = 'ep-notification-prefs';

type NotificationContextType = {
  alerts: Alert[];
  unreadCount: number;
  dismissAlert: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  preferences: NotificationPreference[];
  updatePreference: (id: string, enabled: boolean) => void;
  resetPreferences: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

function loadPrefs(): NotificationPreference[] {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(PREFS_KEY) : null;
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return getThresholdMetas().map(m => ({ id: m.id, enabled: true }));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(loadPrefs);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Re-check alerts when preferences change
  useEffect(() => {
    setAlerts(checkAlertsWithPrefs(preferences));
  }, [preferences]);

  // Persist preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    }
  }, [preferences]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const updatePreference = useCallback((id: string, enabled: boolean) => {
    setPreferences(prev => prev.map(p => p.id === id ? { ...p, enabled } : p));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(getThresholdMetas().map(m => ({ id: m.id, enabled: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{
      alerts, unreadCount, dismissAlert, markAsRead, markAllAsRead,
      preferences, updatePreference, resetPreferences,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
