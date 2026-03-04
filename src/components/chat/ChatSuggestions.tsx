'use client';

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
          className="px-2.5 py-1 text-[11px] rounded-full border border-[var(--color-ep-green)] text-[var(--color-ep-green)] bg-white hover:bg-[var(--color-ep-green-light)] transition-colors cursor-pointer leading-tight"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
