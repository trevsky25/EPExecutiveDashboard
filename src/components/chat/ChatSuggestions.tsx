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
          className="group flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer leading-tight"
        >
          <Sparkles size={9} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          {s}
        </button>
      ))}
    </div>
  );
}
