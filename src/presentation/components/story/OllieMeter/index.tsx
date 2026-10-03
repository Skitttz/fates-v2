'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/presentation/components/ui';
import { meterValueAt, OLLIE_WINDOW, ollieResultFor } from '@/presentation/story/engine/ollie';
import { OLLIE_LABELS } from './constants';
import { OllieMeterProps } from './types';

export function OllieMeter({ onResult }: OllieMeterProps) {
  const [value, setValue] = useState(0);
  const startRef = useRef(performance.now());
  const doneRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      setValue(meterValueAt(now - startRef.current));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const press = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onResult(ollieResultFor(meterValueAt(performance.now() - startRef.current)));
  }, [onResult]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== 'Enter') return;
      event.preventDefault();
      press();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [press]);

  return (
    <div className="flex flex-col gap-3 border-4 border-zinc-50 bg-black p-4">
      <p className="font-pixel text-base text-zinc-50">{OLLIE_LABELS.hint}</p>
      <div
        role="meter"
        aria-label={OLLIE_LABELS.meter}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="relative h-5 border-2 border-zinc-50 bg-zinc-900"
      >
        <span
          className="absolute inset-y-0 bg-street-lime/40"
          style={{ left: `${OLLIE_WINDOW.min}%`, width: `${OLLIE_WINDOW.max - OLLIE_WINDOW.min}%` }}
        />
        <span
          className="absolute inset-y-0 left-0 bg-street-orange"
          style={{ width: `${value}%` }}
        />
      </div>
      <Button size="lg" onClick={press} className="touch-manipulation">
        {OLLIE_LABELS.action}
      </Button>
    </div>
  );
}
