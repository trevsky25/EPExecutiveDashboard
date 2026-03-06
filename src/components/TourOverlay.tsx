'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import type { CallBackProps, TooltipRenderProps, Step } from 'react-joyride';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useOnboarding } from '@/lib/OnboardingContext';
import { tourRegistry } from '@/data/tourSteps';

// Dynamic import to avoid SSR issues with react-joyride
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

function CustomTooltip({ continuous, index, step, size, backProps, closeProps, primaryProps, skipProps, isLastStep }: TooltipRenderProps) {
  return (
    <div
      className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-2xl max-w-sm animate-fadeInUp"
      style={{ zIndex: 10001 }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-3">
        <div className="flex-1">
          {step.title && (
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{step.title}</h3>
          )}
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">
            Step {index + 1} of {size}
          </span>
        </div>
        <button
          {...closeProps}
          className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
          aria-label="Close tour"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pb-4">
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{step.content}</p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between gap-2">
        {index > 0 ? (
          <button
            {...backProps}
            className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            Back
          </button>
        ) : (
          <button
            {...skipProps}
            className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            Skip Tour
          </button>
        )}

        {continuous && (
          <button
            {...primaryProps}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-ep-green)] text-white hover:brightness-110 transition-all cursor-pointer"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[var(--color-border)] rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-[var(--color-ep-green)] transition-all duration-300"
          style={{ width: `${((index + 1) / size) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Targets that live in the sticky header — need scroll-to-top before highlighting
const HEADER_TARGETS = new Set([
  '[data-tour="search"]',
  '[data-tour="date-filter"]',
  '[data-tour="alert-bell"]',
  '[data-tour="export"]',
  '[data-tour="profile-menu"]',
  '[data-tour="insight-banner"]',
]);

export default function TourOverlay() {
  const { activeTour, endTour } = useOnboarding();

  const handleCallback = useCallback((data: CallBackProps) => {
    const { status, action, type, step } = data;

    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER)
    ) {
      endTour();
    }

    // Before showing a step that targets a sticky-header element, scroll to
    // the top so Joyride can correctly position the spotlight + tooltip.
    if (type === EVENTS.STEP_BEFORE && step) {
      const target = typeof step.target === 'string' ? step.target : '';
      if (HEADER_TARGETS.has(target)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [endTour]);

  // Patch steps so every step scrolls the page to bring the target into view
  const rawSteps = activeTour ? tourRegistry[activeTour] : undefined;
  const steps: Step[] = useMemo(() => {
    if (!rawSteps) return [];
    return rawSteps.map((s) => ({
      ...s,
      disableScrolling: false,
    }));
  }, [rawSteps]);

  if (!activeTour || steps.length === 0) return null;

  return (
    <Joyride
      steps={steps}
      run={true}
      continuous
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      disableScrolling={false}
      scrollOffset={200}
      spotlightClicks={false}
      callback={handleCallback}
      tooltipComponent={CustomTooltip}
      floaterProps={{ disableAnimation: true }}
      styles={{
        options: {
          zIndex: 10000,
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        spotlight: {
          borderRadius: 12,
        },
      }}
    />
  );
}
