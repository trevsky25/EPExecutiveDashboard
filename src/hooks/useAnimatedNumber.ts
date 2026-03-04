'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to the target value using requestAnimationFrame.
 * Returns the current animated value as a string (preserving formatting).
 */
export function useAnimatedNumber(
  target: number,
  duration: number = 600,
  formatFn?: (v: number) => string,
): string {
  const [display, setDisplay] = useState('0');
  const frameRef = useRef<number>();
  const startTime = useRef<number>();
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = 0;
    const to = target;

    // If target changed, reset
    if (prevTarget.current !== target) {
      prevTarget.current = target;
    }

    function step(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;

      setDisplay(formatFn ? formatFn(current) : Math.round(current).toLocaleString());

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    startTime.current = undefined;
    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, formatFn]);

  return display;
}
