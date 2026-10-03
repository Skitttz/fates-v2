'use client';

import { useEffect, useRef, useState } from 'react';

export function useProgress(
  active: boolean,
  durationMs: number,
  onDone: () => void,
  resetKey?: unknown,
): number {
  const [progress, setProgress] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    if (durationMs <= 0) {
      setProgress(1);
      onDoneRef.current();
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const value = Math.min(1, Math.max(0, (now - start) / durationMs));
      setProgress(value);
      if (value >= 1) {
        onDoneRef.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    setProgress(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, resetKey]);

  return progress;
}
