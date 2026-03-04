'use client';

type ConditionalCellProps = {
  value: number;
  format?: (v: number) => string;
  thresholds: [number, number]; // [greenMax, orangeMax] — above orangeMax = red
  invert?: boolean; // true = lower is worse (e.g. delinquency)
  className?: string;
};

export default function ConditionalCell({
  value,
  format,
  thresholds,
  invert = false,
  className = '',
}: ConditionalCellProps) {
  const [t1, t2] = thresholds;

  let color: string;
  if (invert) {
    // High = bad (delinquency, FPD, etc.)
    color = value <= t1 ? 'text-[var(--color-ep-green)]' : value <= t2 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]';
  } else {
    // High = good (approval rate, save rate, etc.)
    color = value >= t2 ? 'text-[var(--color-ep-green)]' : value >= t1 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]';
  }

  return (
    <span className={`font-medium tabular-nums ${color} ${className}`}>
      {format ? format(value) : value}
    </span>
  );
}
