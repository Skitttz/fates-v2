'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/presentation/components/ui';
import { meterValueAt, ollieResultFor } from '@/presentation/story/engine/ollie';
import { isActionKey, isFromInteractiveElement } from '@/presentation/story/keyboard';
import { OLLIE_LABELS, OLLIE_WINDOW_STYLE } from './constants';
import { ollieMeterStyles } from './styles';
import { OllieMeterProps } from './types';

export function OllieMeter({ onResult, listening = true }: OllieMeterProps) {
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
    if (!listening) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActionKey(event) || isFromInteractiveElement(event)) return;
      event.preventDefault();
      if (!event.repeat) press();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listening, press]);

  const styles = ollieMeterStyles();
  const levelStyle = { width: `${value}%` };

  return (
    <div className={styles.root()}>
      <p className={styles.hint()}>{OLLIE_LABELS.hint}</p>
      <div
        role="meter"
        aria-label={OLLIE_LABELS.meter}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={styles.meter()}
      >
        <span className={styles.window()} style={OLLIE_WINDOW_STYLE} />
        <span className={styles.level()} style={levelStyle} />
      </div>
      <Button size="lg" onClick={press} className={styles.action()}>
        {OLLIE_LABELS.action}
      </Button>
    </div>
  );
}
