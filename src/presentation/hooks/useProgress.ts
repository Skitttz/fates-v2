'use client';

import { useEffect, useRef, useState } from 'react';

type Run = { active: boolean; resetKey: unknown; progress: number };

export function useProgress(
  active: boolean,
  durationMs: number,
  onDone: () => void,
  resetKey?: unknown,
): number {
  const [run, setRun] = useState<Run>({ active, resetKey, progress: 0 });
  const onDoneRef = useRef(onDone);
  const instant = durationMs <= 0;

  if (run.active !== active || run.resetKey !== resetKey) {
    setRun({ active, resetKey, progress: 0 });
  }

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!active) return;
    if (durationMs <= 0) {
      onDoneRef.current();
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / durationMs));
      setRun((current) => ({ ...current, progress }));
      if (progress >= 1) {
        onDoneRef.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, resetKey]);

  if (!active) return 0;
  return instant ? 1 : run.progress;
}
