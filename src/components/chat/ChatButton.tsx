'use client';

import { createPortal } from 'react-dom';
import { MessageCircle, X } from 'lucide-react';

type Props = {
  onClick: () => void;
  isOpen: boolean;
  unreadCount: number;
};

export default function ChatButton({ onClick, isOpen, unreadCount }: Props) {
  if (typeof document === 'undefined') return null;

  const button = (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-[var(--color-ep-green)] text-white shadow-lg hover:brightness-110 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center active:scale-95"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? <X size={22} /> : <MessageCircle size={22} />}

      {/* Unread badge */}
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-ep-red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );

  return createPortal(button, document.body);
}
