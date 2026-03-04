// Date range filtering utilities for the dashboard
// Simulates period-based data filtering on mock data

export type DatePeriod = 'MTD' | 'QTD' | 'YTD' | 'Custom';

export type DateRange = {
  period: DatePeriod;
  startDate?: string;
  endDate?: string;
};

const MONTH_COUNTS: Record<DatePeriod, number> = {
  MTD: 1,
  QTD: 3,
  YTD: 6,
  Custom: 6,
};

/** Slice a time-series array to the last N entries based on selected period */
export function filterTimeSeries<T>(data: T[], range: DateRange): T[] {
  const count = MONTH_COUNTS[range.period];
  if (count >= data.length) return data;
  return data.slice(data.length - count);
}

/** Simulate KPI accumulation for longer periods. MTD returns as-is. */
export function adjustKPIValue(baseValue: number, range: DateRange, opts?: { accumulate?: boolean }): number {
  if (range.period === 'MTD') return baseValue;
  const multiplier = MONTH_COUNTS[range.period];
  if (opts?.accumulate) {
    // For cumulative metrics (volume, revenue) — multiply with slight variance
    return Math.round(baseValue * multiplier * (0.92 + Math.random() * 0.16));
  }
  // For rate/average metrics — return as-is (rates don't accumulate)
  return baseValue;
}

/** Get a display label for the selected date range */
export function getDateRangeLabel(range: DateRange): string {
  switch (range.period) {
    case 'MTD': return 'Month to Date';
    case 'QTD': return 'Quarter to Date';
    case 'YTD': return 'Year to Date';
    case 'Custom': return range.startDate && range.endDate
      ? `${range.startDate} — ${range.endDate}`
      : 'Custom Range';
  }
}
