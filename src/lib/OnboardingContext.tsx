'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'ep-onboarding-complete';

type OnboardingContextType = {
  hasCompletedOnboarding: boolean;
  activeTour: string | null;
  startTour: (tourId: string) => void;
  endTour: () => void;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

function loadCompleted(): boolean {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) === 'true' : false;
  } catch {
    return false;
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(loadCompleted);
  const [activeTour, setActiveTour] = useState<string | null>(null);

  const startTour = useCallback((tourId: string) => {
    setActiveTour(tourId);
  }, []);

  const endTour = useCallback(() => {
    setActiveTour(null);
    if (!hasCompletedOnboarding) {
      setHasCompletedOnboarding(true);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch { /* ignore */ }
    }
  }, [hasCompletedOnboarding]);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    setActiveTour(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  // Auto-start main tour on first visit (after a brief delay for page to render)
  useEffect(() => {
    if (!hasCompletedOnboarding && !activeTour) {
      const timer = setTimeout(() => setActiveTour('main'), 1200);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OnboardingContext.Provider value={{ hasCompletedOnboarding, activeTour, startTour, endTour, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
