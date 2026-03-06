'use client';

import { ThemeProvider } from '@/lib/ThemeContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import { DashboardProvider } from '@/lib/DashboardContext';
import { OnboardingProvider } from '@/lib/OnboardingContext';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <DashboardProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </DashboardProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
