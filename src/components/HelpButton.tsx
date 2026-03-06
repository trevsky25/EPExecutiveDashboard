'use client';

import { HelpCircle } from 'lucide-react';
import { useOnboarding } from '@/lib/OnboardingContext';

type HelpButtonProps = {
  tourId: string;
};

export default function HelpButton({ tourId }: HelpButtonProps) {
  const { startTour } = useOnboarding();

  return (
    <button
      onClick={() => startTour(tourId)}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-ep-green)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
      title="Take a guided tour"
      aria-label="Take a guided tour"
    >
      <HelpCircle size={15} />
    </button>
  );
}
