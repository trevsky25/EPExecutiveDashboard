'use client';

import { Pin, PinOff } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';

type PinButtonProps = {
  kpiId: string;
};

export default function PinButton({ kpiId }: PinButtonProps) {
  const { isPinned, togglePin } = useDashboard();
  const pinned = isPinned(kpiId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        togglePin(kpiId);
      }}
      className={`p-1 rounded transition-all cursor-pointer ${
        pinned
          ? 'text-[var(--color-ep-green)] hover:text-[var(--color-ep-red)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-ep-green)]'
      }`}
      title={pinned ? 'Unpin from My Dashboard' : 'Pin to My Dashboard'}
    >
      {pinned ? <PinOff size={13} /> : <Pin size={13} />}
    </button>
  );
}
