'use client';

type Payload = {
  name: string;
  value: number;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Payload[];
  label?: string;
  formatter?: (value: number, name: string) => string;
};

export default function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--color-sidebar)] text-white rounded-lg px-3 py-2.5 shadow-xl border border-white/10 min-w-[140px]">
      {label && (
        <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300">{entry.name}</span>
            </div>
            <span className="font-semibold tabular-nums">
              {formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
