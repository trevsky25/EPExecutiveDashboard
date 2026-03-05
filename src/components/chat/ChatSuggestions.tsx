'use client';

import { Sparkles } from 'lucide-react';

type Props = {
  suggestions: string[];
  onClick: (suggestion: string) => void;
};

export default function ChatSuggestions({ suggestions, onClick }: Props) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onClick(s)}
          className="group flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full border border-[var(--color-border)] text-[var(--color-ep-green)] bg-[var(--color-severity-green-bg)] hover:bg-[var(--color-hover-bg)] hover:border-[var(--color-ep-green)] transition-all cursor-pointer leading-tight"
        >
          <Sparkles size={9} className="text-[var(--color-ep-green)] opacity-0 group-hover:opacity-100 transition-opacity" />
          {s}
        </button>
      ))}
    </div>
  );
}
