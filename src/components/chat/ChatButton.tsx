'use client';

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Image from 'next/image';

type Props = {
  onClick: () => void;
  isOpen: boolean;
  unreadCount: number;
};

export default function ChatButton({ onClick, isOpen, unreadCount }: Props) {
  if (typeof document === 'undefined' || isOpen) return null;

  const button = (
    <div className="fixed bottom-6 right-6 z-[9998]">
      <button
        onClick={onClick}
        className="relative animate-finleyFadeIn bg-[var(--color-card-bg)] rounded-lg shadow-lg border-2 border-emerald-400 px-2.5 py-px flex items-center gap-1.5 cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        aria-label="Open Finley"
      >
        <Image src="/finley/finley-05.svg" alt="Finley" width={24} height={24} className="flex-shrink-0" />
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">Ask Finley</span>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-ep-red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );

  return createPortal(button, document.body);
}
