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
        className="relative animate-finleyFadeIn bg-white rounded-xl shadow-lg border-2 border-emerald-400 px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:shadow-xl hover:shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
        aria-label="Open Finley"
      >
        <Image src="/finley/finley-05.svg" alt="Finley" width={28} height={28} className="flex-shrink-0" />
        <div className="leading-tight">
          <div className="text-[12px] font-semibold text-[var(--color-text-primary)]">Ask Finley</div>
          <div className="text-[9px] text-[var(--color-text-muted)]">Your data assistant</div>
        </div>

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
