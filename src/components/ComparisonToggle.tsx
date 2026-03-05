'use client';

type ComparisonToggleProps = {
  enabled: boolean;
  onToggle: (v: boolean) => void;
};

export default function ComparisonToggle({ enabled, onToggle }: ComparisonToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`text-[11px] font-medium px-2.5 py-1 rounded-full cursor-pointer transition-all border ${
        enabled
          ? 'border-[#10b981] text-[#10b981] bg-[#d1fae5]/30'
          : 'border-[var(--color-border)] text-[var(--color-text-muted)] bg-transparent hover:border-[var(--color-text-muted)]'
      }`}
    >
      {enabled ? 'vs Previous' : 'Compare'}
    </button>
  );
}
