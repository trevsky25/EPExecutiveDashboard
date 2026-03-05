// Period-over-Period comparison utility
// Merges current and previous period arrays, prefixing previous values with prev_

/**
 * Merge current and previous period data arrays for chart comparison.
 * For each item at index i, copies all current fields, then adds prev_ prefixed
 * fields from previous[i] for the specified value keys.
 *
 * Example:
 *   mergeComparisonData(current, previous, ['financeSave', 'ltoSave'])
 *   => [{ month: 'Jan', financeSave: 48, ltoSave: 40, prev_financeSave: 50, prev_ltoSave: 38 }, ...]
 */
export function mergeComparisonData<T extends Record<string, unknown>>(
  current: T[],
  previous: T[],
  valueKeys: string[],
): (T & Record<string, unknown>)[] {
  return current.map((item, i) => {
    const merged: Record<string, unknown> = { ...item };
    const prev = previous[i];
    if (prev) {
      for (const key of valueKeys) {
        merged[`prev_${key}`] = prev[key];
      }
    }
    return merged as T & Record<string, unknown>;
  });
}
