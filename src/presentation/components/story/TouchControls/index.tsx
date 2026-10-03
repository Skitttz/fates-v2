'use client';

import { KeyboardEvent, MouseEvent, PointerEvent, memo, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { WalkDirection } from '@/presentation/hooks/useWalk';
import { TOUCH_LABELS } from './constants';
import { touchControlsStyles } from './styles';
import { TouchControlsProps } from './types';

export const TouchControls = memo(function TouchControls({
  visible,
  active = true,
  onDirectionChange,
  onJump,
}: TouchControlsProps) {
  const styles = touchControlsStyles();
  const pointers = useRef(new Map<number, WalkDirection>());
  useEffect(() => {
    if (!visible || !active) pointers.current.clear();
  }, [visible, active]);
  if (!visible) return null;

  const release = (event: PointerEvent<HTMLButtonElement>) => {
    pointers.current.delete(event.pointerId);
    onDirectionChange(Array.from(pointers.current.values()).at(-1) ?? 0);
  };
  const handlers = (direction: WalkDirection) => ({
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      onDirectionChange(direction);
    },
    onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ' ' || event.key === 'Enter') onDirectionChange(0);
    },
    onBlur: () => {
      pointers.current.clear();
      onDirectionChange(0);
    },
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      pointers.current.set(event.pointerId, direction);
      onDirectionChange(direction);
    },
    onPointerUp: release,
    onPointerCancel: release,
    onLostPointerCapture: release,
    onPointerLeave: (event: PointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) release(event);
    },
    onContextMenu: (event: MouseEvent) => event.preventDefault(),
  });

  return (
    <div className={styles.root()}>
      <button
        type="button"
        aria-label={TOUCH_LABELS.left}
        className={styles.button()}
        {...handlers(-1)}
      >
        <ArrowLeftIcon className={styles.icon()} />
      </button>
      <button
        type="button"
        aria-label={TOUCH_LABELS.jump}
        className={styles.button()}
        onPointerDown={(event) => {
          event.preventDefault();
          onJump();
        }}
        onClick={(event) => {
          if (event.detail === 0) onJump();
        }}
        onContextMenu={(event: MouseEvent) => event.preventDefault()}
      >
        <ArrowUpIcon className={styles.icon()} />
      </button>
      <button
        type="button"
        aria-label={TOUCH_LABELS.right}
        className={styles.button()}
        {...handlers(1)}
      >
        <ArrowRightIcon className={styles.icon()} />
      </button>
    </div>
  );
});
